const Review = require('../Models/reviewModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');

//display all the reviews
exports.getAllReview = catchAsync( async (req,res,next) =>{
    const reviews =  await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews
        }
      });
});

//function to create a review
exports.createReview = catchAsync( async (req,res,next) => {
    const createReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
          review : createReview
        }
      });
});


