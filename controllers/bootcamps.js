const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middlerware/async');
const path = require('path');

//@desc  GET ALL BOOTCAMPS
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }

  bootcamp.remove();
  res.status(200).json({
    success: true,
    message: `Deleted bootcamp ${req.params.id}`,
    data: {},
  });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  console.info(`${zipcode} ${distance}`);

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.info(bootcamps);

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc  UPLOAD PHOTO BOOTCAMP
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`upload a photo`, 400));
  }

  const file = req.files.file;
  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  }

  //Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log('LOG', file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      message: `photo uploaded for bootcamp ${req.params.id}`,
      data: file.name,
    });
  });
});
