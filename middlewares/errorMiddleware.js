const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logger");

function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`);

  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
