import express from "express";
import { db } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { calculatePrakritiScore } from "../services/prakritiService.js";
import { extractDoshaSignalsFromText } from "../services/nlpService.js";

export const assessmentRouter = express.Router();

/**
 * POST /api/assessments
 * Create a new assessment session
 * Accessible to Doctor, Student, and Patient
 */
assessmentRouter.post("/", authenticateToken, requireRole(["doctor", "student", "patient"]), (req, res) => {
  try {
    const { patientId, userId, questionnaireId, season, answers, observations, status } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers object is required.",
        error: "Answers object is required."
      });
    }

    const effectiveUserId = userId || req.user.id;
    const effectivePatientId = patientId || effectiveUserId;

    let patient = db.findById("patients", effectivePatientId);
    if (!patient) {
      // Find by email or create a basic patient record for this user
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

    // Extract NLP signals from free text if provided
    let nlpSignals = [];
    if (observations?.freeText) {
      nlpSignals = extractDoshaSignalsFromText(observations.freeText);
    }

    // Calculate Prakriti score
    const allQuestions = db.getCollection("questions");
    const scores = calculatePrakritiScore(answers, allQuestions, nlpSignals, true);

    const isDoctor = req.user.role?.toLowerCase() === "doctor";
    const initialStatus = status
      ? status.toUpperCase()
      : isDoctor
      ? "FINALIZED"
      : "SUBMITTED";

    const newAssessment = {
      id: `ASM-${Date.now().toString().slice(-6)}`,
      userId: effectiveUserId,
      patientId: patient.id,
      patientEmail: req.user.email,
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
      answers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert("assessments", newAssessment);

    // Update patient's baseline and linked assessments
    const linked = patient.linkedAssessments || [];
    db.updateById("patients", patient.id, {
      baselinePrakriti: scores.dominantPrakriti,
      linkedAssessments: [...linked, newAssessment.id]
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
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * GET /api/assessments/my
 * Retrieve all assessments belonging to current logged-in user
 */
assessmentRouter.get("/my", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email?.toLowerCase();
    const assessments = db.query("assessments", (a) => {
      const conductedById = a.conductedBy?.id;
      const patientId = a.patientId;
      const aUserId = a.userId;
      return (
        conductedById === userId ||
        patientId === userId ||
        aUserId === userId ||
        a.patientEmail?.toLowerCase() === userEmail
      );
    });

    return res.json({
      success: true,
      count: assessments.length,
      data: assessments,
      assessments
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
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
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found." });
    }

    const patient = db.findById("patients", assessment.patientId);

    // Role check: Patient can only view their own assessment
    if (
      req.user.role?.toLowerCase() === "patient" &&
      patient?.email?.toLowerCase() !== req.user.email.toLowerCase() &&
      assessment.userId !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: "Access denied to this assessment.", error: "Access denied to this assessment." });
    }

    return res.json({
      success: true,
      data: {
        ...assessment,
        patientName: patient?.name,
        patientAge: patient?.age,
        patientGender: patient?.gender
      },
      assessment: {
        ...assessment,
        patientName: patient?.name,
        patientAge: patient?.age,
        patientGender: patient?.gender
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * PUT /api/assessments/:id
 * Update assessment; protects finalized assessments from normal user modification
 */
assessmentRouter.put("/:id", authenticateToken, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found." });
    }

    const isDoctor = req.user.role?.toLowerCase() === "doctor";
    if (assessment.status?.toUpperCase() === "FINALIZED" && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: "Finalized assessment cannot be modified by normal user.",
        error: "Finalized assessment cannot be modified by normal user."
      });
    }

    const updated = db.updateById("assessments", req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: "Assessment updated successfully.",
      data: updated,
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * PUT /api/assessments/:id/finalize
 * RBAC: Only a doctor can edit or finalize a report; student cannot finalize
 */
assessmentRouter.put("/:id/finalize", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found.", error: "Assessment not found." });
    }

    const { supervisorNotes } = req.body;

    const updated = db.updateById("assessments", req.params.id, {
      status: "FINALIZED",
      supervisorApproved: true,
      supervisorNotes: supervisorNotes || `Verified and approved by ${req.user.name}, BAMS.`,
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
      data: updated,
      assessment: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});


/**
 * GET /api/assessments/:id/report
 * Generate structured report with separate detail levels:
 * - ?level=doctor (default): Full clinical dossier with demographics, context, raw points, Ashtavidha, citations
 * - ?level=patient: Simplified summary ("You are mostly Vata type"), non-clinical wording, Dinacharya tips
 */
assessmentRouter.get("/:id/report", authenticateToken, (req, res) => {
  try {
    const assessment = db.findById("assessments", req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: "Assessment not found." });
    }

    const patient = db.findById("patients", assessment.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Associated patient record not found." });
    }

    // Role check: Patient can only view their own report
    if (req.user.role === "patient" && patient.email?.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, error: "Access denied to this report." });
    }

    // Determine detail level
    // If user is a patient, always enforce 'patient' level for privacy and ethical simplicity
    let level = (req.query.level || "doctor").toLowerCase();
    if (req.user.role === "patient") {
      level = "patient";
    }

    // 1. PATIENT SIMPLIFIED SUMMARY REPORT
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
          dailyWellnessTips: lifestyleTips
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
        supervisorNotes: assessment.supervisorNotes
      },
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
    return res.status(500).json({ success: false, error: err.message });
  }
});
