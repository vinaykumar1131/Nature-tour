const express=require('express');
const AuthControl=require('../control/Authcontrol');
const userControl=require('../control/userControl');
const routes=express.Router();
routes.route('/signup').post(AuthControl.postuser);
routes.route('/login').post(AuthControl.loginuser);
routes.route('/logout').get(AuthControl.logoutuser);
routes.route('/forgotpassword').post(AuthControl.forgotpassword);
routes.route('/resetPassword/:token').patch(AuthControl.resetPassword);
routes.use(AuthControl.protect)
routes.route('/updatepass').patch(AuthControl.updatepassword);
routes.route('/updateme').patch(userControl.userPhoto, userControl.resizephoto,userControl.updateme);
routes.route('/deleteme').delete(userControl.deleteme);
routes.route('/alluser').get(userControl.getuser)
 routes.route('/getme').get(userControl.getme,userControl.getoneuser)
 routes.use(AuthControl.restictto('admin'));
routes.route('/:id').get(userControl.getoneuser).delete(userControl.deleteme)
module.exports=routes;

