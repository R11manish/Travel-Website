const Tour = require('../Models/tourModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find()

    res.status(200).render('overview', {
        title: 'All tour',
        tours
    });
});



exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        field: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
});


exports.getLoginForm = async (req, res) => {
    res.status(200).render('login', {
        title: 'Log in to your account'
    });
}