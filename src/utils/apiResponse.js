export const successResponse = (res, data = {}, message = "Operation successful", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};
