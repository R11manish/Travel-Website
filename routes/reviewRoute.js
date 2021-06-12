const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');


const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview)


router
    .route('/:id')
    .patch(authController.protect, authController.restrictTo('admin', 'user'), reviewController.updateReview)
    .delete(authController.protect, authController.restrictTo('admin', 'user'), reviewController.deleteReview);


module.exports = router;