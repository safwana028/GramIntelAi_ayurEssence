import express from "express";
import { db, recordAuditLog } from "../data/database.js";
import { authenticateToken, requireRole, forbidPatient } from "../middleware/auth.js";
import { calculatePrakritiScore } from "../services/prakritiService.js";
import { extractDoshaSignalsFromText } from "../services/nlpService.js";
import { calculateAdaptiveQuestionState, getAdaptiveDoshaState } from "../services/adaptiveDoshaService.js";

export const assessmentRouter = express.Router();

/**
 * Helper: Validate answers against questionnaire
 */
function validateAnswers(answers, questions, requireAll = false) {
  if (!answers || typeof answers !== "object") {
    return { valid: false, message: "Answers object is required." };
  }

  const answeredKeys = Object.keys(answers).filter((k) => Boolean(answers[k]));
  if (requireAll && answeredKeys.length < 24) {
    const missing = questions
      .filter((q) => !answers[q.id])
      .map((q) => q.id);
    return {
      valid: false,
      message: `Incomplete assessment. Mandatory 24 questions required for finalization (answered: ${answeredKeys.length}/24).`,
      missingQuestions: missing
    };
  }

  return { valid: true, answeredCount: answeredKeys.length };
}

/**
 * POST /api/assessments
 * Create a new assessment session
 * Accessible to Doctor & Student. Patients are strictly forbidden from assessment-taking.
 */
