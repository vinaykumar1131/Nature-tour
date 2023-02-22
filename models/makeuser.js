const mongoose=require('mongoose');
const crypto = require('crypto');
const validator=require('validator');
const bcrpt=require('bcryptjs');
const userschema=new mongoose.Schema({
    name:{
    type:String,
    required:[true,"Every user have some name"]
    },
    email:{
        type:String,
        required:[true,"Every user must have a email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    photo:{
type:String,
default:'default.jpg'
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:8,
        select:false
    },
    conformpass:{
        type:String,
        required:[true,"please provide a conform password"],
        validate:{
            validator:function(el){
                return this.password===el;
            },
            message:"conform password is not same"
        }  
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
      },
      passwordChangedAt:Date,
      passwordResettoken:String,
      passwordResetExpires:Date,
      active:{
        type:Boolean,
        default:true,
        select:false
      }
});
userschema.pre('save',async function(next){
    if(!this.isModified('password')|| this.isNew)
    return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})
userschema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });
userschema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrpt.hash(this.password,12);
    this.conformpass=undefined;
    next();
})

userschema.methods.correctPassword=async function(candiatepass,userpass){
    return await bcrpt.compare(candiatepass,userpass);
}
userschema.methods.resetpasswordtoken= function(){
    const token=crypto.randomBytes(32).toString('hex');
    this.passwordResettoken=crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    // console.log({token});
    // console.log(this.passwordResettoken);
    return token;
}
const user=mongoose.model("user",userschema);
module.exports=user;