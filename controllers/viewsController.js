const Tour = require('../Models/tourModel');
const catchAsync = require('../utility/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find()

    res.status(200).render('overview', {
        title: 'All tour',
        tours
    });
});



exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
}