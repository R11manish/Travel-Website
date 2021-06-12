const AppError = require('./../utility/appError');
const catchAsync = require('./../utility/catchAsync');
const APIFeatures = require('../utility/features');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('There is no such doc exist with this ID', 404));
    }

    res.status(204).json({
        status: 'Success',
        data: 'null'
    });
});


exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('There is no such document exist with this ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, populateOption) => catchAsync(async (req, res, next) => {

    let query = Model.findById(req.params.id);
    if (populateOption) query = query.populate(populateOption);

    const doc = await query;

    if (!doc) {
        return next(new AppError('There is no such document exist with this ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            doc
        }
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on our tour (hack)
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .field()
        .pagination();
    //execute query
    const doc = await features.query;

    res.status(200).json({
        status: 'Success',
        results: doc.length,
        data: { doc }
    });
});