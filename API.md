# AyurEssence Backend REST API Specification
**Institution Partners:** SDM College of Ayurveda, Udupi & SMVITM Bantakal  
**Base URL:** `http://localhost:5000/api`  
**Authentication:** Standard HTTP Header: `Authorization: Bearer <JWT_TOKEN>`

---

## Table of Endpoints

| Category | Method | URL | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | No | System health, database connection, and statistics |
| **Auth** | `POST` | `/auth/register` | No | Register new Student, Doctor, or Patient |
| **Auth** | `POST` | `/auth/login` | No | Login with email and password |
| **Auth** | `GET` | `/auth/me` | Yes (Any) | Current user profile and active role |
| **Questionnaire** | `GET` | `/questionnaires` | No | List all questionnaires with full questions and categories |
| **Questionnaire** | `GET` | `/questionnaires/:id` | No | Get questionnaire by ID (or 'standard') |
| **Questionnaire** | `POST` | `/questionnaires` | No / Doctor | Create a new questionnaire bundle |
| **Assessments** | `POST` | `/assessments` | Yes (Any) | Submit new Prakriti assessment session |
| **Assessments** | `GET` | `/assessments/:id` | Yes (Any) | Retrieve assessment by ID |
| **Assessments** | `GET` | `/assessments/my` | Yes (Any) | Get logged-in user's submitted assessments |
| **Assessments** | `PUT` | `/assessments/:id` | Yes (Any) | Update assessment (rejected if status is FINALIZED) |
| **Prakriti** | `POST` | `/prakriti/calculate` | No | Dynamic calculation engine (guarantees V+P+K = 100%) |
| **Reports** | `GET` | `/reports/:assessmentId` | No | Generate structured constitutional report |
| **Doctor** | `GET` | `/doctor/assessments` | Yes (Doctor) | Doctor review queue of assessments |
| **Doctor** | `GET` | `/doctor/assessments/:id` | Yes (Doctor) | Doctor view specific assessment record |
| **Doctor** | `POST` | `/doctor/assessments/:id/finalize` | Yes (Doctor) | Approve & finalize assessment (SUBMITTED $\rightarrow$ FINALIZED) |
| **NLP** | `POST` | `/nlp/analyze` | No | Free-form clinical text keyword & dosha signal analysis |

---

## 1. System Health
### `GET /health`
- **Auth Required:** No
- **Request Body:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "GramIntel AI AyurEssence backend is running",
  "status": "healthy",
  "service": "AyurEssence API",
  "version": "1.0.0",
  "timestamp": "2026-09-18T16:30:00.000Z",
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

## 2. Authentication

### `POST /auth/register`
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "Dr. Rashmi Nayak",
  "email": "rashmi.nayak@sdm.edu",
  "password": "Password@123",
  "role": "Doctor",
  "qualification": "BAMS, MD",
  "institution": "SDM College of Ayurveda, Udupi"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Doctor registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-DOC-948201",
    "name": "Dr. Rashmi Nayak",
    "email": "rashmi.nayak@sdm.edu",
    "role": "Doctor",
    "institution": "SDM College of Ayurveda, Udupi",
    "qualification": "BAMS, MD"
  }
}
```
- **Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with email 'rashmi.nayak@sdm.edu' is already registered.",
  "error": "User with email 'rashmi.nayak@sdm.edu' is already registered."
}
```

### `POST /auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "doctor@sdm.edu",
  "password": "Doctor@123"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-DOC-001",
    "name": "Dr. K. Raghavendra Rao",
    "email": "doctor@sdm.edu",
    "role": "Doctor",
    "institution": "SDM College of Ayurveda & Hospital, Udupi"
  }
}
```
- **Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password.",
  "error": "Invalid email or password."
}
```

### `GET /auth/me`
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "USR-DOC-001",
    "name": "Dr. K. Raghavendra Rao",
    "email": "doctor@sdm.edu",
    "role": "Doctor"
  }
}
```

---

## 3. Questionnaires

### `GET /questionnaires`
- **Auth Required:** No
- **Success Response (200 OK):** Returns array of questionnaires, each populated with questions, categories, and options.

### `GET /questionnaires/standard`
- **Auth Required:** No
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "id": "sdm-udupi-standard-24",
      "title": "SDM Udupi Standard Comprehensive Prakriti Questionnaire",
      "itemCount": 24
    },
    "questions": [
      {
        "id": "q1_frame",
        "questionText": "Body Frame and Skeletal Structure",
        "category": "Physical",
        "dimension": "Physical",
        "options": [
          { "id": "v", "dosha": "vata", "weight": 1.0, "score": 1.0, "text": "Thin, slender, prominent joints" },
          { "id": "p", "dosha": "pitta", "weight": 1.0, "score": 1.0, "text": "Medium, well-proportioned" },
          { "id": "k", "dosha": "kapha", "weight": 1.0, "score": 1.0, "text": "Broad, heavy, well-knit joints" }
        ]
      }
    ]
  }
}
```

