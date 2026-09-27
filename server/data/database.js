import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { CONFIG } from "../config/config.js";
import { STANDARD_QUESTIONS } from "../../src/data/standardQuestionnaire.js";

// Ensure data directory exists
const dataDir = path.dirname(CONFIG.DATA_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Generate default seed database with pre-configured Doctor, Student, and Patient
 * including Mr. Kamath with 3 historical visits as highlighted in the Evaluation 1 brief.
 */
function getInitialSeedData() {
  const doctorPasswordHash = bcrypt.hashSync("Doctor@123", 10);
  const studentPasswordHash = bcrypt.hashSync("Student@123", 10);
  const patientPasswordHash = bcrypt.hashSync("Patient@123", 10);

  return {
    users: [
      {
        id: "USR-DOC-001",
        name: "Dr. K. Raghavendra Rao",
        email: "doctor@sdm.edu",
        passwordHash: doctorPasswordHash,
        role: "doctor",
        qualification: "BAMS, MD (Ayurveda - Kriya Sharira)",
        institution: "SDM College of Ayurveda & Hospital, Udupi",
        registrationNo: "AYU-KA-14829",
        createdAt: "2026-01-10T09:00:00.000Z"
      },
      {
        id: "USR-STU-001",
        name: "Dr. Mahesh Bhat",
        email: "student@sdm.edu",
        passwordHash: studentPasswordHash,
        role: "student",
        qualification: "Final Year BAMS Scholar",
        institution: "SDM College of Ayurveda, Udupi",
        registrationNo: "SDM-BAMS-2022-44",
        createdAt: "2026-01-12T10:30:00.000Z"
      },
      {
        id: "USR-PAT-001",
        name: "Mr. Ganesh Kamath",
        email: "patient@kamath.org",
        passwordHash: patientPasswordHash,
        role: "patient",
        phone: "+91 98451 98765",
        createdAt: "2026-01-15T11:00:00.000Z"
      }
    ],
    patients: [
      {
        id: "PAT-UDU-KAMATH-001",
        name: "Mr. Ganesh Kamath",
        age: 45,
        gender: "Male",
        phone: "+91 98451 98765",
        email: "patient@kamath.org",
        city: "Udupi, Karnataka",
        occupation: "Business Owner (Retail Logistics)",
        dietType: "Lacto-Vegetarian",
        primaryComplaint: "Routine constitutional assessment & seasonal lifestyle guidance",
        registeredDate: "2026-01-15",
        baselinePrakriti: "Vata-Pitta (Dwandwaja)",
        linkedAssessments: ["ASM-KAMATH-001", "ASM-KAMATH-002", "ASM-KAMATH-003"]
      },
      {
        id: "PAT-UDU-2026-002",
        name: "Deepa Shenoy",
        age: 41,
        gender: "Female",
        phone: "+91 94482 66781",
        email: "deepa.shenoy@example.org",
        city: "Karkala, Udupi Dist.",
        occupation: "High School Teacher",
        dietType: "Vegetarian",
        primaryComplaint: "Constitutional profile & Ritucharya guidance",
        registeredDate: "2026-03-01",
        baselinePrakriti: "Pitta-Kapha (Dwandwaja)",
        linkedAssessments: ["ASM-2026-002"]
      },
      {
        id: "PAT-UDU-2026-003",
        name: "Kiran Hegde",
        age: 23,
        gender: "Male",
        phone: "+91 97312 99014",
        email: "kiran.hegde@smvitm.ac.in",
        city: "Bantakal, Udupi",
        occupation: "Engineering Student (SMVITM)",
        dietType: "Non-Vegetarian (Occasional)",
        primaryComplaint: "Student Practice Evaluation (Kriya Sharira Case Study)",
        registeredDate: "2026-09-10",
        baselinePrakriti: "Vata-Kapha",
        linkedAssessments: ["ASM-2026-003"]
      }
    ],
    questions: STANDARD_QUESTIONS.map((q, idx) => ({
      ...q,
      order: idx + 1,
      isCustom: false,
      createdBy: "system"
    })),
    questionnaires: [
      {
        id: "sdm-udupi-standard-24",
        title: "SDM Udupi Standard Comprehensive Prakriti Questionnaire",
        institution: "SDM College of Ayurveda & Hospital, Kuthpady, Udupi",
        version: "2.4.0",
        itemCount: 24,
        isDefault: true,
        createdAt: "2026-01-01T00:00:00.000Z"
      }
    ],
    assessments: [
      // Mr. Kamath Visit 1 (Jan 2026)
      {
        id: "ASM-KAMATH-001",
        patientId: "PAT-UDU-KAMATH-001",
        date: "2026-01-15",
        season: "Shishira (Late Winter)",
        conductedBy: {
          id: "USR-DOC-001",
          name: "Dr. K. Raghavendra Rao",
          role: "doctor"
        },
        status: "finalized",
        supervisorApproved: true,
        supervisorNotes: "Initial baseline Janma Prakriti assessment confirmed.",
        scores: {
          vata: 58.0,
          pitta: 28.0,
          kapha: 14.0,
          dominantPrakriti: "Vata-Pitta",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 60, pitta: 26, kapha: 14 },
            physiological: { vata: 57, pitta: 29, kapha: 14 },
            psychological: { vata: 57, pitta: 29, kapha: 14 }
          }
        },
        observations: {
          freeText: "Patient reports poor sleep, dry skin, and irregular appetite during coastal winter winds.",
          ashtavidha: {
            nadi: "Sarpa-Manduka Gati (Vata-Pitta)",
            jihva: "Niralpa (Clean, slightly dry)",
            sparsha: "Sheeta-Ruksha (Cool, dry)",
            drik: "Chala (Restless gaze)"
          },
          nlpSignals: [
            { term: "poor sleep", dosha: "vata", guna: "Alpa Nidra" },
            { term: "dry skin", dosha: "vata", guna: "Ruksha Twak" },
            { term: "irregular appetite", dosha: "vata", guna: "Vishama Agni" }
          ]
        },
        answers: { q1_frame: "v", q2_weight: "v", q3_skin: "v", q7_agni: "v", q8_koshta: "v", q12_nidra: "v" }
      },
      // Mr. Kamath Visit 2 (April 2026 - Summer shift)
      {
        id: "ASM-KAMATH-002",
        patientId: "PAT-UDU-KAMATH-001",
        date: "2026-04-20",
        season: "Grishma (Summer)",
        conductedBy: {
          id: "USR-DOC-001",
          name: "Dr. K. Raghavendra Rao",
          role: "doctor"
        },
        status: "finalized",
        supervisorApproved: true,
        supervisorNotes: "Follow-up review. Pitta slightly elevated due to summer heat, baseline remains Vata-Pitta.",
        scores: {
          vata: 52.0,
          pitta: 34.0,
          kapha: 14.0,
          dominantPrakriti: "Vata-Pitta",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 54, pitta: 32, kapha: 14 },
            physiological: { vata: 51, pitta: 35, kapha: 14 },
            psychological: { vata: 51, pitta: 35, kapha: 14 }
          }
        },
        observations: {
          freeText: "Patient reports increased thirst, warm palms, and sensitivity to mid-day sun in Udupi.",
          ashtavidha: {
            nadi: "Manduka-Sarpa Gati",
            jihva: "Rakta-Kanta",
            sparsha: "Ushna (Warm)",
            drik: "Tejasvi"
          },
          nlpSignals: [
            { term: "increased thirst", dosha: "pitta", guna: "Trishna" },
            { term: "warm palms", dosha: "pitta", guna: "Ushna" }
          ]
        },
        answers: { q1_frame: "v", q2_weight: "v", q3_skin: "p", q7_agni: "p", q9_thirst: "p", q12_nidra: "v" }
      },
      // Mr. Kamath Visit 3 (Sept 2026 - Recent follow-up)
      {
        id: "ASM-KAMATH-003",
        patientId: "PAT-UDU-KAMATH-001",
        date: "2026-09-12",
        season: "Varsha / Sharad (Autumn)",
        conductedBy: {
          id: "USR-DOC-001",
          name: "Dr. K. Raghavendra Rao",
          role: "doctor"
        },
        status: "finalized",
        supervisorApproved: true,
        supervisorNotes: "Third longitudinal review. Constitutional stability demonstrated over 9 months.",
        scores: {
          vata: 54.0,
          pitta: 31.0,
          kapha: 15.0,
          dominantPrakriti: "Vata-Pitta",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 55, pitta: 30, kapha: 15 },
            physiological: { vata: 53, pitta: 32, kapha: 15 },
            psychological: { vata: 54, pitta: 31, kapha: 15 }
          }
        },
        observations: {
          freeText: "Patient practicing daily warm sesame oil Abhyanga; sleep quality improved, skin moisture restored.",
          ashtavidha: {
            nadi: "Sarpa-Manduka Gati",
            jihva: "Prakruta",
            sparsha: "Mridu",
            drik: "Sthira"
          },
          nlpSignals: [
            { term: "warm sesame oil abhyanga", dosha: "vata", guna: "Snigdha" },
            { term: "skin moisture restored", dosha: "kapha", guna: "Snigdha" }
          ]
        },
        answers: { q1_frame: "v", q2_weight: "v", q3_skin: "v", q7_agni: "p", q9_thirst: "v", q12_nidra: "p" }
      },
      // Student assessment pending supervisor approval
      {
        id: "ASM-2026-003",
        patientId: "PAT-UDU-2026-003",
        date: "2026-09-11",
        season: "Varsha / Sharad",
        conductedBy: {
          id: "USR-STU-001",
          name: "Dr. Mahesh Bhat",
          role: "student"
        },
        status: "draft",
        supervisorApproved: false,
        supervisorNotes: "Student assessment submitted for evaluation. Pending supervising doctor review.",
        scores: {
          vata: 41.5,
          pitta: 20.2,
          kapha: 38.3,
          dominantPrakriti: "Vata-Kapha",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 44, pitta: 18, kapha: 38 },
            physiological: { vata: 40, pitta: 22, kapha: 38 },
            psychological: { vata: 41, pitta: 20, kapha: 39 }
          }
        },
        observations: {
          freeText: "Tall frame with heavy joints. Slow speech but irregular appetite and sensitivity to cold monsoon winds.",
          ashtavidha: { nadi: "Sarpa-Hamsa Gati", jihva: "Shveta-Lipta", sparsha: "Sheeta", drik: "Sthira" },
          nlpSignals: [
            { term: "tall frame", dosha: "vata", guna: "Laghu" },
            { term: "heavy joints", dosha: "kapha", guna: "Guru" }
          ]
        },
        answers: { q1_frame: "v", q2_weight: "k", q3_skin: "v", q7_agni: "v", q14_bala: "k" }
      }
    ],
    reports: [],
    audit_logs: []
  };
}

