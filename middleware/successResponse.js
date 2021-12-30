const successResponse = (
  res,
  data,
  message = 'Succesful operation',
  code = 200
) => {
  res.status(code).json({
    success: true,
    message: message,
    data: data,
  });
};

module.exports = successResponse;
