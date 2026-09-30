import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { CONFIG } from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");
import { db } from "./data/database.js";
import { dbConnection } from "./data/dbConnection.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/logger.js";
import {
  generalRateLimiter,
  authRateLimiter,
  nlpRateLimiter,
  assessmentRateLimiter
} from "./middleware/rateLimiter.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

import { authRouter } from "./routes/authRoutes.js";
import { patientRouter } from "./routes/patientRoutes.js";
import { questionnaireRouter } from "./routes/questionnaireRoutes.js";
import { observationRouter } from "./routes/observationRoutes.js";
import { prakritiRouter } from "./routes/prakritiRoutes.js";
import { assessmentRouter } from "./routes/assessmentRoutes.js";
import { reportRouter } from "./routes/reportRoutes.js";
import { doctorRouter } from "./routes/doctorRoutes.js";

const app = express();
app.set("trust proxy", 1);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (CONFIG.ALLOWED_ORIGINS.includes("*") || CONFIG.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (/^https?:\/\/([a-z0-9-]+\.)?tridoshalab\.com(:[0-9]+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (/^http:\/\/localhost(:[0-9]+)?$/.test(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"]
  })
);
app.use(express.json({ limit: "2mb" }));

// 1. Request ID Middleware (attaches req.id and sets X-Request-Id header)
app.use(requestIdMiddleware);

// 2. Structured Request Logging (redacts passwords and tokens)
app.use(requestLogger);

// 3. Global General Rate Limiter
app.use(generalRateLimiter);

// Explicit Robots.txt handler ensuring immediate crawler allow directive
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.send("User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://gramintelai-ayuressence.onrender.com/sitemap.xml\nSitemap: https://tridoshalab.com/sitemap.xml\n");
});

// Explicit Sitemap.xml handler
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gramintelai-ayuressence.onrender.com/</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tridoshalab.com/</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);
});

// Health check endpoint (Preserved and enhanced)
app.get("/api/health", async (req, res) => {
  const health = await dbConnection.healthCheck();
  res.json({
    success: true,
    message: "TridoshaLab API backend is running",
    status: "healthy",
    service: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: db.isConnected() ? "connected" : "error",
      mode: health.mode || "embedded_acid",
      usersCount: db.getCollection("users").length,
      patientsCount: db.getCollection("patients").length,
      assessmentsCount: db.getCollection("assessments").length,
      questionsCount: db.getCollection("questions").length
    },
    institutions: CONFIG.INSTITUTIONS
  });
});

// Deep Readiness check endpoint
app.get("/api/health/ready", async (req, res) => {
  const isDbConnected = db.isConnected();
  const health = await dbConnection.healthCheck();

  if (isDbConnected && health.status === "connected") {
    return res.json({
      success: true,
      ready: true,
      status: "READY",
      timestamp: new Date().toISOString(),
      database: health.status,
      mode: health.mode
    });
  } else {
    return res.status(503).json({
      success: false,
      ready: false,
      status: "NOT_READY",
      timestamp: new Date().toISOString(),
      database: "error",
      message: "Database connection unavailable."
    });
  }
});

