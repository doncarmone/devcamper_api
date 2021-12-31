const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middleware/async');
const successResponse = require('../middleware/successResponse.js');
const sendEmail = require('../utils/sendEmail');

//@desc  GET all users
//@route GET /api/v1/auth/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc  GET A USER
//@route GET /api/v1/auth/users/:id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  successResponse(res, user, 'User fetched');
});

//@desc  POST CREATE USER
//@route POST /api/v1/auth/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  successResponse(res, user, 'User Created', 201);
});

//@desc  Put Updarte USER
//@route Put /api/v1/auth/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  successResponse(res, user, 'User Updated');
});

//@desc  Delete Updarte USER
//@route DELETE /api/v1/auth/users/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  successResponse(res, {}, 'User Deleted');
});
