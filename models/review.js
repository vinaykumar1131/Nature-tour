const mongoose = require('mongoose');
const Tour=require('../models/model')
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review must have something']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tour',
        required: [true, 'every review is related to some Tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'every review is related to some user']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name',
    //     strictPopulate: false
    // }).
    this.populate({
        path: 'user',
        select: 'name photo',
        strictPopulate: false
    })
    next();
})
reviewSchema.statics.calAverageRating=async function(tourid){
        const stats =await this.aggregate([{
            $match:{tour:tourid}
        },
            {
                $group:{
                    _id:'$tour',
                    nRating:{$sum:1},
                    nRatingAverage:{$avg:'$rating'}
                }
            }
        ])
        console.log(stats);
    await Tour.findByIdAndUpdate(tourid,{
        ratingsQuantity:stats[0].nRating,
        ratingsAverage:stats[0].nRatingAverage
    })
};
reviewSchema.post('save',function(){
    this.constructor.calAverageRating(this.tour);
});
reviewSchema.pre(/^findOneAnd/,async function(next) {
    this.r = await this.findOne();
    console.log(this.r);
    next();
  });
// await this.findByIdAndUpdate(this.tour,{
    // reviewSchema.post(/^findOneAnd/, async function() {
    //     // await this.findOne(); does NOT work here, query has already executed
    //     await this.r.constructor.calcAverageRatings(this.r.tour);
    //   });
// })
const review = mongoose.model('Review', reviewSchema);
module.exports = review;
