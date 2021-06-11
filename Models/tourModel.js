const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please fill the name '],
      unique: true,
      trim: true,
      maxLength: [40, 'maximum name value for the tour should be 40'],
      minLength: [10, 'minimum name value for the tour should be atleast 10'],
      // validate: [
      //   validator.isAlpha,
      //   'The tour name must only contains characters'
      // ]
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'It must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'It must have a size of the group']
    },
    difficulty: {
      type: String,
      required: [true, 'It must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'a tour must have only either of these value - easy | medium | diffcult '
      }
    },
    ratingAverage: {
      type: Number,
      min: [1, 'The minimum value must value above 1.0'],
      max: [5, 'The maximum  value must value below 5.0']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'A price must be there']
    },
    discount: {
      //this validation is not going to work for updateRoute
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message:
          'discount price should be less than the regular price: ({VALUE})'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description']
    },
    discription: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A imagecover must be required']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    startLocation: {
      //GeoJSOn
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address :  String,
      description : String
    },
    locations : [{
      type : {
        type : String,
        default : 'Point',
        enum : ['Point']
      },
      coordinates : [Number],
      address : String,
      description : String,
      day : Number
    }],
    guides : [
      {type : mongoose.Schema.ObjectId,
       ref : 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('duration-week').get(function() {
  return this.duration / 7;
});

//this is virtual populate
tourSchema.virtual('reviews', {
  ref : 'Review',
  foreignField : 'tour',
  localField : '_id'
});

//document middleware - .save() , .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// works by embeding document
// tourSchema.pre('save' , async function(next){
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });



//Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.time = Date.now();
  next();
});

tourSchema.pre(/^find/ , function(next){
  this.populate({
    path : 'guides',
    select : '-__v -passwordChangedAt'
  });
  next();
});



tourSchema.post(/^find/, function(docs, next) {
  console.log(`Time Taken by Query ${this.time - Date.now()}`);
  next();
});

//aggreation middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
