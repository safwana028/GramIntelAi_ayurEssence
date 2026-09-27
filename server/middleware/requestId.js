import crypto from "crypto";

/**
 * Request ID Middleware
 * Assigns a unique request ID to each incoming request and sets the X-Request-Id header.
 */
export function requestIdMiddleware(req, res, next) {
  const incomingId = req.headers["x-request-id"];
  const requestId = (typeof incomingId === "string" && incomingId.trim()) 
    ? incomingId.trim() 
    : crypto.randomUUID();

  req.id = requestId;
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}
