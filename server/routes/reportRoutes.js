import express from "express";
import { db } from "../data/database.js";

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
 * GET /api/reports/:assessmentId
 * Fetch structured report for assessment
 */
reportRouter.get("/:assessmentId", (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
        error: "Assessment not found."
      });
    }

    const patient = db.findById("patients", assessment.patientId);
    const user = assessment.userId ? db.findById("users", assessment.userId) : null;

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

    const report = {
      assessmentId: assessment.id,
      assessmentDate: assessment.date || assessment.createdAt?.slice(0, 10),
      status: assessment.status || "SUBMITTED",
      user: {
        id: user?.id || patient?.id || assessment.userId || assessment.patientId,
        name: user?.name || patient?.name || "Patient",
        email: user?.email || patient?.email || ""
      },
      prakriti,
      scores: assessment.scores,
      interpretation,
      basicInterpretation: interpretation,
      ethicalDisclaimer:
        "This report evaluates constitutional Prakriti for wellness guidance. It does not diagnose diseases or prescribe medicines."
    };

    return res.json({
      success: true,
      report,
      data: report
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});
