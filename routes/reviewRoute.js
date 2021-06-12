const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');


const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)


router
    .route('/:id')
    .delete(authController.protect, authController.restrictTo('admin', 'user'), reviewController.deleteReview);


module.exports = router;