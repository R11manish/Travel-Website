const AppError = require('./../utility/appError');
const catchAsync = require('./../utility/catchAsync');

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