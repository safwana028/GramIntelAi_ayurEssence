# AyurEssence Backend REST API Specification (v2.4 Clinician Pro)
**Institution Partners:** SDM College of Ayurveda, Udupi & SMVITM Bantakal  
**Base URL:** `http://localhost:5000/api`  
**Authentication:** HTTP Header: `Authorization: Bearer <JWT_TOKEN>`  
**Standard Response Tracing Header:** `X-Request-Id: <UUID>`

---

## 1. Global Architectural Conventions

### 1.1 Request ID Tracking
Every incoming request receives a unique UUIDv4 identifier assigned via `X-Request-Id` middleware. If the client supplies an `X-Request-Id` header, it is preserved and mirrored. The ID is included in all structured logs and error responses.

### 1.2 Rate Limiting
Tiered in-memory rate limiting protects server availability:
- **General API:** 100 requests / minute per client
- **Auth Endpoints:** 20 attempts / 15 minutes per IP
- **NLP Analysis:** 30 requests / minute
- **Assessment Submission:** 40 requests / minute

Standard rate limit headers are returned:
- `X-RateLimit-Limit`: Maximum requests allowed in window
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Epoch timestamp when window resets
- HTTP `429 Too Many Requests` returned when exceeded, along with `Retry-After`.

### 1.3 Centralized Error Response Contract
All error responses strictly adhere to the following JSON structure:
```json
{
  "success": false,
  "errorCode": "ASSESSMENT_ALREADY_FINALIZED",
  "message": "This assessment has already been finalized and cannot be re-finalized.",
  "requestId": "8f2a1b94-813c-4bfa-9f88-4235e128cb50"
}
```

---

## 2. Table of API Endpoints

| Category | Method | URL | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/health` | No | Liveness probe and quick stats |
| **Health** | `GET` | `/health/ready` | No | Deep readiness check verifying DB pool connectivity |
| **Auth** | `POST` | `/auth/register` | No | Register new Doctor, Student, or Patient |
| **Auth** | `POST` | `/auth/login` | No | Authenticate and obtain JWT token |
| **Auth** | `GET` | `/auth/me` | Any | Current authenticated user profile |
| **Questionnaire** | `GET` | `/questionnaires` | No | List all active questionnaires (Cached) |
| **Questionnaire** | `GET` | `/questionnaires/standard` | No | Get 24-question classical SDM questionnaire (Cached) |
| **Patients** | `GET` | `/patients` | Doctor / Student | List registered clinical patients |
| **Patients** | `POST` | `/patients` | Doctor / Student | Register a new clinical patient |
| **Assessments** | `GET` | `/assessments` | Doctor / Student | List assessments with pagination (`page`, `limit`) |
| **Assessments** | `POST` | `/assessments` | Doctor / Student | Create new assessment (DRAFT / SUBMITTED). Forbidden to Patients. |
| **Assessments** | `GET` | `/assessments/:id` | Any | Retrieve assessment by ID |
| **Assessments** | `PUT` | `/assessments/:id` | Doctor / Student | Update assessment (Forbidden if `FINALIZED`) |
| **Assessments** | `PUT` | `/assessments/:id/question-notes/:qId` | Doctor / Student | Save per-question clinical observation note |
| **Assessments** | `PUT` | `/assessments/:id/patient-message` | Doctor / Student | Update separate patient-facing message |
| **Assessments** | `POST` | `/assessments/:id/transcription` | Doctor / Student | Insert voice dictation transcript into designated field |
| **Assessments** | `GET` | `/assessments/:id/adaptive` | Any | Query 80% adaptive dosha threshold status |
| **Doctor** | `GET` | `/doctor/assessments` | Doctor | Paginated clinical assessment queue |
| **Doctor** | `POST` | `/doctor/assessments/:id/finalize` | Doctor | Atomic doctor finalization with row-level lock |
| **Doctor** | `POST` | `/doctor/assessments/:id/deliver-report` | Doctor | Officially deliver Swastha report to patient |
| **Reports** | `GET` | `/reports/:id?level=patient\|doctor` | Any | Fetch report. Strict redaction: internal notes removed for patients; requires delivery. |
| **NLP** | `POST` | `/nlp/analyze` | No | Clinical free-text keyword & dosha signal analysis |

---

## 3. Detailed Endpoint Documentation

### 3.1 Health & Readiness

#### `GET /health`
Returns quick service liveness.
```json
{
  "success": true,
  "status": "healthy",
  "service": "AyurEssence API",
  "version": "2.4.0",
  "timestamp": "2026-09-21T10:00:00.000Z"
}
```

#### `GET /health/ready`
Deep readiness check verifying database pool responsiveness.
```json
{
  "success": true,
  "status": "READY",
  "ready": true,
  "service": "AyurEssence API",
  "version": "2.4.0",
  "database": "connected",
  "pool": {
    "total": 10,
    "idle": 8,
    "waiting": 0
  },
  "timestamp": "2026-09-21T10:00:00.000Z"
}
```

---

### 3.2 Authentication

#### `POST /auth/login`
```json
{
  "email": "doctor@sdm.edu",
  "password": "Doctor@123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-SDM-DOC-001",
    "name": "Dr. K. Raghavendra Rao",
    "email": "doctor@sdm.edu",
    "role": "doctor"
  }
}
```

---

### 3.3 Assessments & Clinical Notes

#### `POST /assessments`
Creates a new assessment. **Patients receive HTTP 403 (`PATIENT_ASSESSMENT_FORBIDDEN`).**
```json
{
  "patientId": "PAT-UDU-2026-001",
  "status": "DRAFT",
  "answers": {
    "q1_frame": "v",
    "q2_weight": "p"
  },
  "questionNotes": {
    "q1_frame": "Thin bone structure observed; dry ankles."
  },
  "patientMessage": "Favor warm soups and daily oil massage."
}
```

#### `POST /assessments/:id/transcription`
Inserts voice dictation text directly into designated target field.
```json
{
  "field": "questionNotes.q1_frame",
  "transcript": "Prominent tendon lines on dorsal foot observed."
}
```

#### `GET /assessments/:id/adaptive`
Returns adaptive status based on the configurable 80% dosha threshold.
```json
{
  "success": true,
  "assessmentId": "ASM-2026-001",
  "threshold": 80,
  "triggered": true,
  "dominantDosha": "Vata",
  "dominantPercentage": 82.5,
  "authoritativeQuestionnairePreserved": true,
  "indicator": "Constitutional analysis indicates dominant Vata (82.50%)."
}
```

---

### 3.4 Doctor Finalization & Report Delivery

#### `POST /doctor/assessments/:id/finalize`
Performs atomic finalization. Protected by mutex row locking. Duplicate attempts receive `409 Conflict`.
```json
{
  "notes": "Verified classical Vata-Pitta Prakriti. Sign-off confirmed.",
  "patientMessage": "Continue warm abhyanga daily."
}
```

#### `POST /doctor/assessments/:id/deliver-report`
Marks the assessment as delivered (`reportDelivered: true`). Patients can now view their Swastha Report.

#### `GET /reports/:id?level=patient`
Generates the patient report.
- Returns `403 Forbidden` (`REPORT_NOT_DELIVERED`) if not delivered by doctor.
- Strictly redacts internal clinician observations (`freeText`), Ashtavidha Pariksha, and supervisor notes.
- Includes personalized `patientMessage`.
