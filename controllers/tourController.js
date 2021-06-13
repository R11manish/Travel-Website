/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../Models/tourModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.field = 'name,price,ratingAverage,summary,difficulty';
  next();
};

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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/center/-40,45/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(new AppError('please provide latitude and longitude in the format of lat,lng', 400));
  }
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  console.log(distance, latlng, unit);

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
});

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);