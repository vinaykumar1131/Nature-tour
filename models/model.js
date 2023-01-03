const mongoose = require('mongoose');
const slugify=require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "every tour have some name"]
  },
  slug:String,
  duration: {
    type: String,
    required: [true, "every tour have some duration"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "every tour have a price"]
  },
  pricediscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "every tour have some discription"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "Every tour have some images"]
  },
  images: [String],
  CreatedAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    Address: String,
    description: String
  }
  ,
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      Address: String,
      description: String,
      day: Number
    }
  ],
  guides: [{
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }]
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
tourSchema.index({slug:1})
tourSchema.index({ startLocation: '2dsphere' });
  tourSchema.pre(/^find/,function(next){
      this.populate({
        path:'guides',
        select:'name photo role',
        strictPopulate:false
      });
    next();
  })
tourSchema.virtual('timetakem').get(function () {
  return this.duration / 7;
})
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.virtual('review',{
ref:'Review',
foreignField:'tour',
localField:'_id'
})
const mytour = mongoose.model('tour', tourSchema);
module.exports = mytour;
