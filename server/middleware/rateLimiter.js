/**
 * Lightweight, in-memory rate limiter middleware
 * Provides tiered limits based on route sensitivity.
 */

class MemoryRateLimiter {
  constructor() {
    this.hits = new Map();
    // Periodically clean up expired entries every 2 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 120000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.hits.entries()) {
      if (now > data.resetTime) {
        this.hits.delete(key);
      }
    }
  }

  createLimiter(options = {}) {
    const windowMs = options.windowMs || 60 * 1000; // default 1 minute
    const max = options.max || 100; // default 100 requests per window
    const message = options.message || "Too many requests. Please try again later.";

    return (req, res, next) => {
      // In test mode or when rate limiting is disabled, allow through
      if (process.env.NODE_ENV === "test" && !process.env.ENABLE_RATE_LIMIT_TEST) {
        return next();
      }

      // Determine client IP or token ID
      const clientKey = req.user?.id || req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
      const bucketKey = `${options.name || "default"}:${clientKey}`;
      const now = Date.now();

      let record = this.hits.get(bucketKey);
      if (!record || now > record.resetTime) {
        record = {
          count: 1,
          resetTime: now + windowMs
        };
        this.hits.set(bucketKey, record);
      } else {
        record.count++;
      }

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
      res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

      if (record.count > max) {
        res.setHeader("Retry-After", Math.ceil((record.resetTime - now) / 1000));
        return res.status(429).json({
          success: false,
          message,
          error: message,
          errorCode: "RATE_LIMIT_EXCEEDED",
          requestId: req.id || req.requestId || "unknown"
        });
      }

      next();
    };
  }
}

export const rateLimiterManager = new MemoryRateLimiter();

// Tiered limiters
export const authRateLimiter = rateLimiterManager.createLimiter({
  name: "auth",
  windowMs: 60 * 1000,
  max: 30, // 30 attempts per minute per IP
  message: "Too many authentication attempts. Please try again after 1 minute."
});

export const nlpRateLimiter = rateLimiterManager.createLimiter({
  name: "nlp",
  windowMs: 60 * 1000,
  max: 50,
  message: "NLP analysis request rate limit reached. Please wait a moment."
});

export const assessmentRateLimiter = rateLimiterManager.createLimiter({
  name: "assessment_submission",
  windowMs: 60 * 1000,
  max: 60,
  message: "Assessment submission rate limit exceeded. Please wait a moment."
});

export const generalRateLimiter = rateLimiterManager.createLimiter({
  name: "general",
  windowMs: 60 * 1000,
  max: 300,
  message: "Too many requests to the AyurEssence API. Please slow down."
});
