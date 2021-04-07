const Tour = require('../Models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
};

exports.createTour = (req, res) => {};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
