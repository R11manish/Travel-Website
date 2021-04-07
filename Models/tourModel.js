const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please fill the name '],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A price must be there']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
