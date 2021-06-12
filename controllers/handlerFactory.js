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