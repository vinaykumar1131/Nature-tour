const express=require('express');
const AuthControl=require('../control/Authcontrol');
const bookingcontrol=require('../control/bookingcontrol');
const routes=express.Router();
routes.get('/checkout-session/:toudid',AuthControl.protect,bookingcontrol.getCheckoutSession)
module.exports=routes;