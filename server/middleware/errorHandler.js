/**
 * Centralized Error Handling Framework for AyurEssence
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR", details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied.", errorCode = "FORBIDDEN") {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.", errorCode = "NOT_FOUND") {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict.", errorCode = "CONFLICT") {
    super(message, 409, errorCode);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

/**
 * Global Express Error Handling Middleware
 */
export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const errorCode = err.errorCode || (statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : statusCode === 401 ? "UNAUTHORIZED" : statusCode === 409 ? "CONFLICT" : statusCode === 429 ? "RATE_LIMIT_EXCEEDED" : "INTERNAL_SERVER_ERROR");
  const message = err.message || "An unexpected error occurred.";
  const requestId = req.id || req.requestId || "unknown";

  if (process.env.NODE_ENV !== "test" && statusCode >= 500) {
    console.error(`[ERROR] [${new Date().toISOString()}] [Req: ${requestId}] ${err.name || "Error"}: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  const response = {
    success: false,
    message,
    error: message, // preserved for backward-compatibility with older tests
    errorCode,
    requestId
  };

  if (err.details) {
    response.details = err.details;
  }

  // Never leak internal stack traces or database connection details in production
  if (process.env.NODE_ENV === "development" && statusCode >= 500) {
    response.debugStack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Async handler wrapper to catch unhandled promise rejections
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
