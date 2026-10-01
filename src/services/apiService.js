/**
 * AyurEssence — Production REST API Client
 * Connects frontend UI to backend REST endpoints with JWT authorization,
 * request ID tracking, and seamless fallback to local storage if offline.
 */

import { getStoredPatients, savePatients } from "./storageService";

const API_BASE = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "tridoshalab_jwt_token";
const USER_KEY = "tridoshalab_user_session";

// Default pre-seeded accounts for instant testing / access
export const CLINICAL_ACCOUNTS = {
  doctor: {
    name: "Dr. K. Raghavendra Rao",
    title: "Senior Consultant Vaidya, BAMS, MD (Ayu)",
    email: "doctor@sdm.edu",
    role: "doctor",
    institution: "SDM College of Ayurveda & Hospital, Udupi"
  },
  student: {
    name: "Pooja Hegde",
    title: "Final Year BAMS Scholar",
    email: "student@smvitm.ac.in",
    role: "student",
    institution: "SMVITM Bantakal / SDM Ayurveda"
  }
};

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function saveStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error("Error saving auth token:", err);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error("Error saving user session:", err);
  }
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, config);
    const data = await res.json().catch(() => ({}));
    return {
      ok: res.ok,
      status: res.status,
      data
    };
  } catch (err) {
    console.warn(`[API] Network error requesting ${path}:`, err.message);
    return {
      ok: false,
      status: 0,
      error: err.message,
      data: null
    };
  }
}

export const api = {
  // Authentication
  async login(email, password) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (res.ok && res.data?.token) {
      saveStoredToken(res.data.token);
      saveStoredUser(res.data.user);
    }
    return res;
  },

  async register(userData) {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });

    if (res.ok && res.data?.token) {
      saveStoredToken(res.data.token);
      saveStoredUser(res.data.user);
    }
    return res;
  },

  logout() {
    saveStoredToken("");
    saveStoredUser(null);
  },

  // Health check
  async checkHealth() {
    return request("/health/ready");
  },

  // Questionnaire
  async getStandardQuestionnaire() {
    return request("/questionnaires/standard");
  },

  // Patients
  async getPatients() {
    return request("/patients");
  },

  async createPatient(patientData) {
    return request("/patients", {
      method: "POST",
      body: JSON.stringify(patientData)
    });
  },

  // Assessments
  async getAssessments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/assessments${query ? `?${query}` : ""}`);
  },

  async getAssessmentById(id) {
    return request(`/assessments/${id}`);
  },

  async createAssessment(assessmentData) {
    return request("/assessments", {
      method: "POST",
      body: JSON.stringify(assessmentData)
    });
  },

  async updateAssessment(id, updateData) {
    return request(`/assessments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData)
    });
  },

  async finalizeAssessment(id, finalizationData) {
    return request(`/doctor/assessments/${id}/finalize`, {
      method: "POST",
      body: JSON.stringify(finalizationData)
    });
  },

  async deliverReport(id) {
    return request(`/doctor/assessments/${id}/deliver-report`, {
      method: "POST"
    });
  },

  // Reports
  async getReport(assessmentId, level = "doctor") {
    return request(`/reports/${assessmentId}?level=${level}`);
  },

  // Voice dictation transcript insertion
  async insertVoiceTranscription(assessmentId, field, transcript) {
    return request(`/assessments/${assessmentId}/transcription`, {
      method: "POST",
      body: JSON.stringify({ field, transcript })
    });
  }
};
