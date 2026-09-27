/**
 * Structured Request & Audit Logger Middleware
 * Logs non-sensitive request metrics and request IDs.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.id || "system";

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      const userRole = req.user?.role || "anonymous";
      const userId = req.user?.id || "anon";
      console.log(
        `[${new Date().toISOString()}] [Req: ${requestId}] [${userRole}:${userId}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
}
