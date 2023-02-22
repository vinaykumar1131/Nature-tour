const stripe=require('stripe')(process.env.stripekey);
const tour=require('../models/model')
exports.getCheckoutSession= async (req,res,next)=>{
const tours=await tour.findById(req.params.tourid);
const session= await stripe.checkout.sessions.create({
payment_method_types:['card'],
success_url:`${req.protocol}://${req.get('host')}/`,
cancle_url:`${req.protocol}://${req.get('host')}/tour/${tours.slug}`,
customer_email:req.user.email,
client_refrence_id:req.params.tourid


})
}