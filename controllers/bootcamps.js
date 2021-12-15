const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utilis/errorResponse.js');
const asyncHandler = require('../middlerware/async');

//@desc  GET ALL BOOTCAMPS
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, message: 'Show all bootcamps', data: bootcamps });
});

//@desc  GET A BOOTCAMP
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    message: `Show bootcamp ${req.params.id}`,
    data: bootcamp,
  });
});

//@desc  CREATE NEW BOOTCAMP
//@route POST /api/v1/bootcamps
//@access Privates
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res
    .status(200)
    .json({ success: true, message: `Create new bootcamp`, data: bootcamp });
});

//@desc  Update BOOTCAMP
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    message: `Update bootcamp ${req.params.id}`,
    data: bootcamp,
  });
});

//@desc  DELETE BOOTCAMP
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    message: `Update bootcamp ${req.params.id}`,
    data: {},
  });
});
