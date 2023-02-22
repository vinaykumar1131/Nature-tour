const express=require('express')
const routes=express.Router();
const viewControl=require('../control/viewControl')
const AuthControl=require('../control/Authcontrol');
routes.route('/').get(AuthControl.isLoggedIn, viewControl.getOverview)
routes.route('/tour/:slug').get(AuthControl.isLoggedIn, viewControl.getTour)
routes.route('/login').get(viewControl.LoginUser)
routes.route('/signup').get(viewControl.signuser)
routes.route('/me').get(AuthControl.protect,viewControl.getaccount)
routes.route('/submit-user-data').post(AuthControl.protect,viewControl.updateuser)
module.exports=routes