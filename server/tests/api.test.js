/**
 * Automated Test Runner for AyurEssence Backend
 * Verifies all 18 Phase 13 Evaluation Requirements
 */

process.env.NODE_ENV = "test";

import http from "http";
import app from "../index.js";
import { db } from "../data/database.js";

const TEST_PORT = 5055;
let server;
let testUserToken = "";
let doctorToken = "";
let studentToken = "";
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
    // TEST 18: NLP endpoint returns a structured response
    // -------------------------------------------------------------
    console.log("🔹 TEST 18: NLP endpoint returns a structured response");
    const nlpRes = await request("POST", "/api/nlp/analyze", {
      text: "Patient presents with dry skin, cold extremities, insomnia, and irregular appetite."
    });
    assert(nlpRes.status === 200, "POST /api/nlp/analyze returns 200 OK");
    assert(nlpRes.body.success === true, "NLP analysis returns success: true");
    assert(Array.isArray(nlpRes.body.signals), "NLP output contains signals array");
    assert(nlpRes.body.signals.length >= 2, "NLP extracted at least 2 clinical keyword signals");
    assert(Boolean(nlpRes.body.summary), "NLP output contains dosha summary distribution");
    assert(Boolean(nlpRes.body.dominantSignal), "NLP output identifies dominant dosha signal");
    console.log("  [PASS] TEST 18: NLP endpoint returns a structured response.\n");
    passedTests++;

    console.log("===============================================================");
    console.log(`🎉 ALL 18 AUTOMATED TEST CASES PASSED SUCCESSFULLY (${passedTests}/18)!`);
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
