import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import { db } from "../data/database.js";

/**
 * Authentication Middleware: Verifies Bearer JWT token
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid Bearer token in the Authorization header.",
      error: "Authentication required. Please provide a valid Bearer token in the Authorization header.",
      errorCode: "UNAUTHORIZED",
      requestId: req.id || req.requestId || "unknown"
    });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
        error: "Invalid or expired token. Please log in again.",
        errorCode: "INVALID_TOKEN",
        requestId: req.id || req.requestId || "unknown"
      });
    }

    const user = db.findById("users", decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User corresponding to this token no longer exists.",
        error: "User corresponding to this token no longer exists.",
        errorCode: "USER_NOT_FOUND",
        requestId: req.id || req.requestId || "unknown"
      });
    }

    if (String(user.role).toLowerCase() === "patient" || String(decoded.role).toLowerCase() === "patient") {
      return res.status(403).json({
        success: false,
        message: "Patient portal access is disabled. Assessments and reports are accessible only via supervising Doctor or Student clinician.",
        error: "Patient portal access is disabled. Assessments and reports are accessible only via supervising Doctor or Student clinician.",
        errorCode: "PATIENT_ACCESS_DISABLED",
        requestId: req.id || req.requestId || "unknown"
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: String(user.role).toLowerCase(),
      displayRole: user.role,
      institution: user.institution,
      qualification: user.qualification
    };
    next();
  });
}

/**
 * RBAC Authorization Middleware: Enforces permissions based on user role
 * @param {Array<string>|string} allowedRoles - 'doctor', 'student', 'patient'
 */
export function requireRole(allowedRoles) {
  const roles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map((r) =>
    String(r).toLowerCase()
  );

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before checking permissions.",
        error: "Authentication required before checking permissions.",
        errorCode: "UNAUTHORIZED",
        requestId: req.id || req.requestId || "unknown"
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized. Allowed roles: [${roles.join(", ")}].`,
        error: `Access denied. Role '${req.user.role}' is not authorized. Allowed roles: [${roles.join(", ")}].`,
        errorCode: "FORBIDDEN_ROLE",
        requestId: req.id || req.requestId || "unknown",
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
}

/**
 * Convenience Middleware: Requires Doctor Role
 */
export const requireDoctor = requireRole("doctor");

/**
 * Convenience Middleware: Requires Clinician/Practitioner Role (Doctor or Student)
 */
export const requirePractitioner = requireRole(["doctor", "student"]);

/**
 * Middleware: Strictly blocks patients from taking or modifying assessments
 */
export function forbidPatient(req, res, next) {
  if (req.user && String(req.user.role).toLowerCase() === "patient") {
    return res.status(403).json({
      success: false,
      message: "Patients are not permitted to access assessment workflows or clinical evaluation tools.",
      error: "Patients are not permitted to access assessment workflows or clinical evaluation tools.",
      errorCode: "PATIENT_ASSESSMENT_FORBIDDEN",
      requestId: req.id || req.requestId || "unknown"
    });
  }
  next();
}

/**
 * Generates JWT token for an authenticated user (Doctor or Student only)
 */
export function generateToken(user) {
  if (user && String(user.role).toLowerCase() === "patient") {
    throw new Error("Patient credentials and tokens cannot be generated. Patients exist only as clinical subjects.");
  }
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRES_IN }
  );
}