// API Documentation Directory Endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    title: "TridoshaLab API Documentation - Production Hardened v3.0",
    sponsor: "SDM College of Ayurveda, Udupi & SMVITM Bantakal",
    endpoints: [
      {
        module: "1. Core Data Models & Auth",
        routes: [
          { method: "POST", path: "/api/auth/register", desc: "Register doctor, student, or patient" },
          { method: "POST", path: "/api/auth/login", desc: "Login with email & password, returns JWT token" },
          { method: "GET", path: "/api/auth/me", desc: "Get current authenticated user profile and role" },
          { method: "GET", path: "/api/auth/roles", desc: "RBAC permission matrix" }
        ]
      },
      {
        module: "2. Patient Profile & History",
        routes: [
          { method: "GET", path: "/api/patients", desc: "List patients with search, filter, and pagination" },
          { method: "GET", path: "/api/patients/:id", desc: "Get patient profile with linked assessments" },
          { method: "POST", path: "/api/patients", desc: "Create new patient profile (Doctor & Student)" },
          { method: "PUT", path: "/api/patients/:id", desc: "Update patient demographics (Doctor only)" },
          { method: "DELETE", path: "/api/patients/:id", desc: "Delete patient (Doctor only)" },
          { method: "GET", path: "/api/patients/:id/history", desc: "Longitudinal history & trend data (e.g. Mr. Kamath's visits)" }
        ]
      },
      {
        module: "3. Questionnaire Engine & Question CRUD",
        routes: [
          { method: "GET", path: "/api/questionnaires", desc: "List questionnaires with items, categories, options (cached)" },
          { method: "GET", path: "/api/questionnaires/:id", desc: "Get questionnaire by id with questions" },
          { method: "POST", path: "/api/questionnaires", desc: "Create a new questionnaire" },
          { method: "GET", path: "/api/questionnaires/standard", desc: "Serve baseline standardized 24-question questionnaire" },
          { method: "GET", path: "/api/questionnaires/questions", desc: "List questions with dimension filters" },
          { method: "POST", path: "/api/questionnaires/questions", desc: "Create custom question (Doctor only)" },
          { method: "PUT", path: "/api/questionnaires/questions/:id", desc: "Update custom question (Doctor only)" },
          { method: "DELETE", path: "/api/questionnaires/questions/:id", desc: "Delete custom question (Doctor only)" },
          { method: "POST", path: "/api/questionnaires/import", desc: "Import questionnaire bundle JSON" }
        ]
      },
      {
        module: "4. Practitioner Observation & NLP Hook",
        routes: [
          { method: "POST", path: "/api/nlp/analyze", desc: "NLP analyzer extracting Dosha signals from clinical text" },
          { method: "POST", path: "/api/nlp/extract", desc: "NLP hook extracting Dosha signals from free-form text" },
          { method: "POST", path: "/api/observations", desc: "Save free-form clinical notes & Ashtavidha for assessment" },
          { method: "GET", path: "/api/observations/:assessmentId", desc: "Retrieve observations for assessment" }
        ]
      },
      {
        module: "5. Classical Prakriti Calculation Service & Adaptive Scoring",
        routes: [
          { method: "POST", path: "/api/prakriti/calculate", desc: "Callable calculation service (V/P/K %, dominant dosha, V+P+K=100)" },
          { method: "GET", path: "/api/prakriti/methodology", desc: "Classical Ayurvedic citations (Charaka, Sushruta, Vagbhata)" }
        ]
      },
      {
        module: "6. Assessment & Reports (State Machine & Immutability)",
        routes: [
          { method: "POST", path: "/api/assessments", desc: "Create assessment (Doctor, Student). Patients blocked." },
          { method: "GET", path: "/api/assessments/:id", desc: "Get raw assessment record" },
          { method: "GET", path: "/api/assessments/my", desc: "Get all assessments of current user with pagination" },
          { method: "PUT", path: "/api/assessments/:id", desc: "Update assessment (immutable once FINALIZED)" },
          { method: "POST", path: "/api/assessments/:id/submit", desc: "Submit draft assessment for review" },
          { method: "PUT", path: "/api/assessments/:id/question-notes/:questionId", desc: "Save per-question observation note" },
          { method: "POST", path: "/api/assessments/:id/patient-message", desc: "Save patient-facing additional message" },
          { method: "POST", path: "/api/assessments/:id/transcription", desc: "Insert voice transcription into chosen destination" },
          { method: "GET", path: "/api/assessments/:id/adaptive", desc: "Provisional adaptive dosha evaluation against 80% threshold" },
          { method: "PUT", path: "/api/assessments/:id/finalize", desc: "Atomic finalize assessment (Doctor only)" },
          { method: "GET", path: "/api/reports/:assessmentId", desc: "Fetch structured constitutional report" },
          { method: "GET", path: "/api/assessments/:id/report?level=doctor|patient", desc: "Generate dual-level report" }
        ]
      },
      {
        module: "7. Doctor Workflow & Report Delivery",
        routes: [
          { method: "GET", path: "/api/doctor/assessments", desc: "Doctor list of all assessments for review" },
          { method: "GET", path: "/api/doctor/assessments/:id", desc: "Doctor review specific assessment" },
          { method: "POST", path: "/api/doctor/assessments/:id/finalize", desc: "Doctor atomic finalization (concurrency-safe)" },
          { method: "POST", path: "/api/doctor/assessments/:id/deliver-report", desc: "Deliver finalized report to patient" }
        ]
      }
    ]
  });
});

// Mount Routes with specific rate limiters
app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/patients", patientRouter);
app.use("/api/questionnaires", questionnaireRouter);
app.use("/api/observations", observationRouter);
app.use("/api/nlp", nlpRateLimiter, observationRouter);
app.use("/api/prakriti", prakritiRouter);
app.use("/api/assessments", assessmentRateLimiter, assessmentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/doctor", doctorRouter);

// Serve static frontend assets from dist if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 404 handler for unmatched API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.method} ${req.originalUrl}' not found. Check /api/docs for available routes.`,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found. Check /api/docs for available routes.`,
    errorCode: "NOT_FOUND",
    requestId: req.id
  });
});

// Single Page Application (SPA) client-side routing fallback for non-API GET requests
app.use((req, res, next) => {
  if (req.method === "GET") {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// Generic 404 handler for any other unmatched requests
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.method} ${req.originalUrl}' not found. Check /api/docs for available routes.`,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found. Check /api/docs for available routes.`,
    errorCode: "NOT_FOUND",
    requestId: req.id
  });
});

// Centralized Error handling middleware
app.use(globalErrorHandler);

// Start Server if invoked directly
const isRunningTests = process.env.NODE_ENV === "test" || process.argv[1]?.includes("test");
let serverInstance = null;

if (!isRunningTests) {
  serverInstance = app.listen(CONFIG.PORT, () => {
    console.log(`🌿 TridoshaLab Backend running on http://localhost:${CONFIG.PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${CONFIG.PORT}/api/docs`);
    console.log(`🩺 Health check at http://localhost:${CONFIG.PORT}/api/health`);
    console.log(`🩺 Readiness check at http://localhost:${CONFIG.PORT}/api/health/ready`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down TridoshaLab gracefully...`);
    if (serverInstance) {
      serverInstance.close(async () => {
        console.log("HTTP server closed.");
        await dbConnection.close();
        console.log("Database connections closed.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

export default app;
