import express from "express";
import { db } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

export const doctorRouter = express.Router();

// Require Doctor role for all routes in this router
doctorRouter.use(authenticateToken, requireRole("doctor"));

/**
 * GET /api/doctor/assessments
 * List all assessments with patient details for doctor review
 */
doctorRouter.get("/assessments", (req, res) => {
  try {
    const assessments = db.getCollection("assessments");
    const patients = db.getCollection("patients");

    const enriched = assessments.map((asm) => {
      const patient = patients.find((p) => p.id === asm.patientId);
      return {
        ...asm,
        patientName: patient?.name || asm.patientName || "Patient",
        patientAge: patient?.age,
        patientGender: patient?.gender
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      data: enriched,
      assessments: enriched
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * GET /api/doctor/assessments/:id
 * Retrieve specific assessment details for doctor review
 */
doctorRouter.get("/assessments/:id", (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        error: "Assessment not found."
      });
    }

    const patient = db.findById("patients", assessment.patientId);

    return res.json({
      success: true,
      data: {
        ...assessment,
        patientName: patient?.name,
        patientAge: patient?.age,
        patientGender: patient?.gender,
        patient
      },
      assessment: {
        ...assessment,
        patientName: patient?.name,
        patientAge: patient?.age,
        patientGender: patient?.gender,
        patient
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * POST /api/doctor/assessments/:id/finalize
 * Finalize assessment: transitions status SUBMITTED -> FINALIZED
 */
doctorRouter.post("/assessments/:id/finalize", (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        error: "Assessment not found."
      });
    }

    const { notes, supervisorNotes } = req.body;

    const updated = db.updateById("assessments", req.params.id, {
      status: "FINALIZED",
      supervisorApproved: true,
      supervisorNotes:
        notes || supervisorNotes || `Verified and approved by Dr. ${req.user.name}, BAMS.`,
      finalizedBy: {
        id: req.user.id,
        name: req.user.name,
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: "Assessment approved and finalized by Supervising Doctor.",
      assessment: updated,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});
