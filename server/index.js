import express from "express";
import cors from "cors";
import { CONFIG } from "./config/config.js";
import { db } from "./data/database.js";
import { authRouter } from "./routes/authRoutes.js";
import { patientRouter } from "./routes/patientRoutes.js";
import { questionnaireRouter } from "./routes/questionnaireRoutes.js";
import { observationRouter } from "./routes/observationRoutes.js";
import { prakritiRouter } from "./routes/prakritiRoutes.js";
import { assessmentRouter } from "./routes/assessmentRoutes.js";
import { reportRouter } from "./routes/reportRoutes.js";
import { doctorRouter } from "./routes/doctorRoutes.js";

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logger for debugging and evaluation audit
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GramIntel AI AyurEssence backend is running",
    status: "healthy",
    service: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: db.isConnected() ? "connected" : "error",
      usersCount: db.getCollection("users").length,
      patientsCount: db.getCollection("patients").length,
      assessmentsCount: db.getCollection("assessments").length,
      questionsCount: db.getCollection("questions").length
    },
    institutions: CONFIG.INSTITUTIONS
  });
});

// API Documentation Directory Endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    title: "AyurEssence API Documentation - HPL 2026 Evaluation 1",
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
          { method: "GET", path: "/api/patients", desc: "List patients with search and filter" },
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
          { method: "GET", path: "/api/questionnaires", desc: "List questionnaires with items, categories, options" },
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
        module: "5. Classical Prakriti Calculation Service",
        routes: [
          { method: "POST", path: "/api/prakriti/calculate", desc: "Callable calculation service (V/P/K %, dominant dosha)" },
          { method: "GET", path: "/api/prakriti/methodology", desc: "Classical Ayurvedic citations (Charaka, Sushruta, Vagbhata)" }
        ]
      },
      {
        module: "6. Assessment & Reports",
        routes: [
          { method: "POST", path: "/api/assessments", desc: "Submit assessment session (Patient, Student, Doctor)" },
          { method: "GET", path: "/api/assessments/:id", desc: "Get raw assessment record" },
          { method: "GET", path: "/api/assessments/my", desc: "Get all assessments of current user" },
          { method: "PUT", path: "/api/assessments/:id", desc: "Update assessment (cannot modify if finalized)" },
          { method: "PUT", path: "/api/assessments/:id/finalize", desc: "Approve/finalize assessment (Doctor only)" },
          { method: "GET", path: "/api/reports/:assessmentId", desc: "Fetch structured constitutional report" },
          { method: "GET", path: "/api/assessments/:id/report?level=doctor|patient", desc: "Generate dual-level report" }
        ]
      },
      {
        module: "7. Doctor Workflow",
        routes: [
          { method: "GET", path: "/api/doctor/assessments", desc: "Doctor list of all assessments for review" },
          { method: "GET", path: "/api/doctor/assessments/:id", desc: "Doctor review specific assessment" },
          { method: "POST", path: "/api/doctor/assessments/:id/finalize", desc: "Doctor finalize assessment (SUBMITTED -> FINALIZED)" }
        ]
      }
    ]
  });
});

// Mount Routes
app.use("/api/auth", authRouter);
app.use("/api/patients", patientRouter);
app.use("/api/questionnaires", questionnaireRouter);
app.use("/api/observations", observationRouter);
app.use("/api/nlp", observationRouter);
app.use("/api/prakriti", prakritiRouter);
app.use("/api/assessments", assessmentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/doctor", doctorRouter);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found. Check /api/docs for available routes.`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
});

// Start Server if invoked directly
const isRunningTests = process.env.NODE_ENV === "test" || process.argv[1]?.includes("test");
if (!isRunningTests) {
  app.listen(CONFIG.PORT, () => {
    console.log(`🌿 AyurEssence Backend running on http://localhost:${CONFIG.PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${CONFIG.PORT}/api/docs`);
    console.log(`🩺 Health check at http://localhost:${CONFIG.PORT}/api/health`);
  });
}


export default app;
