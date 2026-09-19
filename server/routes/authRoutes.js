import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../data/database.js";
import { generateToken, authenticateToken } from "../middleware/auth.js";

export const authRouter = express.Router();

/**
 * POST /api/auth/register
 * Register a new Doctor, Student, or Patient
 */
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, qualification, institution, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required fields.",
        error: "Name, email, and password are required fields."
      });
    }

    const validRoles = ["doctor", "student", "patient"];
    const inputRole = role ? String(role).toLowerCase() : "patient";
    const userRole = validRoles.includes(inputRole) ? inputRole : "patient";
    const formattedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    // Check if email already registered
    const existing = db.query("users", (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `User with email '${email}' is already registered.`,
        error: `User with email '${email}' is already registered.`
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `USR-${userRole.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: formattedRole,
      qualification: qualification || (userRole === "doctor" ? "BAMS, MD" : userRole === "student" ? "BAMS Scholar" : "Citizen"),
      institution: institution || (userRole !== "patient" ? "SDM College of Ayurveda, Udupi" : "Self"),
      phone: phone || "",
      createdAt: new Date().toISOString()
    };

    db.insert("users", newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: `${formattedRole} registered successfully.`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        institution: newUser.institution,
        qualification: newUser.qualification
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticate doctor, student, or patient and return JWT
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required for login.",
        error: "Email and password are required for login."
      });
    }

    const users = db.query("users", (u) => u.email.toLowerCase() === email.toLowerCase());
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        error: "Invalid email or password."
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        error: "Invalid email or password."
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        qualification: user.qualification
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});


/**
 * GET /api/auth/me
 * Get current authenticated user profile and permissions
 */
authRouter.get("/me", authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * GET /api/auth/roles
 * RBAC permission matrix for documentation and client configuration
 */
authRouter.get("/roles", (req, res) => {
  return res.json({
    success: true,
    roles: {
      doctor: {
        description: "Senior practitioner / Ayurvedic physician",
        permissions: [
          "create_patient", "update_patient", "delete_patient",
          "create_assessment", "edit_assessment", "finalize_assessment",
          "approve_student_report", "create_custom_question", "edit_question", "delete_question",
          "view_doctor_report", "view_patient_report"
        ]
      },
      student: {
        description: "BAMS / Ayurveda Scholar in training",
        permissions: [
          "create_patient", "create_assessment", "save_draft_assessment",
          "record_observations", "view_methodology", "view_doctor_report", "view_patient_report"
        ],
        restrictions: ["cannot_finalize_assessment", "cannot_approve_student_report", "cannot_modify_questionnaire"]
      },
      patient: {
        description: "Individual assessed for constitutional Prakriti",
        permissions: [
          "view_own_profile", "view_patient_report", "view_dinacharya_guidance"
        ],
        restrictions: ["no_clinical_editing", "no_student_supervision"]
      }
    }
  });
});
