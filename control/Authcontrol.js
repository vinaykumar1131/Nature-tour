const Apperror = require('../utils/apperror');
const mytour = require('../models/makeuser.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const sendmail=require('./../utils/email');
const catchasnc = require('./../utils/catcherror');

const createsendtoken=(users,res,status)=>{
    const token = tokens(users._id);
    const setcookie={
        expiresIn:new Date(Date.now()*90*24*60*60*1000),
        httpOnly:true
    }
    console.log("i call the create token")
    if(process.env.NODE_ENV=='production')
    setcookie.secure=true;
    res.cookie('jwt',token,setcookie);
    users.password=undefined;
    res.status(status).json({
        status:"Success",
        data:users,
        token
    })
}
const tokens = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
}

exports.postuser = catchasnc(async (req, res, next) => {
    console.log("i call this")
    const postss = await mytour.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        conformpass: req.body.conformpass,
        role:req.body.role
    });   
    createsendtoken(postss,res,201);
});
exports.loginuser = catchasnc(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(401).json({
            status: "please provide the detials"
        })
    }
    const user = await mytour.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: "please provide the correct pasword"
        })
    }  
    createsendtoken(user,res,201);
});



exports.protect = catchasnc(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.cookies.jwt)
    token=req.cookies.jwt
    if (!token) {
        return next(new Apperror('You are not logged in! Please log in to get access.', 401));
    }
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await mytour.findById(decode.id);
    if (!currentUser) {
      return next(
        new Apperror(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  req.user=currentUser;
  res.locals.user = currentUser;
  console.log("i am from the protect")
    next();
})

exports.restictto=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new Apperror('you have no permissiont to do this action',401));
        }
        next();
    }
}
exports.forgotpassword=catchasnc(async(req,res,next)=>{
    const reset=await mytour.findOne({email:req.body.email});
    if(!reset){
        return next(new Apperror('there is no email address with that email',401));
    }
const token=reset.resetpasswordtoken();
await reset.save({validateBeforeSave:false});
const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;
const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
try{
await sendmail({
    email:reset.email,
    subject:"your password",
    message
})
createsendtoken(reset,res,201);
}catch(err){
    reset.passwordResetExpires=undefined;
    reset.passwordResettoken=undefined;
    await reset.save({validateBeforeSave:false});
console.log(err);
    return next(new Apperror('their is some erroe for this page',401));
}
})

exports.resetPassword=catchasnc(async (req,res,next)=>{
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await mytour.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new Apperror('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.conformpass = req.body.conformpass;
  user.passwordResettoken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
createsendtoken(user,res,201);
})
exports.updatepassword=catchasnc(async(req,res,next)=>{
    const user=await mytour.findById(req.user._id).select('+password');
    if(!(await user.correctPassword(req.body.currentpass,user.password))){
    return next(new Apperror("there is some security problem",401)); }
    user.password=req.body.password;
    user.conformpass=req.body.conformpass;
    await user.save();
    createsendtoken(user,res,201);
})
function filterobj(obj,allowObject){
  const newobj={};
  Object.keys(obj).forEach(el=>{
    if(allowObject.includes(el)){
      newobj[el]=obj[el];
    }
  })
  return newobj;
}
exports.updateme=catchasnc(async(req,res,next)=>{
    if(req.body.password || req.body.conformpass){
        return next(new Apperror('you have a other route for changing this',401));
    }
    const fillobj=filterobj(req.body,'name','email');
    const update=await mytour.findByIdAndUpdate(req.user._id,fillobj,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        user: update
      }
    });
})

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await mytour.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

     

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
  exports.logoutuser=(req,res)=>{
    res.cookie('jwt',"vinay",{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      res.status(200).json({status:"Success"})
  }