assessmentRouter.post("/", authenticateToken, forbidPatient, (req, res) => {
  try {
    const {
      patientId,
      userId,
      questionnaireId,
      season,
      answers,
      observations,
      questionNotes,
      patientMessage,
      status
    } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers object is required.",
        error: "Answers object is required.",
        errorCode: "VALIDATION_ERROR",
        requestId: req.id
      });
    }

    const effectiveUserId = userId || req.user.id;
    const effectivePatientId = patientId || effectiveUserId;

    let patient = db.findById("patients", effectivePatientId);
    if (!patient) {
      const byEmail = db.query("patients", (p) => p.email?.toLowerCase() === req.user.email?.toLowerCase());
      if (byEmail.length > 0) {
        patient = byEmail[0];
      } else {
        patient = {
          id: effectivePatientId,
          name: req.user.name,
          email: req.user.email,
          registeredDate: new Date().toISOString().slice(0, 10),
          linkedAssessments: []
        };
        db.insert("patients", patient);
      }
    }

    // Extract NLP signals from clinical notes if present
    let nlpSignals = [];
    if (observations?.freeText) {
      nlpSignals = extractDoshaSignalsFromText(observations.freeText);
    }

    const allQuestions = db.getCollection("questions");
    const scores = calculatePrakritiScore(answers, allQuestions, nlpSignals, true);

    const isDoctor = req.user.role === "doctor";
    const requestedStatus = status ? status.toUpperCase() : null;

    // Student can only create DRAFT or SUBMITTED. Doctor can create DRAFT, SUBMITTED or FINALIZED.
    let initialStatus = requestedStatus || (isDoctor ? "FINALIZED" : "SUBMITTED");
    if (!isDoctor && initialStatus === "FINALIZED") {
      initialStatus = "SUBMITTED";
    }

    const newAssessment = {
      id: `ASM-${Date.now().toString().slice(-6)}`,
      userId: effectiveUserId,
      patientId: patient.id,
      patientEmail: patient.email || req.user.email,
      questionnaireId: questionnaireId || "sdm-udupi-standard-24",
      date: new Date().toISOString().slice(0, 10),
      season: season || "Sharad (Autumn)",
      conductedBy: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      status: initialStatus,
      supervisorApproved: initialStatus === "FINALIZED",
      supervisorNotes: isDoctor
        ? "Verified and finalized by senior Vaidya."
        : "Assessment submitted for evaluation and supervising Vaidya review.",
      scores,
      prakritiResult: scores,
      prakriti: {
        vata: scores.vata,
        pitta: scores.pitta,
        kapha: scores.kapha,
        dominant: scores.dominant || scores.dominantPrakriti
      },
      observations: {
        freeText: observations?.freeText || "",
        ashtavidha: observations?.ashtavidha || {},
        nlpSignals
      },
      questionNotes: questionNotes || {},
      patientMessage: patientMessage || "",
      answers,
      reportDelivered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert("assessments", newAssessment);

    // Link assessment to patient
    const linked = patient.linkedAssessments || [];
    db.updateById("patients", patient.id, {
      baselinePrakriti: scores.dominantPrakriti,
      linkedAssessments: [...linked, newAssessment.id]
    });

    // Record audit event
    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: initialStatus === "FINALIZED" ? "ASSESSMENT_FINALIZED" : "ASSESSMENT_CREATED",
      assessmentId: newAssessment.id,
      requestId: req.id,
      metadata: { status: initialStatus, dominantPrakriti: scores.dominantPrakriti }
    });

    return res.status(201).json({
      success: true,
      message:
        initialStatus === "FINALIZED"
          ? "Assessment finalized and saved."
          : "Assessment submitted successfully.",
      assessment: newAssessment,
      data: newAssessment
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * GET /api/assessments
 * List assessments with pagination and filtering
 */
assessmentRouter.get("/", authenticateToken, forbidPatient, (req, res) => {
  try {
    const { page = 1, limit = 20, status, patientId } = req.query;

    const filterFn = (a) => {
      if (status && a.status?.toUpperCase() !== status.toUpperCase()) return false;
      if (patientId && a.patientId !== patientId) return false;
      // If student, can only view own or assigned assessments
      if (req.user.role === "student" && a.conductedBy?.id !== req.user.id) {
        return false;
      }
      return true;
    };

    const paginated = db.paginate("assessments", { page, limit, filterFn });

    return res.json({
      success: true,
      count: paginated.data.length,
      ...paginated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * GET /api/assessments/my
 * Retrieve all assessments belonging to current logged-in user with pagination
 */
assessmentRouter.get("/my", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email?.toLowerCase();
    const { page = 1, limit = 50 } = req.query;

    const filterFn = (a) => {
      const conductedById = a.conductedBy?.id;
      const patientId = a.patientId;
      const aUserId = a.userId;
      return (
        conductedById === userId ||
        patientId === userId ||
        aUserId === userId ||
        a.patientEmail?.toLowerCase() === userEmail
      );
    };

    const paginated = db.paginate("assessments", { page, limit, filterFn });

    return res.json({
      success: true,
      count: paginated.data.length,
      data: paginated.data,
      assessments: paginated.data,
      pagination: paginated.pagination
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * GET /api/assessments/:id
 * Retrieve raw assessment record
 */
assessmentRouter.get("/:id", authenticateToken, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    const patient = db.findById("patients", assessment.patientId);

    // Role check: Patient can only view their own assessment if delivered
    if (req.user.role === "patient") {
      const isOwner = patient?.email?.toLowerCase() === req.user.email?.toLowerCase() || assessment.userId === req.user.id;
      if (!isOwner || !assessment.reportDelivered) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this assessment.",
          error: "Access denied to this assessment.",
          errorCode: "FORBIDDEN",
          requestId: req.id
        });
      }
    }

    const enriched = {
      ...assessment,
      patientName: patient?.name,
      patientAge: patient?.age,
      patientGender: patient?.gender
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
 * PUT /api/assessments/:id
 * Update assessment; strictly enforces immutability for FINALIZED assessments.
 */
assessmentRouter.put("/:id", authenticateToken, forbidPatient, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    // IMMUTABILITY CHECK: Once FINALIZED, no user (neither student nor doctor) can modify it!
    if (assessment.status?.toUpperCase() === "FINALIZED") {
      recordAuditLog({
        actorId: req.user.id,
        actorRole: req.user.role,
        action: "UNAUTHORIZED_MODIFICATION_ATTEMPTED",
        assessmentId: assessment.id,
        requestId: req.id,
        metadata: { reason: "Assessment is immutable once finalized" }
      });

      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified.",
        error: "Finalized assessment cannot be modified.",
        errorCode: "ASSESSMENT_FINALIZED",
        requestId: req.id
      });
    }

    // Student can only edit own assessment
    if (req.user.role === "student" && assessment.conductedBy?.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Students may only edit their own assessments.",
        error: "Students may only edit their own assessments.",
        errorCode: "FORBIDDEN",
        requestId: req.id
      });
    }

    const { answers, observations, questionNotes, patientMessage, season, status } = req.body;
    const updates = { ...req.body };

    // If answers or observations changed, recalculate Prakriti
    const newAnswers = answers || assessment.answers;
    const newObs = observations || assessment.observations;
    let nlpSignals = newObs?.nlpSignals || [];
    if (newObs?.freeText && (!newObs.nlpSignals || newObs.nlpSignals.length === 0)) {
      nlpSignals = extractDoshaSignalsFromText(newObs.freeText);
      newObs.nlpSignals = nlpSignals;
    }

    const allQuestions = db.getCollection("questions");
    const newScores = calculatePrakritiScore(newAnswers, allQuestions, nlpSignals, true);

    updates.scores = newScores;
    updates.prakritiResult = newScores;
    updates.prakriti = {
      vata: newScores.vata,
      pitta: newScores.pitta,
      kapha: newScores.kapha,
      dominant: newScores.dominant || newScores.dominantPrakriti
    };

    if (questionNotes) {
      updates.questionNotes = { ...(assessment.questionNotes || {}), ...questionNotes };
    }
    if (patientMessage !== undefined) {
      updates.patientMessage = patientMessage;
    }

    // Protect finalization from non-doctors
    if (status && status.toUpperCase() === "FINALIZED" && req.user.role !== "doctor") {
      delete updates.status;
    }

    const updated = db.updateById("assessments", req.params.id, updates);

    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "ASSESSMENT_UPDATED",
      assessmentId: assessment.id,
      requestId: req.id,
      metadata: { fields: Object.keys(updates) }
    });

    return res.json({
      success: true,
      message: "Assessment updated successfully.",
      data: updated,
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * PUT /api/assessments/:id/question-notes/:questionId
 * Save per-question observation note
 */
assessmentRouter.put("/:id/question-notes/:questionId", authenticateToken, forbidPatient, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    if (assessment.status?.toUpperCase() === "FINALIZED") {
      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified.",
        errorCode: "ASSESSMENT_FINALIZED",
        requestId: req.id
      });
    }

    const { note } = req.body;
    const qNotes = assessment.questionNotes || {};
    qNotes[req.params.questionId] = String(note || "").trim();

    const updated = db.updateById("assessments", req.params.id, { questionNotes: qNotes });

    return res.json({
      success: true,
      message: "Question note saved.",
      questionNotes: updated.questionNotes
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});

/**
 * POST /api/assessments/:id/patient-message
 * Save patient-facing explanation/message
 */
assessmentRouter.post("/:id/patient-message", authenticateToken, forbidPatient, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    if (assessment.status?.toUpperCase() === "FINALIZED") {
      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified.",
        errorCode: "ASSESSMENT_FINALIZED",
        requestId: req.id
      });
    }

    const { message } = req.body;
    const updated = db.updateById("assessments", req.params.id, {
      patientMessage: String(message || "").trim()
    });

    return res.json({
      success: true,
      message: "Patient-facing message saved.",
      patientMessage: updated.patientMessage
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});

/**
 * POST /api/assessments/:id/submit
 * Submit a draft assessment for supervisor review
 */
assessmentRouter.post("/:id/submit", authenticateToken, forbidPatient, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    if (assessment.status?.toUpperCase() === "FINALIZED") {
      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified.",
        errorCode: "ASSESSMENT_FINALIZED",
        requestId: req.id
      });
    }

    const updated = db.updateById("assessments", req.params.id, {
      status: "SUBMITTED",
      submittedAt: new Date().toISOString()
    });

    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "ASSESSMENT_SUBMITTED",
      assessmentId: assessment.id,
      requestId: req.id
    });

    return res.json({
      success: true,
      message: "Assessment submitted for Doctor review.",
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});

/**
 * GET /api/assessments/:id/adaptive
 * Compute provisional adaptive dosha state around configured threshold (e.g. 80%)
 */
assessmentRouter.get("/:id/adaptive", authenticateToken, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }

    const allQuestions = db.getCollection("questions");
    const adaptiveState = calculateAdaptiveQuestionState(
      assessment.answers,
      allQuestions,
      assessment.observations?.nlpSignals || []
    );

    return res.json({
      success: true,
      assessmentId: assessment.id,
      ...adaptiveState
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});

/**
 * PUT /api/assessments/:id/finalize
 * Atomic assessment finalization (Doctor only). Guarantees immutability and concurrency protection.
 */
assessmentRouter.put("/:id/finalize", authenticateToken, requireRole("doctor"), async (req, res) => {
  try {
    const result = await db.atomicFinalize(req.params.id, async (assessment) => {
      const { supervisorNotes, notes, patientMessage } = req.body;
      const allQuestions = db.getCollection("questions");

      // Validate required questions
      const validation = validateAnswers(assessment.answers, allQuestions, true);
      if (!validation.valid) {
        const err = new Error(validation.message);
        err.statusCode = 400;
        throw err;
      }

      // Authoritative final recalculation
      const finalScores = calculatePrakritiScore(
        assessment.answers,
        allQuestions,
        assessment.observations?.nlpSignals || [],
        true
      );

      return db.updateById("assessments", req.params.id, {
        status: "FINALIZED",
        supervisorApproved: true,
        supervisorNotes: notes || supervisorNotes || `Verified and approved by Dr. ${req.user.name}, BAMS.`,
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
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
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
      data: result.assessment,
      assessment: result.assessment
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message, error: err.message, requestId: req.id });
  }
});

/**
 * POST /api/assessments/:id/transcription
 * Modular backend transcription integration: inserts transcribed text into selected destination
 */
assessmentRouter.post("/:id/transcription", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", errorCode: "NOT_FOUND", requestId: req.id });
    }
    if (assessment.status?.toUpperCase() === "FINALIZED") {
      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified.",
        errorCode: "ASSESSMENT_FINALIZED",
        requestId: req.id
      });
    }

    const { transcript, destination = "clinicalObservation", questionId } = req.body;
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({
        success: false,
        message: "Transcript text is required.",
        errorCode: "VALIDATION_ERROR",
        requestId: req.id
      });
    }

    const updates = {};
    if (destination === "clinicalObservation") {
      const existing = assessment.observations?.freeText || "";
      const newFreeText = existing ? `${existing} ${transcript.trim()}` : transcript.trim();
      const nlpSignals = extractDoshaSignalsFromText(newFreeText);
      updates.observations = {
        ...(assessment.observations || {}),
        freeText: newFreeText,
        nlpSignals
      };
    } else if (destination === "questionNote" && questionId) {
      const qNotes = { ...(assessment.questionNotes || {}) };
      const existing = qNotes[questionId] || "";
      qNotes[questionId] = existing ? `${existing} ${transcript.trim()}` : transcript.trim();
      updates.questionNotes = qNotes;
    } else if (destination === "patientMessage") {
      const existing = assessment.patientMessage || "";
      updates.patientMessage = existing ? `${existing} ${transcript.trim()}` : transcript.trim();
    } else if (destination === "doctorNote") {
      const existing = assessment.supervisorNotes || "";
      updates.supervisorNotes = existing ? `${existing} ${transcript.trim()}` : transcript.trim();
    }

    const updated = db.updateById("assessments", req.params.id, updates);

    recordAuditLog({
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "VOICE_TRANSCRIPTION_INSERTED",
      assessmentId: assessment.id,
      requestId: req.id,
      metadata: { destination, questionId, length: transcript.length }
    });

    return res.json({
      success: true,
      message: `Transcription inserted into ${destination}.`,
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, requestId: req.id });
  }
});

