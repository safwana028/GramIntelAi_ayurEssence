import express from "express";
import { db } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { extractDoshaSignalsFromText } from "../services/nlpService.js";

export const observationRouter = express.Router();

/**
 * Handler for NLP Dosha signal extraction
 */
const handleNlpExtract = (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        error: "Text field is required for NLP extraction."
      });
    }

    const signals = extractDoshaSignalsFromText(text);

    // Group signals by Dosha
    const summary = {
      vata: signals.filter((s) => s.dosha === "vata").length,
      pitta: signals.filter((s) => s.dosha === "pitta").length,
      kapha: signals.filter((s) => s.dosha === "kapha").length,
      totalSignals: signals.length
    };

    let dominantSignal = "Balanced";
    if (summary.vata > summary.pitta && summary.vata > summary.kapha) dominantSignal = "Vata";
    else if (summary.pitta > summary.vata && summary.pitta > summary.kapha) dominantSignal = "Pitta";
    else if (summary.kapha > summary.vata && summary.kapha > summary.pitta) dominantSignal = "Kapha";

    return res.json({
      success: true,
      message: "NLP analysis completed successfully.",
      text,
      dominantSignal,
      summary,
      signals
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
};

// Mount NLP endpoints
observationRouter.post("/nlp/extract", handleNlpExtract);
observationRouter.post("/extract", handleNlpExtract);
observationRouter.post("/nlp/analyze", handleNlpExtract);
observationRouter.post("/analyze", handleNlpExtract);

/**
 * POST /api/observations
 * API/storage for free-form clinical notes tied to a patient's assessment
 * E.g., doctor types "patient reports poor sleep and dry skin" as a note
 */
const handleSaveObservation = (req, res) => {
  try {
    const { assessmentId, patientId, freeText, ashtavidha } = req.body;

    if (!assessmentId || !patientId || !freeText) {
      return res.status(400).json({
        success: false,
        error: "assessmentId, patientId, and freeText are required fields."
      });
    }

    // Run NLP hook to extract signals automatically
    const nlpSignals = extractDoshaSignalsFromText(freeText);

    const observationRecord = {
      id: `OBS-${Date.now().toString().slice(-6)}`,
      assessmentId,
      patientId,
      freeText,
      ashtavidha: ashtavidha || {},
      nlpSignals,
      recordedBy: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      createdAt: new Date().toISOString()
    };

    db.insert("observations", observationRecord);

    // If assessment exists, link or update observations
    const assessment = db.findById("assessments", assessmentId);
    if (assessment) {
      db.updateById("assessments", assessmentId, {
        observations: {
          freeText,
          ashtavidha: ashtavidha || assessment.observations?.ashtavidha || {},
          nlpSignals
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Practitioner observation saved and NLP signals extracted.",
      data: observationRecord
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

observationRouter.post("/", authenticateToken, requireRole(["doctor", "student"]), handleSaveObservation);
observationRouter.post("/observations", authenticateToken, requireRole(["doctor", "student"]), handleSaveObservation);

/**
 * GET /api/observations/:assessmentId
 * Retrieve observations and extracted signals for an assessment
 */
const handleGetObservations = (req, res) => {
  try {
    const records = db.query("observations", (o) => o.assessmentId === req.params.assessmentId);
    if (records.length === 0) {
      // Fallback: check assessment directly
      const asm = db.findById("assessments", req.params.assessmentId);
      if (asm && asm.observations) {
        return res.json({
          success: true,
          data: {
            assessmentId: asm.id,
            patientId: asm.patientId,
            ...asm.observations
          }
        });
      }
      return res.status(404).json({ success: false, error: "No observations found for this assessment." });
    }

    return res.json({
      success: true,
      data: records[records.length - 1]
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

observationRouter.get("/:assessmentId", authenticateToken, handleGetObservations);
observationRouter.get("/observations/:assessmentId", authenticateToken, handleGetObservations);
