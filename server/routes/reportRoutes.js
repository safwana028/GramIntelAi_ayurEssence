import express from "express";
import { db } from "../data/database.js";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

export const reportRouter = express.Router();

function buildInterpretation(scores) {
  const dominant = scores?.dominant || scores?.dominantPrakriti || "Balanced";
  const v = scores?.vata || 0;
  const p = scores?.pitta || 0;
  const k = scores?.kapha || 0;

  let basic = `Your constitution shows predominant ${dominant} doshic influence (Vata: ${v}%, Pitta: ${p}%, Kapha: ${k}%).`;
  if (dominant.toLowerCase().includes("vata")) {
    basic += " Vata types benefit from grounding routines, warming foods, adequate rest, and hydration.";
  } else if (dominant.toLowerCase().includes("pitta")) {
    basic += " Pitta types benefit from cooling lifestyle habits, emotional moderation, and avoiding excessive spices.";
  } else if (dominant.toLowerCase().includes("kapha")) {
    basic += " Kapha types benefit from active exercise, stimulating spices, and maintaining regular physical movement.";
  } else {
    basic += " Balanced constitution represents harmonious equilibrium among all three doshas.";
  }
  return basic;
}

/**
 * Optional token extractor so GET /api/reports/:id can inspect role if token provided
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
      const user = db.findById("users", decoded.id);
      if (user) {
        if (String(user.role).toLowerCase() === "patient") {
          return res.status(403).json({
            success: false,
            message: "Patient accounts cannot log in to the clinical assessment application. Patients exist only as clinical records. Only Doctors and Students may access this system.",
            errorCode: "PATIENT_ACCESS_DISABLED",
            requestId: req.id
          });
        }
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: String(user.role).toLowerCase()
        };
      }
    } catch {
      // Ignore token decode error in optional auth
    }
  }
  next();
}

/**
 * GET /api/reports/:assessmentId
 * Fetch structured report for assessment (Doctor clinical dossier vs Patient simplified Swastha report)
 */
reportRouter.get("/:assessmentId", optionalAuth, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        error: "Assessment not found.",
        errorCode: "NOT_FOUND",
        requestId: req.id
      });
    }

    const patient = db.findById("patients", assessment.patientId);
    const user = assessment.userId ? db.findById("users", assessment.userId) : null;

    // Patient-facing report delivery check: must be finalized and delivered by clinician
    if (req.query.level === "patient" && (assessment.status?.toUpperCase() !== "FINALIZED" || !assessment.reportDelivered)) {
      return res.status(403).json({
        success: false,
        message: "Your assessment is currently under clinical review. The patient report will be available once finalized and delivered by your doctor.",
        error: "Report not yet delivered by doctor.",
        errorCode: "REPORT_NOT_DELIVERED",
        requestId: req.id
      });
    }

    const prakriti = {
      vata: assessment.scores?.vata ?? assessment.prakriti?.vata ?? 34,
      pitta: assessment.scores?.pitta ?? assessment.prakriti?.pitta ?? 33,
      kapha: assessment.scores?.kapha ?? assessment.prakriti?.kapha ?? 33,
      dominant:
        assessment.scores?.dominant ||
        assessment.scores?.dominantPrakriti ||
        assessment.prakriti?.dominant ||
        "Balanced"
    };

    const interpretation = buildInterpretation(prakriti);
    const isPatientView = req.user?.role === "patient" || req.query.level === "patient";

    let report;

    if (isPatientView) {
      // PATIENT REPORT: Strictly NO internal clinical notes or Ashtavidha
      report = {
        assessmentId: assessment.id,
        assessmentDate: assessment.date || assessment.createdAt?.slice(0, 10),
        status: assessment.status || "SUBMITTED",
        reportType: "patient_wellness_report",
        patient: {
          name: patient?.name || user?.name || "Patient",
          age: patient?.age,
          gender: patient?.gender,
          city: patient?.city
        },
        prakriti,
        scores: {
          vata: prakriti.vata,
          pitta: prakriti.pitta,
          kapha: prakriti.kapha,
          dominantPrakriti: prakriti.dominant
        },
        interpretation,
        basicInterpretation: interpretation,
        patientMessage: assessment.patientMessage || "Follow the constitutional wellness routine recommended by your Vaidya.",
        ethicalDisclaimer:
          "This report evaluates constitutional Prakriti for wellness guidance. It does not diagnose diseases or prescribe medicines."
      };
    } else {
      // DOCTOR / SCHOLAR CLINICAL DOSSIER
      report = {
        assessmentId: assessment.id,
        assessmentDate: assessment.date || assessment.createdAt?.slice(0, 10),
        status: assessment.status || "SUBMITTED",
        reportType: "doctor_clinical_dossier",
        reportDelivered: assessment.reportDelivered || false,
        user: {
          id: user?.id || patient?.id || assessment.userId || assessment.patientId,
          name: user?.name || patient?.name || "Patient",
          email: user?.email || patient?.email || ""
        },
        patient: patient || null,
        prakriti,
        scores: assessment.scores,
        answers: assessment.answers,
        questionNotes: assessment.questionNotes || {},
        patientMessage: assessment.patientMessage || "",
        observations: assessment.observations || {},
        interpretation,
        basicInterpretation: interpretation,
        finalizedBy: assessment.finalizedBy || null,
        ethicalDisclaimer:
          "This report evaluates constitutional Prakriti for wellness guidance. It does not diagnose diseases or prescribe medicines."
      };
    }

    return res.json({
      success: true,
      report,
      data: report
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});
