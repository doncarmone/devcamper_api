const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('Token', token);
  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }
  //Make Sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        'NOT AUTHORIZE TO ACCESS THIS ROUTE...' + req.headers.authorization,
        401
      )
    );
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await console.log('decooded :>> ', decoded);
    // await console.log('USER :>> ', await User.findById(decoded.id));
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse('NOT AUTHORIZE TO ACCESS THIS ROUTE!!!!!!!', 401)
    );
  }
});

//Grant Access to specific roles

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is unauthorized to commit this action`,
          403
        )
      );
    }
    next();
  };
};
