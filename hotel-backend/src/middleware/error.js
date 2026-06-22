const ApiError = require("../utils/ApiError");

function notFound(_req, _res, next) {
  next(new ApiError(404, "Route not found"));
}

function errorHandler(err, _req, res, _next) {
  let { statusCode = 500, message = "Internal server error", details } = err;

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate ${field}`;
  } else if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  const payload = {
    success: false,
    statusCode,
    message,
  };
  if (details) payload.details = details;

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json(payload);
}

module.exports = { notFound, errorHandler };