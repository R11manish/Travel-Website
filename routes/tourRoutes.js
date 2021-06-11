const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/month-stats/:year').get(tourController.getMonthStats);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.deleteTour
  );
//very important use case of clousers in above route where we have restrictTo function. bascially promblem over here is how we gonna to pass 
//parmater so in order this particular way for it and the way which we find is clousers

// just for reference
// POST /tour/324gd3ds/reviews
// GET /tour/332fsf343/reviews
// GET /tour/3432DF334/reviews/343dfs343
router.route('/:tourId/reviews')
.post(
  authController.protect,
  authController.restrictTo('user'),
  reviewController.createReview
);

module.exports = router;
