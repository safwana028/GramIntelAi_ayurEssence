# GramIntel AI – AyurEssence: 3–5 Minute Judge Demo Script

**Project:** GramIntel AI – AyurEssence  
**Problem Statement:** PS-01 – AyurEssence (SDM College of Ayurveda, Udupi & SMVITM Bantakal)  
**Track:** Backend Core Platform & Prakriti Calculation Engine  

This backend supports **TWO DISTINCT DEMO MODES**:

1. 🧪 **AUTOMATED TEST MODE** (`npm test` or `npm run server:test`)
   - Uses predefined test cases covering all 18 backend evaluation criteria.
   - 100% automated assertions test registration, auth, calculation, storage, and RBAC.
   - Single command: `npm test`

2. 🎮 **INTERACTIVE LIVE DEMO MODE** (`npm run demo`)
   - Fully interactive terminal assessment prompt for live judge evaluation.
   - Asks for candidate name, age, email, role, and questionnaire depth.
   - Serves classical Ayurvedic questions one-by-one, validates choices, and calculates Prakriti dynamically.
   - Single command: `npm run demo`

---

## 🚀 Two Evaluation Modes

### Mode 1: Interactive Live Demonstration
```bash
npm run demo
```
*Prompts the user directly in the terminal, accepts dynamic answers without hardcoding, and passes them through the authentic backend calculation engine & database!*

### Mode 2: Automated Backend Test Suite
```bash
npm test
```
*Executes all 18 automated test suites verifying end-to-end functionality.*

---

## ⏱️ Step-by-Step API / Curl Demonstration Sequence


### Step 1: Start the Backend Server
```bash
npm run server
```
*Output confirms:*
- Server listening on `http://localhost:5000`
- API documentation at `http://localhost:5000/api/docs`
- Health check at `http://localhost:5000/api/health`

---

### Step 2: Show Health & Database Connection
Demonstrate that the backend and JSON database are connected and operational.

**Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "GramIntel AI AyurEssence backend is running",
  "status": "healthy",
  "service": "AyurEssence API",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "usersCount": 3,
    "patientsCount": 3,
    "assessmentsCount": 4,
    "questionsCount": 24
  }
}
```

---

### Step 3 & 4: Register / Login & Obtain JWT Token

#### A. Register a New Student/Patient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ananya Bhat",
    "email": "ananya.bhat@sdm.edu",
    "password": "Password@123",
    "role": "Student",
    "institution": "SDM College of Ayurveda, Udupi"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-STU-948123",
    "name": "Ananya Bhat",
    "email": "ananya.bhat@sdm.edu",
    "role": "Student",
    "institution": "SDM College of Ayurveda, Udupi"
  }
}
```

*(Copy the `token` from the response to use as `$TOKEN` in subsequent requests).*

#### B. Or Login with Pre-Configured Benchmark Credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@sdm.edu",
    "password": "Student@123"
  }'
