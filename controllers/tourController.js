/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../Models/tourModel');
const APIFeatures = require('../utility/features');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.field = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .field()
    .pagination();
  //execute query
  const tours = await features.query;

  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: { tours }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findById(req.params.id).populate('reviews');

  if (!tours) {
    return next(new AppError('There is no such tour exist with this ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tours
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tours) {
    return next(new AppError('There is no such tour exist with this ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
});

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: '$difficulty',
        myCount: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({
    status: 'Success',
    data: stats
  });
});

exports.getMonthStats = catchAsync(async (req, res, next) => {
  let year = req.params.year;

  const stats = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTour: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numOfTour: -1
      }
    },
    {
      $limit: 6
    }
  ]);

  res.status(200).json({
    status: 'Success',
    result: stats.length,
    data: stats
  });
});