---

## 4. Assessment Submission & Retrieval

### `POST /assessments`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "questionnaireId": "sdm-udupi-standard-24",
  "answers": {
    "q1_frame": "v",
    "q2_weight": "v",
    "q3_skin": "v",
    "q7_agni": "p",
    "q12_nidra": "v"
  },
  "observations": {
    "freeText": "Patient complains of dry skin and poor sleep."
  }
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Assessment submitted successfully.",
  "assessment": {
    "id": "ASM-974603",
    "userId": "USR-STU-948123",
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
      "constitutionType": "Eka-Doshaja (Monodoshic)"
    },
    "createdAt": "2026-09-18T16:35:00.000Z",
    "updatedAt": "2026-09-18T16:35:00.000Z"
  }
}
```

### `GET /assessments/:id`
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (200 OK):** Returns full assessment object.

### `GET /assessments/my`
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (200 OK):** Returns array of all assessments submitted by or linked to the authenticated user.

### `PUT /assessments/:id`
- **Auth Required:** Yes (`Bearer <token>`)
- **Error Response (403 Forbidden - when trying to modify finalized assessment):**
```json
{
  "success": false,
  "message": "Finalized assessment cannot be modified by normal user.",
  "error": "Finalized assessment cannot be modified by normal user."
}
```

---

## 5. Classical Prakriti Calculation Engine

### `POST /prakriti/calculate`
- **Auth Required:** No
- **Request Body:**
```json
{
  "answers": {
    "q1": "v",
    "q2": "p",
    "q3": "k",
    "q4": "v"
  }
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vata": 50,
    "pitta": 25,
    "kapha": 25,
    "dominant": "Vata",
    "dominantPrakriti": "Vata Dominant",
    "constitutionType": "Eka-Doshaja (Monodoshic)",
    "rationale": "Vata represents 50% of constitutional indicators, exceeding Pitta (25%) by 25%. Conforms to classical single-dosha predominance (Charaka Vimana 8:95).",
    "methodologyReferences": [
      "Charaka Samhita Vimanasthana 8:95-100",
      "Sushruta Samhita Sharirasthana 4:62-76",
      "Ashtanga Hridaya Sharirasthana 3:83-104"
    ]
  }
}
```
*Guaranteed invariant: `vata + pitta + kapha === 100`.*

---

## 6. Report Generation

### `GET /reports/:assessmentId`
- **Auth Required:** No
- **Success Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "assessmentId": "ASM-974603",
    "assessmentDate": "2026-09-18",
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

## 7. Doctor Review Workflow

### `GET /doctor/assessments`
- **Auth Required:** Yes (`Doctor` role)
- **Success Response (200 OK):** Returns list of all submitted and finalized assessments.

### `GET /doctor/assessments/:id`
- **Auth Required:** Yes (`Doctor` role)
- **Success Response (200 OK):** Returns detailed assessment and patient clinical dossier.

### `POST /doctor/assessments/:id/finalize`
- **Auth Required:** Yes (`Doctor` role)
- **Request Body:**
```json
{
  "notes": "Verified and signed off by Supervising Vaidya."
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Assessment approved and finalized by Supervising Doctor.",
  "assessment": {
    "id": "ASM-974603",
    "status": "FINALIZED",
    "supervisorApproved": true,
    "supervisorNotes": "Verified and signed off by Supervising Vaidya."
  }
}
```

---

## 8. NLP Clinical Notes Analysis

### `POST /nlp/analyze`
- **Auth Required:** No
- **Request Body:**
```json
{
  "text": "Patient has dry skin, light sleep, and irregular digestion."
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "NLP analysis completed successfully.",
  "text": "Patient has dry skin, light sleep, and irregular digestion.",
  "dominantSignal": "Vata",
  "summary": {
    "vata": 2,
    "pitta": 0,
    "kapha": 0,
    "totalSignals": 2
  },
  "signals": [
    {
      "matchedPhrase": "dry skin",
      "dosha": "vata",
      "guna": "Ruksha (Dry) & Khara (Rough)",
      "weight": 1.0,
      "confidence": 0.91
    },
    {
      "matchedPhrase": "light sleep",
      "dosha": "vata",
      "guna": "Alpa Nidra (Light/Disturbed Sleep)",
      "weight": 1.1,
      "confidence": 0.88
    }
  ]
}
```
