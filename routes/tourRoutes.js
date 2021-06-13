const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRoute = require('./../routes/reviewRoute');

const router = express.Router();

// just for reference
// POST /tour/324gd3ds/reviews
router.use('/:tourId/reviews', reviewRoute);
// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/month-stats/:year').get(authController.protect,
  authController.restrictTo('admin', 'lead-guide'), tourController.getMonthStats);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
//very important use case of clousers in above route where we have restrictTo function. bascially promblem over here is how we gonna to pass 
//parmater so in order this particular way for it and the way which we find is clousers


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/-40,45/unit/mil
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

module.exports = router;