const review = require('../models/review.js');
const factoryHandler=require('./handlefactory');
exports.setTourUserIds=(req,res,next)=>{
    if(!req.body.tour)
    req.body.tour=req.params.tourid;
    if(!req.body.user)
    req.body.user=req.user.id
    next();
}
exports.createreview = factoryHandler.createone(review);
exports.getall = factoryHandler.getall(review);
exports.deletefun=factoryHandler.deleteone(review);
exports.getonereview=factoryHandler.getone(review);
exports.updateOne=factoryHandler.UpdateOne(review);