class Database {
  constructor(filePath) {
    this.filePath = filePath;
    this.locks = new Map();
    this.init();
  }

  init() {
    if (!fs.existsSync(this.filePath)) {
      const initialData = getInitialSeedData();
      this.write(initialData);
    } else {
      // Ensure new collections exist in db.json if migrated
      const current = this.read();
      let changed = false;
      if (!current.audit_logs) {
        current.audit_logs = [];
        changed = true;
      }
      if (!current.reports) {
        current.reports = [];
        changed = true;
      }
      if (changed) {
        this.write(current);
      }
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Database read error, restoring seeds:", err);
      const initial = getInitialSeedData();
      this.write(initial);
      return initial;
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  getCollection(name) {
    const db = this.read();
    return db[name] || [];
  }

  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => item.id === id) || null;
  }

  insert(collectionName, item) {
    const db = this.read();
    if (!db[collectionName]) {
      db[collectionName] = [];
    }
    db[collectionName].push(item);
    this.write(db);
    return item;
  }

  updateById(collectionName, id, updates) {
    const db = this.read();
    const list = db[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    db[collectionName][index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.write(db);
    return db[collectionName][index];
  }

  deleteById(collectionName, id) {
    const db = this.read();
    const list = db[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    db[collectionName].splice(index, 1);
    this.write(db);
    return true;
  }

  query(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return items.filter(predicate);
  }

  paginate(collectionName, { page = 1, limit = 20, filterFn = null, sortFn = null } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    let items = this.getCollection(collectionName);

    if (filterFn && typeof filterFn === "function") {
      items = items.filter(filterFn);
    }

    if (sortFn && typeof sortFn === "function") {
      items = [...items].sort(sortFn);
    } else {
      // Default newest first if createdAt or date exists
      items = [...items].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA;
      });
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const offset = (pageNum - 1) * limitNum;
    const data = items.slice(offset, offset + limitNum);

    return {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  /**
   * Atomic operation for assessment finalization with row-locking concurrency guard
   */
  async atomicFinalize(assessmentId, finalizerFn) {
    // Acquire lock for this assessment ID
    while (this.locks.get(assessmentId)) {
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
    this.locks.set(assessmentId, true);

    try {
      const current = this.findById("assessments", assessmentId);
      if (!current) {
        return { notFound: true };
      }

      if (current.status?.toUpperCase() === "FINALIZED") {
        return { conflict: true, assessment: current };
      }

      // Execute finalizer transaction function
      const updatedAssessment = await finalizerFn(current);
      return { success: true, assessment: updatedAssessment };
    } finally {
      this.locks.delete(assessmentId);
    }
  }

  isConnected() {
    try {
      const data = this.read();
      return Boolean(data && typeof data === "object");
    } catch (err) {
      return false;
    }
  }

  reset() {
    const seeds = getInitialSeedData();
    this.write(seeds);
    return seeds;
  }
}

export const db = new Database(CONFIG.DATA_FILE_PATH);

/**
 * Global audit logger helper
 */
export function recordAuditLog({ actorId, actorRole, action, assessmentId = null, requestId = null, metadata = {} }) {
  const audit = {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    actorId: actorId || "SYSTEM",
    actorRole: actorRole || "SYSTEM",
    action,
    assessmentId,
    requestId,
    metadata,
    timestamp: new Date().toISOString()
  };
  db.insert("audit_logs", audit);
  return audit;
}

