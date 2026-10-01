import express from "express";
import { db } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

export const patientRouter = express.Router();

/**
 * GET /api/patients
 * List patients with search and filter
 */
patientRouter.get("/", authenticateToken, (req, res) => {
  try {
    const { search, prakriti, city } = req.query;
    let patients = db.getCollection("patients");

    // If patient role, only return their own profile
    if (req.user.role === "patient") {
      patients = patients.filter((p) => p.email?.toLowerCase() === req.user.email.toLowerCase());
      return res.json({ success: true, count: patients.length, data: patients });
    }

    if (search) {
      const q = search.toLowerCase();
      patients = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.phone && p.phone.includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    if (prakriti && prakriti !== "all") {
      patients = patients.filter((p) =>
        p.baselinePrakriti?.toLowerCase().includes(prakriti.toLowerCase())
      );
    }

    if (city) {
      patients = patients.filter((p) =>
        p.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    return res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/patients/:id
 * Retrieve single patient profile
 */
patientRouter.get("/:id", authenticateToken, (req, res) => {
  try {
    const patient = db.findById("patients", req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    // Role check: patient can only view their own profile
    if (req.user.role === "patient" && patient.email?.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, error: "Access denied to other patient profiles." });
    }

    // Load linked assessments
    const allAssessments = db.getCollection("assessments");
    const linked = allAssessments.filter((a) => a.patientId === patient.id);

    return res.json({
      success: true,
      data: {
        ...patient,
        assessments: linked
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/patients
 * Create a new patient profile (Doctor & Student)
 */
patientRouter.post("/", authenticateToken, requireRole(["doctor", "student"]), (req, res) => {
  try {
    const { name, age, gender, phone, email, city, occupation, dietType, primaryComplaint } = req.body;

    if (!name || !age || !gender) {
      return res.status(400).json({
        success: false,
        error: "Patient name, age, and gender are mandatory fields."
      });
    }

    const normEmail = email ? email.toLowerCase().trim() : "";

    // Check if a patient with this email already exists to prevent duplicate profiles
    if (normEmail) {
      const allPatients = db.getCollection("patients");
      const existing = allPatients.find(
        (p) => p.email && p.email.toLowerCase().trim() === normEmail
      );
      if (existing) {
        const updated = db.updateById("patients", existing.id, {
          name,
          age: Number(age),
          gender,
          phone: phone || existing.phone,
          city: city || existing.city,
          occupation: occupation || existing.occupation,
          dietType: dietType || existing.dietType,
          primaryComplaint: primaryComplaint || existing.primaryComplaint
        });
        return res.status(200).json({
          success: true,
          message: "Existing patient profile updated successfully.",
          data: updated
        });
      }
    }

    const newPatient = {
      id: `PAT-UDU-${Date.now().toString().slice(-6)}`,
      name,
      age: Number(age),
      gender,
      phone: phone || "",
      email: normEmail,
      city: city || "Udupi, Karnataka",
      occupation: occupation || "General",
      dietType: dietType || "Vegetarian",
      primaryComplaint: primaryComplaint || "Constitutional evaluation (Swastha Pariksha)",
      registeredDate: new Date().toISOString().slice(0, 10),
      baselinePrakriti: "Pending Assessment",
      linkedAssessments: [],
      createdBy: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      createdAt: new Date().toISOString()
    };

    db.insert("patients", newPatient);

    return res.status(201).json({
      success: true,
      message: "Patient profile created successfully.",
      data: newPatient
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/patients/:id
 * Update patient profile (Doctor only)
 */
patientRouter.put("/:id", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const existing = db.findById("patients", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    const updated = db.updateById("patients", req.params.id, req.body);
    return res.json({
      success: true,
      message: "Patient profile updated successfully.",
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/patients/:id
 * Delete patient profile (Doctor only)
 */
patientRouter.delete("/:id", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const existing = db.findById("patients", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    db.deleteById("patients", req.params.id);
    return res.json({
      success: true,
      message: `Patient record ${req.params.id} deleted.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/patients/:id/history
 * Patient history endpoint — past assessments, timestamps, and constitutional trend data
 * Example: Mr. Kamath's changes across visits
 */
patientRouter.get("/:id/history", authenticateToken, (req, res) => {
  try {
    const patient = db.findById("patients", req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found." });
    }

    // Role check
    if (req.user.role === "patient" && patient.email?.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, error: "Access denied to other patient history." });
    }

    const allAssessments = db.getCollection("assessments");
    const history = allAssessments
      .filter((a) => a.patientId === patient.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate longitudinal trend data
    const trendData = history.map((item, index) => ({
      visitIndex: index + 1,
      assessmentId: item.id,
      date: item.date,
      season: item.season || "Unspecified",
      status: item.status,
      supervisorApproved: item.supervisorApproved,
      conductedBy: item.conductedBy?.name,
      dominantPrakriti: item.scores?.dominantPrakriti,
      vata: item.scores?.vata,
      pitta: item.scores?.pitta,
      kapha: item.scores?.kapha,
      subScores: item.scores?.subScores
    }));

    // Calculate stability index
    let constitutionalStability = "Insufficient data (needs >= 2 visits)";
    if (history.length >= 2) {
      const vataDeltas = history.map((h) => h.scores?.vata || 0);
      const vataVariance = Math.max(...vataDeltas) - Math.min(...vataDeltas);
      constitutionalStability = vataVariance <= 8
        ? "High Stability (Janma Prakriti established)"
        : "Moderate Seasonal Shift (Vikriti fluctuation observed)";
    }

    return res.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        baselinePrakriti: patient.baselinePrakriti,
        totalVisits: history.length
      },
      constitutionalStability,
      trendData,
      history
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