```

---

### Step 5: Fetch Classical Questionnaire
Retrieve the standardized 24-trait Ayurvedic questionnaire with scoring categories and dosha weights.

**Request:**
```bash
curl -X GET http://localhost:5000/api/questionnaires/standard
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "id": "sdm-udupi-standard-24",
      "title": "SDM Udupi Standard Comprehensive Prakriti Questionnaire",
      "itemCount": 24
    },
    "totalQuestions": 24,
    "questions": [
      {
        "id": "q1_frame",
        "questionText": "Body Frame and Skeletal Structure",
        "category": "Physical",
        "options": [
          { "id": "v", "dosha": "vata", "weight": 1.0, "text": "Thin, slender, prominent joints" },
          { "id": "p", "dosha": "pitta", "weight": 1.0, "text": "Medium, well-proportioned" },
          { "id": "k", "dosha": "kapha", "weight": 1.0, "text": "Broad, heavy, well-knit joints" }
        ]
      }
    ]
  }
}
```

---

### Step 6, 7 & 8: Submit Assessment, Prakriti Calculation & Database Storage

Submit answers with practitioner clinical notes. The backend calculates Prakriti and normalizes Vata, Pitta, and Kapha so that **Vata + Pitta + Kapha = 100% exactly**.

**Request:**
```bash
curl -X POST http://localhost:5000/api/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{
    "questionnaireId": "sdm-udupi-standard-24",
    "answers": {
      "q1_frame": "v",
      "q2_weight": "v",
      "q3_skin": "v",
      "q4_hair": "v",
      "q5_eyes": "p",
      "q6_teeth": "p",
      "q7_agni": "v",
      "q8_koshta": "v",
      "q9_thirst": "p",
      "q10_perspiration": "p",
      "q11_pulse": "v",
      "q12_nidra": "v"
    },
    "observations": {
      "freeText": "Patient reports dry skin, irregular appetite, and light restless sleep during windy coastal weather."
    }
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Assessment submitted successfully.",
  "assessment": {
    "id": "ASM-974603",
    "status": "SUBMITTED",
    "prakriti": {
      "vata": 67,
      "pitta": 33,
      "kapha": 0,
      "dominant": "Vata"
    },
    "scores": {
      "vata": 67,
      "pitta": 33,
      "kapha": 0,
      "dominant": "Vata",
      "dominantPrakriti": "Vata Dominant",
      "constitutionType": "Eka-Doshaja (Monodoshic)",
      "totalPoints": 14.4
    }
  }
}
```
*Notice: $67 + 33 + 0 = 100\%$. The calculation is dynamic and deterministic!*

---

### Step 9: Fetch Generated Constitutional Report

**Request:**
```bash
curl -X GET http://localhost:5000/api/reports/ASM-974603
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "assessmentId": "ASM-974603",
    "status": "SUBMITTED",
    "prakriti": {
      "vata": 67,
      "pitta": 33,
      "kapha": 0,
      "dominant": "Vata"
    },
    "basicInterpretation": "Your constitution shows predominant Vata doshic influence (Vata: 67%, Pitta: 33%, Kapha: 0%). Vata types benefit from grounding routines, warming foods, adequate rest, and hydration.",
    "ethicalDisclaimer": "This report evaluates constitutional Prakriti for wellness guidance. It does not diagnose diseases or prescribe medicines."
  }
}
```

---

### Step 10 & 11: Login as Doctor & View Submitted Assessments

**Login as Doctor:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@sdm.edu",
    "password": "Doctor@123"
  }'
```
*(Copy `<DOCTOR_TOKEN>` from response)*

**Doctor View Assessment Queue:**
```bash
curl -X GET http://localhost:5000/api/doctor/assessments \
  -H "Authorization: Bearer <DOCTOR_TOKEN>"
```

---

### Step 12 & 13: Doctor Finalizes Assessment (SUBMITTED $\rightarrow$ FINALIZED)

**Request:**
```bash
curl -X POST http://localhost:5000/api/doctor/assessments/ASM-974603/finalize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -d '{
    "notes": "Reviewed and validated constitutional baseline by Dr. Rao, BAMS, MD."
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Assessment approved and finalized by Supervising Doctor.",
  "assessment": {
    "id": "ASM-974603",
    "status": "FINALIZED",
    "supervisorApproved": true,
    "supervisorNotes": "Reviewed and validated constitutional baseline by Dr. Rao, BAMS, MD."
  }
}
```

**Protection Check:** Normal user attempting to modify finalized assessment:
```bash
curl -X PUT http://localhost:5000/api/assessments/ASM-974603 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{ "answers": { "q1": "p" } }'
```
*Returns `403 Forbidden`: `"Finalized assessment cannot be modified by normal user."`*

---

### Step 14: Run All 18 Automated Test Cases
Show judges the comprehensive test suite with 100% automated assertions:
```bash
npm run server:test
```

**Output:**
```
===============================================================
🌿 AYURESSENCE BACKEND TEST RUNNER — 18 CORE EVALUATION TESTS
===============================================================
  [PASS] TEST 1: Server starts successfully.
  [PASS] TEST 2: Database connection works.
  [PASS] TEST 3: User registration works.
  [PASS] TEST 4: Duplicate registration is rejected.
  [PASS] TEST 5: Login works.
  [PASS] TEST 6: Invalid login is rejected.
  [PASS] TEST 7: JWT protected endpoint rejects unauthenticated request.
  [PASS] TEST 8: Questionnaire can be fetched.
  [PASS] TEST 9: Assessment can be submitted.
  [PASS] TEST 10: Prakriti calculation works.
  [PASS] TEST 11: Vata + Pitta + Kapha = 100% in all scenarios.
  [PASS] TEST 12: Dominant Prakriti is calculated dynamically.
  [PASS] TEST 13: Assessment is stored and retrievable.
  [PASS] TEST 14: Report can be fetched.
  [PASS] TEST 15: Doctor can view assessment.
  [PASS] TEST 16: Doctor can finalize assessment (status -> FINALIZED).
  [PASS] TEST 17: Finalized assessment cannot be modified by normal user.
  [PASS] TEST 18: NLP endpoint returns a structured response.
===============================================================
🎉 ALL 18 AUTOMATED TEST CASES PASSED SUCCESSFULLY (18/18)!
===============================================================
```
