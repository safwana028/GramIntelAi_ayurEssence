import express from "express";
import { db, recordAuditLog } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { calculatePrakritiScore } from "../services/prakritiService.js";

export const doctorRouter = express.Router();

// Require Doctor role for all routes in this router
doctorRouter.use(authenticateToken, requireRole("doctor"));

/**
 * GET /api/doctor/assessments
 * List all assessments with patient details and pagination for doctor review
 */
doctorRouter.get("/assessments", (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const patients = db.getCollection("patients");

    const filterFn = (asm) => {
      if (status && asm.status?.toUpperCase() !== status.toUpperCase()) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const patient = patients.find((p) => p.id === asm.patientId);
        const matchName = patient?.name?.toLowerCase().includes(q);
        const matchId = asm.id?.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }
      return true;
    };

    const paginated = db.paginate("assessments", { page, limit, filterFn });

    const enriched = paginated.data.map((asm) => {
      const patient = patients.find((p) => p.id === asm.patientId);
      return {
        ...asm,
        patientName: patient?.name || asm.patientName || "Patient",
        patientAge: patient?.age,
        patientGender: patient?.gender,
        patientEmail: patient?.email || asm.patientEmail
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      data: enriched,
      assessments: enriched,
      pagination: paginated.pagination
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
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
        error: "Assessment not found.",
        errorCode: "NOT_FOUND",
        requestId: req.id
      });
    }

    const patient = db.findById("patients", assessment.patientId);

    const enriched = {
      ...assessment,
      patientName: patient?.name,
      patientAge: patient?.age,
      patientGender: patient?.gender,
      patient
    };

    return res.json({
      success: true,
      data: enriched,
      assessment: enriched
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * POST /api/doctor/assessments/:id/finalize
 * Finalize assessment: transitions status SUBMITTED/DRAFT -> FINALIZED
 * Concurrency-safe atomic finalization with conflict detection.
 */
doctorRouter.post("/assessments/:id/finalize", async (req, res) => {
  try {
    const { notes, supervisorNotes, patientMessage } = req.body;

    const result = await db.atomicFinalize(req.params.id, async (assessment) => {
      const allQuestions = db.getCollection("questions");

      // Recalculate authoritative final score
      const finalScores = calculatePrakritiScore(
        assessment.answers,
        allQuestions,
        assessment.observations?.nlpSignals || [],
        true
      );

      return db.updateById("assessments", req.params.id, {
        status: "FINALIZED",
        supervisorApproved: true,
        supervisorNotes:
          notes || supervisorNotes || `Verified and approved by Dr. ${req.user.name}, BAMS.`,
        patientMessage: patientMessage !== undefined ? patientMessage : (assessment.patientMessage || ""),
        scores: finalScores,
        prakritiResult: finalScores,
        prakriti: {
          vata: finalScores.vata,
          pitta: finalScores.pitta,
          kapha: finalScores.kapha,
          dominant: finalScores.dominant || finalScores.dominantPrakriti
        },
        finalizedBy: {
          id: req.user.id,
          name: req.user.name,
          role: req.user.role,
          timestamp: new Date().toISOString()
        },
        finalizedAt: new Date().toISOString()
      });
    });

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        error: "Assessment not found.",
        errorCode: "NOT_FOUND",
        requestId: req.id
      });
    }

    if (result.conflict) {
      return res.status(409).json({
        success: false,
        message: "Assessment has already been finalized.",
        error: "Assessment has already been finalized.",
        errorCode: "ASSESSMENT_ALREADY_FINALIZED",
        assessment: result.assessment,
        requestId: req.id
      });
    }

    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "ASSESSMENT_FINALIZED",
      assessmentId: req.params.id,
      requestId: req.id,
      metadata: { finalizedBy: req.user.name, scores: result.assessment.scores }
    });

    return res.json({
      success: true,
      message: "Assessment approved and finalized by Supervising Doctor.",
      assessment: result.assessment,
      data: result.assessment
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * POST /api/doctor/assessments/:id/deliver-report
 * Doctor action to securely deliver finalized report to the patient
 */
doctorRouter.post("/assessments/:id/deliver-report", (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        errorCode: "NOT_FOUND",
        requestId: req.id
      });
    }

    if (assessment.status?.toUpperCase() !== "FINALIZED") {
      return res.status(400).json({
        success: false,
        message: "Only finalized assessments can be delivered to patients.",
        errorCode: "ASSESSMENT_NOT_FINALIZED",
        requestId: req.id
      });
    }

    const updated = db.updateById("assessments", req.params.id, {
      reportDelivered: true,
      reportDeliveredAt: new Date().toISOString(),
      deliveredBy: {
        id: req.user.id,
        name: req.user.name
      }
    });

    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "REPORT_DELIVERED",
      assessmentId: assessment.id,
      requestId: req.id,
      metadata: { deliveredToPatientId: assessment.patientId }
    });

    return res.json({
      success: true,
      message: "Patient report successfully delivered and published for patient viewing.",
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});
