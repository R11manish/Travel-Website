const Tour = require('../Models/tourModel');
const catchAsync = require('../utility/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find()

    res.status(200).render('overview', {
        title: 'All tour',
        tours
    });
});



exports.getTour = catchAsync(async (req, res , next) => {

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path : 'reviews',
        field : 'review rating user'
    });

    res.status(200).render('tour', {
        title: req.params.slug ,
        tour
    })
});