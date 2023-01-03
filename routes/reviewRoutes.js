const express=require('express');
const AuthControl=require('../control/Authcontrol');
const reviewcon=require('../control/reviewsControl.js');
const routes=express.Router({mergeParams:true});
routes.use(AuthControl.protect)
routes.route('/')
.get(reviewcon.getall)
.post(reviewcon.setTourUserIds,reviewcon.createreview);

routes.route('/:id')
.get(reviewcon.getonereview)
.patch(AuthControl.restictto('user','admin'),reviewcon.updateOne)
.delete(reviewcon.deletefun);
module.exports=routes;