const { HTTPSTATUS } = require("./httpConfig");

class AppError extends Error {
  statusCode;
  errorCode;

  constructor(message, statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class HttpException extends AppError {
  constructor(message = "Http Exception Error", statusCode, errorCode) {
    super(message, statusCode, errorCode);
  }
}

class InternalServerException extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
}

class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTPSTATUS.NOT_FOUND, "Resource not found");
  }
}

class BadRequestException extends AppError {
  constructor(message = "Bad Request") {
    super(message, HTTPSTATUS.BAD_REQUEST, "Bad Request");
  }
}

class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, HTTPSTATUS.UNAUTHORIZED, "Unauthorized Access");
  }
}

module.exports = {
  AppError,
  HttpException,
  InternalServerException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
};
