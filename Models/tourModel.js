const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please fill the name '],
    unique: true,
    trim: true
  },
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
    required: [true, 'It must have a difficulty']
  },
  ratingAverage: {
    type: Number,
    default: 4.5
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
  discount: Number,
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
    default: Date.now()
  },
  startDate: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
