const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const body = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

const paginatedResponse = (res, { data, total, page, limit, totalPages }, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: { total, page, limit, totalPages },
    timestamp: new Date().toISOString(),
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };