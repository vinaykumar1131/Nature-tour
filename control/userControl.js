const catchasnc = require('./../utils/catcherror');
const mytour = require('../models/makeuser.js');
const Apperror = require('../utils/apperror');
const user = require('../models/makeuser.js');
const factoryHandler=require('./handlefactory')
const filterobj=(obj,...objdet)=>{
    const resobj={};
    Object.keys(obj).forEach(el=>{
      if(objdet.includes(el))
      resobj[el]=obj[el];
    })
    return resobj;
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
})
exports.deleteme=catchasnc(async(req,res,next)=>{
    await mytour.findByIdAndDelete(req.body._id,{active:false});
    res.status(201).json({
        status:"deleted succesfully"
    })
})
exports.getme=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
exports.getuser=factoryHandler.getall(user);
exports.deleteuser=factoryHandler.deleteone(user);
exports.getoneuser=factoryHandler.getone(user);