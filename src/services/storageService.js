/**
 * Storage and Persistence Service
 * Uses browser LocalStorage with export/import JSON capability
 */

import { SAMPLE_PATIENTS } from "../data/samplePatients";
import { STANDARD_QUESTIONS, QUESTIONNAIRE_METADATA } from "../data/standardQuestionnaire";

const STORAGE_KEYS = {
  PATIENTS: "ayuressence_patients_v2",
  QUESTIONNAIRES: "ayuressence_questionnaires_v2",
  ACTIVE_QUESTIONNAIRE_ID: "ayuressence_active_q_id_v2",
  USER_ROLE: "ayuressence_role_v2",
  LANGUAGE: "ayuressence_lang_v2"
};

export function deduplicateAssessments(assessments) {
  if (!Array.isArray(assessments)) return [];
  const map = new Map();
  for (const a of assessments) {
    if (!a) continue;
    const key = a.id || `${a.date}_${a.conductedBy?.name || ""}`;
    if (map.has(key)) {
      // Merge/update assessment with latest data
      const existing = map.get(key);
      map.set(key, { ...existing, ...a });
    } else {
      map.set(key, a);
    }
  }
  return Array.from(map.values());
}

export function deduplicatePatients(patientList) {
  if (!Array.isArray(patientList)) return [];
  const emailMap = new Map();
  const idMap = new Map();
  const result = [];

  for (const p of patientList) {
    if (!p) continue;
    const normEmail = p.email ? p.email.trim().toLowerCase() : null;
    let target = null;

    if (normEmail && emailMap.has(normEmail)) {
      target = emailMap.get(normEmail);
    } else if (p.id && idMap.has(p.id)) {
      target = idMap.get(p.id);
    }

    if (target) {
      // Merge fields, updating existing record
      const mergedAssessments = deduplicateAssessments([
        ...(target.assessments || []),
        ...(p.assessments || [])
      ]);
      Object.assign(target, {
        ...p,
        id: target.id || p.id,
        baselinePrakriti: p.baselinePrakriti || target.baselinePrakriti,
        assessments: mergedAssessments
      });
    } else {
      const copy = {
        ...p,
        assessments: deduplicateAssessments(p.assessments || [])
      };
      if (normEmail) emailMap.set(normEmail, copy);
      if (p.id) idMap.set(p.id, copy);
      result.push(copy);
    }
  }
  return result;
}

export function getStoredPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return deduplicatePatients(parsed);
      }
    }
  } catch (err) {
    console.error("Error reading stored patients:", err);
  }
  // Initialize with samples
  const initial = deduplicatePatients(SAMPLE_PATIENTS);
  savePatients(initial);
  return initial;
}

export function savePatients(patients) {
  try {
    const deduplicated = deduplicatePatients(patients);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(deduplicated));
  } catch (err) {
    console.error("Error saving patients:", err);
  }
}

export function getStoredQuestionnaires() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading questionnaires:", err);
  }

  // Initialize with standard questionnaire
  const initial = [
    {
      metadata: QUESTIONNAIRE_METADATA,
      questions: STANDARD_QUESTIONS
    }
  ];
  saveQuestionnaires(initial);
  return initial;
}

export function saveQuestionnaires(questionnaires) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(questionnaires));
  } catch (err) {
    console.error("Error saving questionnaires:", err);
  }
}

export function getStoredRole() {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || "doctor";
}

export function saveStoredRole(role) {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
}

export function getStoredLanguage() {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";
}

export function saveStoredLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function exportFullDataBackup() {
  const data = {
    exportedAt: new Date().toISOString(),
    source: "TridoshaLab - SDM College of Ayurveda, Udupi & SMVITM",
    patients: getStoredPatients(),
    questionnaires: getStoredQuestionnaires()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tridoshalab-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFullDataBackup(jsonData) {
  try {
    const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
    if (parsed.patients && Array.isArray(parsed.patients)) {
      savePatients(parsed.patients);
    }
    if (parsed.questionnaires && Array.isArray(parsed.questionnaires)) {
      saveQuestionnaires(parsed.questionnaires);
    }
    return true;
  } catch (err) {
    console.error("Failed to import data:", err);
    return false;
  }
}

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.PATIENTS);
  localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRES);
  savePatients(SAMPLE_PATIENTS);
  const initial = [
    {
      metadata: QUESTIONNAIRE_METADATA,
      questions: STANDARD_QUESTIONS
    }
  ];
  saveQuestionnaires(initial);
  return { patients: SAMPLE_PATIENTS, questionnaires: initial };
}
