export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      error.cause = 500;
      return next(error);
    }
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 400).json({
    message: error.message,
    stack: process.env.MODE === "development" ? error.stack : undefined,
  });
};

export const successResponse = ({
  res,
  message = "done",
  status = 200,
  data = {},
} = {}) => {
  return res.status(status).json({ message, data });
};
