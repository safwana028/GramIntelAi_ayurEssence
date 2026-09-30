/**
 * Automated Test Runner for AyurEssence Backend
 * Verifies all 18 Phase 13 Evaluation Requirements
 */

process.env.NODE_ENV = "test";

import http from "http";
import jwt from "jsonwebtoken";
import app from "../index.js";
import { db } from "../data/database.js";
import { CONFIG } from "../config/config.js";

const TEST_PORT = 5055;
let server;
let testUserToken = "";
let doctorToken = "";
let studentToken = "";
let legacyPatientToken = "";
let registeredUserEmail = "";
let createdAssessmentId = "";

// Helper for HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:${TEST_PORT}${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runTests() {
  console.log("===============================================================");
  console.log("🌿 AYURESSENCE BACKEND TEST RUNNER — 18 CORE EVALUATION TESTS");
  console.log("===============================================================\n");

  let passedTests = 0;

  try {
    // -------------------------------------------------------------
    // TEST 1: Server starts successfully
    // -------------------------------------------------------------
    console.log("🔹 TEST 1: Server starts successfully");
    server = await new Promise((resolve, reject) => {
      const s = app.listen(TEST_PORT, () => resolve(s));
      s.on("error", reject);
    });
    const healthRes = await request("GET", "/api/health");
    assert(healthRes.status === 200, "Server responded to health check with status 200");
    assert(healthRes.body.success === true, "Health check returned success: true");
    console.log("  [PASS] TEST 1: Server starts successfully.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 2: Database connection works
    // -------------------------------------------------------------
    console.log("🔹 TEST 2: Database connection works");
    assert(db.isConnected() === true, "Database is connected and accessible");
    assert(healthRes.body.database.status === "connected", "Health endpoint confirms database status is 'connected'");
    assert(healthRes.body.database.usersCount >= 3, "Database contains pre-seeded users");
    console.log("  [PASS] TEST 2: Database connection works.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 3: User registration works
    // -------------------------------------------------------------
    console.log("🔹 TEST 3: User registration works");
    registeredUserEmail = `ayur.student.${Date.now()}@sdm.edu`;
    const regRes = await request("POST", "/api/auth/register", {
      name: "Rohit Sharma",
      email: registeredUserEmail,
      password: "Password@123",
      role: "Student",
      institution: "SDM College of Ayurveda, Udupi"
    });
    assert(regRes.status === 201, "POST /api/auth/register returned 201 Created");
    assert(regRes.body.success === true, "Registration returned success: true");
    assert(Boolean(regRes.body.token), "JWT token is returned upon registration");
    assert(regRes.body.user.email === registeredUserEmail.toLowerCase(), "Registered user email matches");
    assert(regRes.body.user.role.toLowerCase() === "student", "Registered role is Student");
    assert(regRes.body.user.passwordHash === undefined, "Password hash is never exposed in response");
    testUserToken = regRes.body.token;
    console.log("  [PASS] TEST 3: User registration works.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 4: Duplicate registration is rejected
    // -------------------------------------------------------------
    console.log("🔹 TEST 4: Duplicate registration is rejected");
    const dupRes = await request("POST", "/api/auth/register", {
      name: "Duplicate User",
      email: registeredUserEmail,
      password: "Password@123",
      role: "Student"
    });
    assert(dupRes.status === 409 || dupRes.status === 400, "Duplicate registration rejected with 409 Conflict / 400 Bad Request");
    assert(dupRes.body.success === false, "Duplicate registration returned success: false");
    console.log("  [PASS] TEST 4: Duplicate registration is rejected.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 5: Login works
    // -------------------------------------------------------------
    console.log("🔹 TEST 5: Login works");
    const loginRes = await request("POST", "/api/auth/login", {
      email: "doctor@sdm.edu",
      password: "Doctor@123"
    });
    assert(loginRes.status === 200, "POST /api/auth/login returned 200 OK");
    assert(loginRes.body.success === true, "Login returned success: true");
    assert(Boolean(loginRes.body.token), "Login returned JWT token");
    assert(loginRes.body.user.role.toLowerCase() === "doctor", "Doctor role authenticated successfully");
    assert(loginRes.body.user.passwordHash === undefined, "Password is not returned in login response");
    doctorToken = loginRes.body.token;

    const stuLoginRes = await request("POST", "/api/auth/login", {
      email: "student@sdm.edu",
      password: "Student@123"
    });
    studentToken = stuLoginRes.body.token;
    console.log("  [PASS] TEST 5: Login works.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 6: Invalid login is rejected
    // -------------------------------------------------------------
    console.log("🔹 TEST 6: Invalid login is rejected");
    const invalidLogin = await request("POST", "/api/auth/login", {
      email: "doctor@sdm.edu",
      password: "WrongPassword"
    });
    assert(invalidLogin.status === 401, "Invalid password returns 401 Unauthorized");
    assert(invalidLogin.body.success === false, "Invalid login returned success: false");

    const unknownUser = await request("POST", "/api/auth/login", {
      email: "nonexistent@user.com",
      password: "Password@123"
    });
    assert(unknownUser.status === 401, "Nonexistent email returns 401 Unauthorized");
    console.log("  [PASS] TEST 6: Invalid login is rejected.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 7: JWT protected endpoint rejects unauthenticated request
    // -------------------------------------------------------------
    console.log("🔹 TEST 7: JWT protected endpoint rejects unauthenticated request");
    const unauthMe = await request("GET", "/api/auth/me");
    assert(unauthMe.status === 401, "GET /api/auth/me without token returns 401 Unauthorized");
    assert(unauthMe.body.success === false, "Unauthenticated request returns success: false");

    const authMe = await request("GET", "/api/auth/me", null, doctorToken);
    assert(authMe.status === 200, "GET /api/auth/me with valid token returns 200 OK");
    assert(authMe.body.user.role.toLowerCase() === "doctor", "Verified authenticated profile");
    console.log("  [PASS] TEST 7: JWT protected endpoint rejects unauthenticated request.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 8: Questionnaire can be fetched
    // -------------------------------------------------------------
    console.log("🔹 TEST 8: Questionnaire can be fetched");
    const qList = await request("GET", "/api/questionnaires");
    assert(qList.status === 200, "GET /api/questionnaires returns 200 OK");
    assert(qList.body.success === true, "Questionnaires list returned success: true");

    const qStandard = await request("GET", "/api/questionnaires/standard");
    assert(qStandard.status === 200, "GET /api/questionnaires/standard returns 200 OK");
    const questions = qStandard.body.data.questions || qStandard.body.questions;
    assert(questions.length >= 24, "Standard questionnaire contains 24 classical questions");
    assert(Boolean(questions[0].category || questions[0].dimension), "Questions support category/dimension");
    assert(questions[0].options.length >= 3, "Questions support options with scoring info");
    console.log("  [PASS] TEST 8: Questionnaire can be fetched.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 9: Assessment can be submitted
    // -------------------------------------------------------------
    console.log("🔹 TEST 9: Assessment can be submitted");
    const sampleAnswers = {
      q1_frame: "v",
      q2_weight: "v",
      q3_skin: "v",
      q4_hair: "v",
      q5_eyes: "p",
      q6_teeth: "p",
      q7_agni: "v",
      q8_koshta: "v",
      q9_thirst: "p",
      q10_perspiration: "p",
      q11_pulse: "v",
      q12_nidra: "v"
    };

    const submitRes = await request(
      "POST",
      "/api/assessments",
      {
        questionnaireId: "sdm-udupi-standard-24",
        answers: sampleAnswers,
        observations: {
          freeText: "Patient presents with dry skin, light sleep, and erratic digestion."
        }
      },
      testUserToken
    );
    assert(submitRes.status === 201, "POST /api/assessments returns 201 Created");
    assert(submitRes.body.success === true, "Assessment submission returned success: true");
    const createdAssessment = submitRes.body.assessment || submitRes.body.data;
    assert(Boolean(createdAssessment.id), "Assessment assigned unique ID");
    createdAssessmentId = createdAssessment.id;
    console.log(`  [PASS] TEST 9: Assessment can be submitted (ID: ${createdAssessmentId}).\n`);
    passedTests++;

    // -------------------------------------------------------------
    // TEST 10: Prakriti calculation works
    // -------------------------------------------------------------
    console.log("🔹 TEST 10: Prakriti calculation works");
    const calcRes = await request("POST", "/api/prakriti/calculate", {
      answers: {
        q1_frame: "v",
        q2_weight: "v",
        q3_skin: "v",
        q4_hair: "v",
        q7_agni: "v"
      }
    });
    assert(calcRes.status === 200, "POST /api/prakriti/calculate returns 200 OK");
    assert(calcRes.body.success === true, "Prakriti calculation returned success: true");
    assert(typeof calcRes.body.data.vata === "number", "Calculated Vata score is numeric");
    assert(typeof calcRes.body.data.pitta === "number", "Calculated Pitta score is numeric");
    assert(typeof calcRes.body.data.kapha === "number", "Calculated Kapha score is numeric");
    console.log("  [PASS] TEST 10: Prakriti calculation works.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 11: Vata + Pitta + Kapha = 100%
    // -------------------------------------------------------------
    console.log("🔹 TEST 11: Vata + Pitta + Kapha = 100%");
    // Test multiple combinations to verify invariant
    const testCases = [
      { answers: { q1: "v", q2: "p", q3: "k" } },
      { answers: { q1: "v", q2: "v", q3: "p" } },
      { answers: { q1: "k", q2: "k", q3: "k", q4: "p" } },
      { answers: sampleAnswers }
    ];

    for (const tc of testCases) {
      const res = await request("POST", "/api/prakriti/calculate", tc);
      const { vata, pitta, kapha } = res.body.data;
      const sum = vata + pitta + kapha;
      assert(sum === 100, `Vata (${vata}) + Pitta (${pitta}) + Kapha (${kapha}) = ${sum}% (MUST equal 100)`);
    }
    console.log("  [PASS] TEST 11: Vata + Pitta + Kapha = 100% in all scenarios.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 12: Dominant Prakriti is calculated dynamically
    // -------------------------------------------------------------
    console.log("🔹 TEST 12: Dominant Prakriti is calculated dynamically");
    // Predominantly Pitta
    const pittaCase = await request("POST", "/api/prakriti/calculate", {
      answers: { q1: "p", q2: "p", q3: "p", q4: "p", q5: "v" }
    });
    const pittaDominant = pittaCase.body.data.dominant || pittaCase.body.data.dominantPrakriti;
    assert(pittaDominant.includes("Pitta"), `Pitta answers yield Pitta dominance (got '${pittaDominant}')`);

    // Predominantly Kapha
    const kaphaCase = await request("POST", "/api/prakriti/calculate", {
      answers: { q1: "k", q2: "k", q3: "k", q4: "k", q5: "p" }
    });
    const kaphaDominant = kaphaCase.body.data.dominant || kaphaCase.body.data.dominantPrakriti;
    assert(kaphaDominant.includes("Kapha"), `Kapha answers yield Kapha dominance (got '${kaphaDominant}')`);
    console.log("  [PASS] TEST 12: Dominant Prakriti is calculated dynamically.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 13: Assessment is stored
    // -------------------------------------------------------------
    console.log("🔹 TEST 13: Assessment is stored");
    const getStored = await request("GET", `/api/assessments/${createdAssessmentId}`, null, testUserToken);
    assert(getStored.status === 200, "Stored assessment retrieved with 200 OK");
    const storedData = getStored.body.assessment || getStored.body.data;
    assert(storedData.id === createdAssessmentId, "Retrieved assessment matches stored ID");
    assert(Boolean(storedData.scores), "Stored assessment contains calculated Prakriti scores");
    assert(storedData.status === "SUBMITTED" || storedData.status === "DRAFT", "Stored assessment status is SUBMITTED");

    // Also check GET /api/assessments/my
    const myAssessments = await request("GET", "/api/assessments/my", null, testUserToken);
    assert(myAssessments.status === 200, "GET /api/assessments/my returns 200 OK");
    assert(myAssessments.body.assessments.length >= 1, "User's assessments list contains newly submitted assessment");
    console.log("  [PASS] TEST 13: Assessment is stored and retrievable.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 14: Report can be fetched
    // -------------------------------------------------------------
    console.log("🔹 TEST 14: Report can be fetched");
    const reportRes = await request("GET", `/api/reports/${createdAssessmentId}`);
    assert(reportRes.status === 200, "GET /api/reports/:id returns 200 OK");
    assert(reportRes.body.success === true, "Report returns success: true");
    const report = reportRes.body.report;
    assert(report.assessmentId === createdAssessmentId, "Report references correct assessmentId");
    assert(typeof report.prakriti.vata === "number", "Report contains Vata percentage");
    assert(typeof report.prakriti.pitta === "number", "Report contains Pitta percentage");
    assert(typeof report.prakriti.kapha === "number", "Report contains Kapha percentage");
    assert(Boolean(report.prakriti.dominant), "Report contains dominant Prakriti");
    assert(Boolean(report.basicInterpretation || report.interpretation), "Report contains basic interpretation");
    console.log("  [PASS] TEST 14: Report can be fetched.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 15: Doctor can view assessment
    // -------------------------------------------------------------
    console.log("🔹 TEST 15: Doctor can view assessment");
    const docAssessments = await request("GET", "/api/doctor/assessments", null, doctorToken);
    assert(docAssessments.status === 200, "GET /api/doctor/assessments returns 200 OK");
    assert(docAssessments.body.assessments.length >= 1, "Doctor view returns assessment queue");

    const docSingle = await request("GET", `/api/doctor/assessments/${createdAssessmentId}`, null, doctorToken);
    assert(docSingle.status === 200, "GET /api/doctor/assessments/:id returns 200 OK");
    const docViewData = docSingle.body.assessment || docSingle.body.data;
    assert(docViewData.id === createdAssessmentId, "Doctor views exact assessment details");
    console.log("  [PASS] TEST 15: Doctor can view assessment.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 16: Doctor can finalize assessment
    // -------------------------------------------------------------
    console.log("🔹 TEST 16: Doctor can finalize assessment");
    const finalizeRes = await request(
      "POST",
      `/api/doctor/assessments/${createdAssessmentId}/finalize`,
      { notes: "Verified and approved by Chief Vaidya." },
      doctorToken
    );
    assert(finalizeRes.status === 200, "POST /api/doctor/assessments/:id/finalize returns 200 OK");
    assert(finalizeRes.body.success === true, "Finalization returns success: true");
    const finalizedData = finalizeRes.body.assessment || finalizeRes.body.data;
    assert(finalizedData.status.toUpperCase() === "FINALIZED", "Assessment status transitioned to FINALIZED");
    console.log("  [PASS] TEST 16: Doctor can finalize assessment (status -> FINALIZED).\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 17: Finalized assessment cannot be modified by normal user
    // -------------------------------------------------------------
    console.log("🔹 TEST 17: Finalized assessment cannot be modified by normal user");
    const modifyAttempt = await request(
      "PUT",
      `/api/assessments/${createdAssessmentId}`,
      {
        answers: { q1: "p" }
      },
      testUserToken // Normal student/patient token
    );
    assert(
      modifyAttempt.status === 403 || modifyAttempt.status === 400,
      "Modifying finalized assessment is rejected (403 Forbidden / 400 Bad Request)"
    );
    assert(modifyAttempt.body.success === false, "Rejected attempt returns success: false");
    console.log("  [PASS] TEST 17: Finalized assessment cannot be modified by normal user.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 18: Assessment state machine transitions (DRAFT -> SUBMITTED -> UNDER_REVIEW)
    // -------------------------------------------------------------
    console.log("🔹 TEST 18: Assessment state machine transitions (DRAFT -> SUBMITTED -> UNDER_REVIEW)");
    const smDraftRes = await request("POST", "/api/assessments", {
      patientId: "PAT-UDU-KAMATH-001",
      answers: { q1_frame: "v" },
      status: "DRAFT"
    }, doctorToken);
    assert(smDraftRes.status === 201, "Draft assessment created with status 201");
    assert(smDraftRes.body.assessment.status === "DRAFT", "Initial status is DRAFT");
    const smId = smDraftRes.body.assessment.id;

    // Transition DRAFT -> SUBMITTED
    const smSubmitRes = await request("PUT", `/api/assessments/${smId}`, {
      status: "SUBMITTED"
    }, doctorToken);
    assert(smSubmitRes.status === 200, "Transition to SUBMITTED returns 200 OK");
    assert(smSubmitRes.body.assessment.status === "SUBMITTED", "Status is now SUBMITTED");

    // Transition SUBMITTED -> UNDER_REVIEW
    const smReviewRes = await request("PUT", `/api/assessments/${smId}`, {
      status: "UNDER_REVIEW"
    }, doctorToken);
    assert(smReviewRes.status === 200, "Transition to UNDER_REVIEW returns 200 OK");
    assert(smReviewRes.body.assessment.status === "UNDER_REVIEW", "Status is now UNDER_REVIEW");
    console.log("  [PASS] TEST 18: Assessment state machine transitions (DRAFT -> SUBMITTED -> UNDER_REVIEW).\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 19: Patient role is strictly forbidden from application login & registration
    // -------------------------------------------------------------
    console.log("🔹 TEST 19: Patient role is strictly forbidden from application login & registration");
    const patientLoginRes = await request("POST", "/api/auth/login", {
      email: "patient@kamath.org",
      password: "Patient@123"
    });
    assert(patientLoginRes.status === 403, "Patient login returns 403 Forbidden");
    assert(patientLoginRes.body.success === false, "Patient login returns success: false");
    assert(patientLoginRes.body.errorCode === "PATIENT_ACCESS_DISABLED", "ErrorCode is PATIENT_ACCESS_DISABLED");

    const patientRegRes = await request("POST", "/api/auth/register", {
      name: "Patient Rogi",
      email: "patient.attempt@domain.com",
      password: "Password@123",
      role: "patient"
    });
    assert(patientRegRes.status === 400, "Patient registration returns 400 Bad Request");
    assert(patientRegRes.body.errorCode === "PATIENT_REGISTRATION_DISABLED", "ErrorCode is PATIENT_REGISTRATION_DISABLED");

    legacyPatientToken = jwt.sign({ id: "USR-PAT-001" }, CONFIG.JWT_SECRET);
    const patientAsmAttempt = await request("POST", "/api/assessments", {
      patientId: "PAT-UDU-KAMATH-001",
      answers: { q1_frame: "v" }
    }, legacyPatientToken);
    assert(patientAsmAttempt.status === 403, "Legacy patient token rejected with 403 Forbidden");
    assert(patientAsmAttempt.body.errorCode === "PATIENT_ACCESS_DISABLED", "ErrorCode is PATIENT_ACCESS_DISABLED");
    console.log("  [PASS] TEST 19: Patient role is strictly forbidden from application login & registration.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 20: Student is forbidden from finalizing assessment
    // -------------------------------------------------------------
    console.log("🔹 TEST 20: Student is forbidden from finalizing assessment");
    // Create a new draft assessment as student
    const studentDraft = await request("POST", "/api/assessments", {
      patientId: "PAT-UDU-KAMATH-001",
      answers: { q1_frame: "v", q2_weight: "p" },
      status: "DRAFT"
    }, studentToken || testUserToken);
    assert(studentDraft.status === 201, "Student draft assessment created");
    const draftId = studentDraft.body.assessment.id;

    const studentFinalizeAttempt = await request("PUT", `/api/assessments/${draftId}/finalize`, {
      notes: "Student attempting unauthorized finalization"
    }, studentToken || testUserToken);
    assert(studentFinalizeAttempt.status === 403, "Student finalization attempt rejected with 403 Forbidden");
    assert(studentFinalizeAttempt.body.success === false, "Student finalization returns success: false");
    console.log("  [PASS] TEST 20: Student is forbidden from finalizing assessment.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 21: Per-question observation note can be saved
    // -------------------------------------------------------------
    console.log("🔹 TEST 21: Per-question observation note can be saved");
    const qNoteRes = await request("PUT", `/api/assessments/${draftId}/question-notes/q1_frame`, {
      note: "Prominent clavicles observed during examination"
    }, doctorToken);
    assert(qNoteRes.status === 200, "Saving per-question note returned 200 OK");
    assert(qNoteRes.body.success === true, "Per-question note returned success: true");
    assert(qNoteRes.body.questionNotes.q1_frame === "Prominent clavicles observed during examination", "Stored note matches input");
    console.log("  [PASS] TEST 21: Per-question observation note can be saved.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 22: Patient-facing message is saved separately from internal clinical notes
    // -------------------------------------------------------------
    console.log("🔹 TEST 22: Patient-facing message is saved separately from internal clinical notes");
    const msgRes = await request("POST", `/api/assessments/${draftId}/patient-message`, {
      message: "Please maintain warm water hydration and follow the Dinacharya routine."
    }, doctorToken);
    assert(msgRes.status === 200, "Saving patient message returned 200 OK");
    assert(msgRes.body.success === true, "Patient message returned success: true");
    assert(msgRes.body.patientMessage.includes("Dinacharya routine"), "Patient message stored correctly");
    console.log("  [PASS] TEST 22: Patient-facing message is saved separately from internal clinical notes.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 23: Voice-to-text transcription endpoint inserts text into designated fields
    // -------------------------------------------------------------
    console.log("🔹 TEST 23: Voice-to-text transcription endpoint inserts text into designated fields");
    const voiceRes = await request("POST", `/api/assessments/${draftId}/transcription`, {
      transcript: "Patient reports restlessness and dry throat in early mornings.",
      destination: "clinicalObservation"
    }, doctorToken);
    assert(voiceRes.status === 200, "Transcription insertion returned 200 OK");
    assert(voiceRes.body.success === true, "Transcription insertion returned success: true");
    assert(voiceRes.body.assessment.observations.freeText.includes("dry throat"), "Transcribed text inserted into freeText");
    console.log("  [PASS] TEST 23: Voice-to-text transcription endpoint inserts text into designated fields.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 24: Empty transcription request is rejected with validation error
    // -------------------------------------------------------------
    console.log("🔹 TEST 24: Empty transcription request is rejected with validation error");
    const emptyVoiceRes = await request("POST", `/api/assessments/${draftId}/transcription`, {
      transcript: "",
      destination: "clinicalObservation"
    }, doctorToken);
    assert(emptyVoiceRes.status === 400, "Empty transcript rejected with 400 Bad Request");
    assert(emptyVoiceRes.body.success === false, "Empty transcript returned success: false");
    console.log("  [PASS] TEST 24: Empty transcription request is rejected with validation error.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 25: Adaptive Dosha threshold logic triggers at 80% & handles boundary cases
    // -------------------------------------------------------------
    console.log("🔹 TEST 25: Adaptive Dosha threshold logic triggers at 80% & handles boundary cases");
    const { getAdaptiveDoshaState } = await import("../services/adaptiveDoshaService.js");

    // Boundary 79.99% -> below threshold
    const sub80 = getAdaptiveDoshaState({ vata: 79.99, pitta: 10.01, kapha: 10.00 }, 80);
    assert(sub80.thresholdReached === false, "79.99% does not trigger 80% threshold");

    // Exact 80.00% -> threshold reached
    const exact80 = getAdaptiveDoshaState({ vata: 80.00, pitta: 10.00, kapha: 10.00 }, 80);
    assert(exact80.thresholdReached === true, "80.00% exactly triggers 80% threshold");
    assert(exact80.dominantDosha === "Vata", "Identified dominant dosha is Vata");
    assert(exact80.indicatorMessage.includes("strongly indicates Vata dominance"), "Indicator message formatted correctly");

    // Boundary 80.01% -> threshold reached
    const supra80 = getAdaptiveDoshaState({ vata: 80.01, pitta: 10.00, kapha: 9.99 }, 80);
    assert(supra80.thresholdReached === true, "80.01% triggers 80% threshold");

    // API endpoint test
    const adaptiveApiRes = await request("GET", `/api/assessments/${draftId}/adaptive`, null, doctorToken);
    assert(adaptiveApiRes.status === 200, "GET /api/assessments/:id/adaptive returns 200 OK");
    assert(adaptiveApiRes.body.threshold === 80, "Default threshold is 80");
    assert(adaptiveApiRes.body.authoritativeQuestionnairePreserved === true, "Authoritative questionnaire preserved");
    console.log("  [PASS] TEST 25: Adaptive Dosha threshold logic triggers at 80% & handles boundary cases.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 26: Doctor finalizes assessment (Transition to FINALIZED)
    // -------------------------------------------------------------
    console.log("🔹 TEST 26: Doctor finalizes assessment (Transition to FINALIZED)");
    // Provide all 24 answers to satisfy mandatory validation
    const fullAnswers = {};
    const fullQuestionsList = db.getCollection("questions");
    fullQuestionsList.forEach((q, idx) => {
      fullAnswers[q.id] = idx % 2 === 0 ? "v" : "p";
    });

    await request("PUT", `/api/assessments/${draftId}`, { answers: fullAnswers }, doctorToken);

    const docFinalizeRes = await request("POST", `/api/doctor/assessments/${draftId}/finalize`, {
      notes: "Officially finalized by Dr. K. Raghavendra Rao.",
      patientMessage: "Continue warm sesame oil abhyanga daily."
    }, doctorToken);

    assert(docFinalizeRes.status === 200, "Doctor finalize returned 200 OK");
    assert(docFinalizeRes.body.success === true, "Finalization returned success: true");
    assert(docFinalizeRes.body.assessment.status === "FINALIZED", "Assessment transitioned to FINALIZED");
    console.log("  [PASS] TEST 26: Doctor finalizes assessment (Transition to FINALIZED).\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 27: Duplicate finalization attempt is rejected with 409 Conflict
    // -------------------------------------------------------------
    console.log("🔹 TEST 27: Duplicate finalization attempt is rejected with 409 Conflict");
    const dupFinalizeRes = await request("POST", `/api/doctor/assessments/${draftId}/finalize`, {
      notes: "Second doctor attempting simultaneous duplicate finalization"
    }, doctorToken);
    assert(dupFinalizeRes.status === 409, "Duplicate finalization returns 409 Conflict");
    assert(dupFinalizeRes.body.success === false, "Duplicate finalization returned success: false");
    assert(dupFinalizeRes.body.errorCode === "ASSESSMENT_ALREADY_FINALIZED", "ErrorCode is ASSESSMENT_ALREADY_FINALIZED");
    console.log("  [PASS] TEST 27: Duplicate finalization attempt is rejected with 409 Conflict.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 28: Finalized assessment is strictly immutable for all users (including Doctor)
    // -------------------------------------------------------------
    console.log("🔹 TEST 28: Finalized assessment is strictly immutable for all users");
    const docEditAttempt = await request("PUT", `/api/assessments/${draftId}`, {
      patientMessage: "Attempting to edit finalized assessment as doctor"
    }, doctorToken);
    assert(docEditAttempt.status === 403, "Doctor edit of finalized assessment rejected with 403 Forbidden");
    assert(docEditAttempt.body.errorCode === "ASSESSMENT_FINALIZED", "ErrorCode is ASSESSMENT_FINALIZED");

    const noteEditAttempt = await request("PUT", `/api/assessments/${draftId}/question-notes/q1_frame`, {
      note: "Editing note after finalization"
    }, doctorToken);
    assert(noteEditAttempt.status === 403, "Question note edit of finalized assessment rejected with 403 Forbidden");
    console.log("  [PASS] TEST 28: Finalized assessment is strictly immutable for all users.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 29: Patient-level report delivery workflow & patient token rejection
    // -------------------------------------------------------------
    console.log("🔹 TEST 29: Patient-level report delivery workflow & patient token rejection");
    // 1. Legacy patient token is rejected across report endpoints
    const patientTokenRep = await request("GET", `/api/reports/${draftId}`, null, legacyPatientToken);
    assert(patientTokenRep.status === 403, "Patient token rejected with 403 Forbidden");
    assert(patientTokenRep.body.errorCode === "PATIENT_ACCESS_DISABLED", "ErrorCode is PATIENT_ACCESS_DISABLED");

    // 2. Fetching patient-facing report pre-delivery is protected
    const undeliveredDraft = await request("POST", "/api/assessments", {
      patientId: "PAT-UDU-KAMATH-001",
      answers: { q1_frame: "v" },
      status: "DRAFT"
    }, doctorToken);
    const undeliveredId = undeliveredDraft.body.assessment.id;

    const preDeliveryRep = await request("GET", `/api/reports/${undeliveredId}?level=patient`);
    assert(preDeliveryRep.status === 403, "Patient report fetch pre-delivery returns 403 Forbidden");
    assert(preDeliveryRep.body.errorCode === "REPORT_NOT_DELIVERED", "ErrorCode is REPORT_NOT_DELIVERED");
    console.log("  [PASS] TEST 29: Patient-level report delivery workflow & patient token rejection.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 30: Doctor delivers report to patient
    // -------------------------------------------------------------
    console.log("🔹 TEST 30: Doctor delivers report to patient");
    const deliverRes = await request("POST", `/api/doctor/assessments/${draftId}/deliver-report`, {}, doctorToken);
    assert(deliverRes.status === 200, "POST /api/doctor/assessments/:id/deliver-report returned 200 OK");
    assert(deliverRes.body.success === true, "Report delivery returned success: true");
    assert(deliverRes.body.assessment.reportDelivered === true, "Assessment marked as reportDelivered: true");
    console.log("  [PASS] TEST 30: Doctor delivers report to patient.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 31: Patient-facing wellness report generated with internal notes redacted
    // -------------------------------------------------------------
    console.log("🔹 TEST 31: Patient-facing wellness report generated with internal notes redacted");
    const postDeliveryRep = await request("GET", `/api/reports/${draftId}?level=patient`, null, doctorToken);
    assert(postDeliveryRep.status === 200, "Patient report fetch post-delivery returns 200 OK");
    assert(postDeliveryRep.body.success === true, "Report returns success: true");
    assert(postDeliveryRep.body.report.reportType === "patient_wellness_report", "Report type is patient_wellness_report");
    assert(postDeliveryRep.body.report.patientMessage !== undefined, "Patient message is present");
    assert(postDeliveryRep.body.report.observations === undefined, "Internal clinical observations are strictly redacted from patient report");
    assert(postDeliveryRep.body.report.ashtavidha === undefined, "Ashtavidha pariksha is redacted from patient report");
    console.log("  [PASS] TEST 31: Patient-facing wellness report generated with internal notes redacted.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 32: Assessment list pagination works with page & limit parameters
    // -------------------------------------------------------------
    console.log("🔹 TEST 32: Assessment list pagination works with page & limit parameters");
    const pageRes = await request("GET", "/api/doctor/assessments?page=1&limit=2", null, doctorToken);
    assert(pageRes.status === 200, "Paginated assessment query returns 200 OK");
    assert(pageRes.body.pagination !== undefined, "Response contains pagination metadata");
    assert(pageRes.body.pagination.page === 1, "Current page is 1");
    assert(pageRes.body.pagination.limit === 2, "Limit is 2");
    assert(pageRes.body.data.length <= 2, "Returned items do not exceed limit");
    console.log("  [PASS] TEST 32: Assessment list pagination works with page & limit parameters.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 33: Deep readiness health check (GET /api/health/ready) reports READY
    // -------------------------------------------------------------
    console.log("🔹 TEST 33: Deep readiness health check (GET /api/health/ready) reports READY");
    const readyRes = await request("GET", "/api/health/ready");
    assert(readyRes.status === 200, "GET /api/health/ready returns 200 OK");
    assert(readyRes.body.ready === true, "Readiness check reports ready: true");
    assert(readyRes.body.status === "READY", "Readiness status is READY");
    assert(readyRes.body.database === "connected", "Database connection verified");
    console.log("  [PASS] TEST 33: Deep readiness health check reports READY.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 34: Standardized error format conforms to requirements
    // -------------------------------------------------------------
    console.log("🔹 TEST 34: Standardized error format conforms to requirements");
    const errorRes = await request("GET", "/api/nonexistent-endpoint-test-404");
    assert(errorRes.status === 404, "404 endpoint returns status 404");
    assert(errorRes.body.success === false, "Error response has success: false");
    assert(errorRes.body.errorCode === "NOT_FOUND", "Error response has errorCode");
    assert(Boolean(errorRes.body.message), "Error response has message");
    assert(Boolean(errorRes.body.requestId), "Error response includes requestId");
    console.log("  [PASS] TEST 34: Standardized error format conforms to requirements.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 35: Request ID middleware attaches X-Request-Id header to HTTP responses
    // -------------------------------------------------------------
    console.log("🔹 TEST 35: Request ID middleware attaches X-Request-Id header to HTTP responses");
    const reqIdRes = await new Promise((resolve) => {
      const req = http.request(`http://localhost:${TEST_PORT}/api/health`, (res) => {
        resolve(res.headers["x-request-id"]);
      });
      req.end();
    });
    assert(Boolean(reqIdRes), "Response includes X-Request-Id header");
    assert(reqIdRes.length >= 8, "Request ID has valid UUID format");
    console.log("  [PASS] TEST 35: Request ID middleware attaches X-Request-Id header.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 36: Audit log records state machine events with actor and request ID
    // -------------------------------------------------------------
    console.log("🔹 TEST 36: Audit log records state machine events with actor and request ID");
    const audits = db.getCollection("audit_logs");
    assert(Array.isArray(audits), "Audit log collection exists");
    assert(audits.length >= 2, "Audit log contains recorded actions");
    const finalizedAudit = audits.find((a) => a.action === "ASSESSMENT_FINALIZED");
    assert(Boolean(finalizedAudit), "Audit log records ASSESSMENT_FINALIZED action");
    assert(Boolean(finalizedAudit.actorId), "Audit log records actorId");
    assert(Boolean(finalizedAudit.timestamp), "Audit log records timestamp");
    console.log("  [PASS] TEST 36: Audit log records state machine events.\n");
    passedTests++;

    // -------------------------------------------------------------
    // TEST 37: Concurrent simultaneous finalization requests handled safely
    // -------------------------------------------------------------
    console.log("🔹 TEST 37: Concurrent simultaneous finalization requests handled safely");
    // Create a new assessment with 24 answers to test concurrency race
    const raceAsm = await request("POST", "/api/assessments", {
      patientId: "PAT-UDU-KAMATH-001",
      answers: fullAnswers,
      status: "SUBMITTED"
    }, doctorToken);
    const raceId = raceAsm.body.assessment.id;

    // Fire 3 simultaneous finalization requests at the exact same instant
    const [final1, final2, final3] = await Promise.all([
      request("POST", `/api/doctor/assessments/${raceId}/finalize`, { notes: "Doctor A" }, doctorToken),
      request("POST", `/api/doctor/assessments/${raceId}/finalize`, { notes: "Doctor B" }, doctorToken),
      request("POST", `/api/doctor/assessments/${raceId}/finalize`, { notes: "Doctor C" }, doctorToken)
    ]);

    const statuses = [final1.status, final2.status, final3.status];
    const successCount = statuses.filter((s) => s === 200).length;
    const conflictCount = statuses.filter((s) => s === 409).length;

    assert(successCount === 1, `Exactly one finalization request succeeds (got ${successCount})`);
    assert(conflictCount === 2, `Conflicting simultaneous requests receive 409 Conflict (got ${conflictCount})`);
    console.log("  [PASS] TEST 37: Concurrent simultaneous finalization requests handled safely (1 OK, 2 Conflict 409).\n");
    passedTests++;

    console.log("===============================================================");
    console.log(`🎉 ALL 37 AUTOMATED TEST CASES PASSED SUCCESSFULLY (${passedTests}/37)!`);
    console.log("===============================================================\n");
  } catch (err) {
    console.error("\n❌ TEST SUITE ABORTED DUE TO FAILURE:", err.message);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    process.exit(process.exitCode || 0);
  }
}

runTests();

