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
      error: "Authentication required. Please provide a valid Bearer token in the Authorization header."
    });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
        error: "Invalid or expired token. Please log in again."
      });
    }

    const user = db.findById("users", decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User corresponding to this token no longer exists.",
        error: "User corresponding to this token no longer exists."
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
        error: "Authentication required before checking permissions."
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized. Allowed roles: [${roles.join(", ")}].`,
        error: `Access denied. Role '${req.user.role}' is not authorized. Allowed roles: [${roles.join(", ")}].`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
}

/**
 * Generates JWT token for an authenticated user
 */
export function generateToken(user) {
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