/**
 * GET /api/assessments/:id/report
 * Dual-level report: doctor dossier vs patient summary
 */
assessmentRouter.get("/:id/report", authenticateToken, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: "Assessment not found.", requestId: req.id });
    }

    const patient = db.findById("patients", assessment.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Associated patient record not found.", requestId: req.id });
    }

    // Role check: Patient can only view delivered report
    if (req.user.role === "patient") {
      const isOwner = patient.email?.toLowerCase() === req.user.email?.toLowerCase() || assessment.userId === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ success: false, error: "Access denied to this report.", errorCode: "FORBIDDEN", requestId: req.id });
      }
      if (assessment.status?.toUpperCase() !== "FINALIZED" || !assessment.reportDelivered) {
        return res.status(403).json({
          success: false,
          error: "Your assessment report is currently under clinical review and has not yet been delivered by your doctor.",
          errorCode: "REPORT_NOT_DELIVERED",
          requestId: req.id
        });
      }
    }

    let level = (req.query.level || "doctor").toLowerCase();
    if (req.user.role === "patient") {
      level = "patient";
    }

    // 1. PATIENT SIMPLIFIED SUMMARY REPORT (Internal notes strictly redacted)
    if (level === "patient") {
      const dominant = assessment.scores?.dominantPrakriti || "Vata-Pitta";
      let summaryText = `You are naturally a ${dominant} constitution type.`;
      let lifestyleTips = [];

      if (dominant.toLowerCase().includes("vata")) {
        lifestyleTips.push("Keep regular meal and sleep routines to ground your agile energy.");
        lifestyleTips.push("Favor warm, freshly cooked foods with healthy fats (ghee, sesame oil).");
        lifestyleTips.push("Daily gentle warm oil massage (Abhyanga) helps protect against dryness.");
      }
      if (dominant.toLowerCase().includes("pitta")) {
        lifestyleTips.push("Stay cool and well-hydrated; avoid excessive midday sun.");
        lifestyleTips.push("Favor naturally sweet, bitter, and cooling foods (cucumber, coconut water, fennel).");
        lifestyleTips.push("Avoid skipping meals or prolonged fasting.");
      }
      if (dominant.toLowerCase().includes("kapha")) {
        lifestyleTips.push("Wake up early before sunrise and engage in brisk daily morning walks.");
        lifestyleTips.push("Favor warm, light, freshly spiced foods (ginger, black pepper, turmeric).");
        lifestyleTips.push("Avoid cold dairy and heavy sweets.");
      }

      return res.json({
        success: true,
        reportType: "patient_simplified_summary",
        patient: {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          city: patient.city
        },
        assessmentDate: assessment.date,
        constitutionalSummary: {
          headline: `Your Body Constitution: ${dominant}`,
          plainLanguageExplanation: summaryText,
          proportions: {
            vata: `${assessment.scores?.vata}%`,
            pitta: `${assessment.scores?.pitta}%`,
            kapha: `${assessment.scores?.kapha}%`
          },
          dailyWellnessTips: lifestyleTips,
          doctorMessage: assessment.patientMessage || "Maintain consistent daily routines aligned with your Prakriti."
        },
        ethicalDisclaimer: "This summary describes your natural body-constitution (Prakriti) for lifestyle and wellness. It does NOT diagnose diseases or prescribe medications. Consult an Ayurvedic doctor for medical concerns."
      });
    }

    // 2. DOCTOR / ACADEMIC FULL CLINICAL DOSSIER
    return res.json({
      success: true,
      reportType: "doctor_clinical_dossier",
      institutionalHeader: {
        sponsor: "SDM College of Ayurveda & Hospital, Udupi",
        department: "Department of Kriya Sharira & Roga Nidana",
        protocol: "Deha Prakriti Pariksha Protocol v2.4"
      },
      patientDemographics: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        city: patient.city,
        occupation: patient.occupation,
        dietType: patient.dietType,
        primaryComplaint: patient.primaryComplaint
      },
      assessmentContext: {
        assessmentId: assessment.id,
        date: assessment.date,
        season: assessment.season,
        status: assessment.status,
        conductedBy: assessment.conductedBy,
        supervisorApproved: assessment.supervisorApproved,
        supervisorNotes: assessment.supervisorNotes,
        finalizedBy: assessment.finalizedBy,
        reportDelivered: assessment.reportDelivered || false
      },
      answers: assessment.answers,
      questionNotes: assessment.questionNotes || {},
      patientMessage: assessment.patientMessage || "",
      prakritiBreakdown: {
        dominantPrakriti: assessment.scores?.dominantPrakriti,
        constitutionType: assessment.scores?.constitutionType,
        classicalTerm: assessment.scores?.classicalTerm,
        percentages: {
          vata: assessment.scores?.vata,
          pitta: assessment.scores?.pitta,
          kapha: assessment.scores?.kapha
        },
        rawPoints: assessment.scores?.points || {
          vata: Math.round((assessment.scores?.vata || 50) * 0.3),
          pitta: Math.round((assessment.scores?.pitta || 30) * 0.3),
          kapha: Math.round((assessment.scores?.kapha || 20) * 0.3)
        },
        subScoresByDimension: assessment.scores?.subScores,
        rationale: assessment.scores?.rationale
      },
      practitionerObservations: {
        freeText: assessment.observations?.freeText,
        ashtavidhaPariksha: assessment.observations?.ashtavidha,
        nlpExtractedSignals: assessment.observations?.nlpSignals
      },
      classicalMethodologyReferences: assessment.scores?.methodologyReferences || [
        "Charaka Samhita Vimanasthana 8:95-100",
        "Sushruta Samhita Sharirasthana 4:62-76",
        "Ashtanga Hridaya Sharirasthana 3:83-104"
      ],
      regulatoryNotice: "Constitutional assessment platform for clinical and educational guidance. Explicitly non-diagnostic and non-prescriptive."
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, requestId: req.id });
  }
});
