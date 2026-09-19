# AyurEssence: Intelligent Ayurvedic Prakriti Assessment Platform
### Hackathon Premier League (HPL 2026) — PS 01 Track Challenge
**Organizers:** Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal in association with Code Troopers  
**Official Problem Sponsor:** SDM College of Ayurveda & Hospital, Udupi (SDMCA)  
**Deliverable Status:** Evaluation 1 — Full Backend Track Implementation

---

## 🌿 Overview
**AyurEssence Backend** is a production-grade, clinician-centric Node.js/Express RESTful backend engineered for systematic Ayurvedic constitution (*Prakriti*) assessment. Rooted in classical treatises (*Charaka Samhita*, *Sushruta Samhita*, and *Ashtanga Hridaya*), it owns the data schemas, business logic, role-based access control (RBAC), and REST APIs that power the platform.

---

## 🚀 Quick Start (Running the Backend)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend API Server
```bash
npm run server
```
Server runs at: **`http://localhost:5000`**  
API Documentation: **`http://localhost:5000/api/docs`**  
Health Check: **`http://localhost:5000/api/health`**

### 3. Run Interactive Live Demonstration Mode
```bash
npm run demo
```
Prompts the evaluator interactively for candidate details, serves classical Ayurvedic questionnaire traits one by one, validates inputs, executes genuine backend scoring & database saving, and prints the constitutional report!

### 4. Run Automated Backend Test Suite
```bash
npm test
```
Runs the automated test suite verifying all 18 evaluation criteria with 100% assertions passing!


---

## 🔑 Pre-Configured Benchmark Credentials

| User Type | Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Doctor** | `doctor@sdm.edu` | `Doctor@123` | Full clinical access, question CRUD, report finalization & student sign-off |
| **Student** | `student@sdm.edu` | `Student@123` | Draft assessments, observation notes, cannot finalize reports |
| **Patient** | `patient@kamath.org` | `Patient@123` | **Mr. Ganesh Kamath** — views own profile & simplified constitutional summary |

---

## 📦 Evaluation 1 Deliverables & Architecture

### 1. Core Data Models & JWT Auth
- **User Models**: Distinct schemas for `Doctor`, `Student`, and `Patient` with bcrypt-hashed passwords.
- **RBAC Middleware**: Strict role authorization (`requireRole(["doctor"])`).
  - *Example*: A student can fill in a new session (`POST /api/assessments`), but only a doctor can finalize the report (`PUT /api/assessments/:id/finalize`).
- **Auth Endpoints**:
  - `POST /api/auth/register` — Register doctor, student, or patient.
  - `POST /api/auth/login` — Login and receive signed JWT bearer token.
  - `GET /api/auth/me` — Authenticated profile.
  - `GET /api/auth/roles` — RBAC permission matrix.

### 2. Patient Profile & Longitudinal History
- **Patient Profile Schema**: Demographics, contact info, Ahara (diet), and linked assessments.
  - *Example*: Mr. Kamath's age (45), phone number, city, and 3 linked past assessments all saved in one profile (`PAT-UDU-KAMATH-001`).
- **Patient History Endpoint (`GET /api/patients/:id/history`)**:
  - Chronological timeline of past visits with Vata/Pitta/Kapha trend data and constitutional stability index.

### 3. Questionnaire Engine & Question CRUD
- **Baseline Questionnaire (`GET /api/questionnaires/standard`)**:
  - Serves standardized 24-trait classical questions across Physical, Physiological, and Psychological dimensions.
- **CRUD APIs (`/api/questionnaires/questions`)**:
  - `POST`, `PUT`, `DELETE` APIs enabling doctors to add or edit custom questions dynamically without changing any code.

### 4. Practitioner Observation & NLP Hook
- **Clinical Observation Storage (`POST /api/observations`)**:
  - Free-form clinical notes and Ashtavidha Pariksha findings linked to assessments.
- **NLP Signal Extraction Hook (`POST /api/nlp/extract`)**:
  - Natural Language Processing engine that scans free-form clinical notes (e.g. *"patient reports poor sleep and dry skin"*) and flags classical Dosha indicators (*Alpa Nidra*, *Ruksha Twak* $\rightarrow$ Vata signals).

### 5. Classical Prakriti Calculation Service
- **Callable Calculation API (`POST /api/prakriti/calculate`)**:
  - Callable REST endpoint calculating normalized Vata/Pitta/Kapha percentages and dominant Dosha.
- **Classical Methodology (`GET /api/prakriti/methodology`)**:
  - Textual citations from *Charaka Samhita* (Vimana 8), *Sushruta Samhita* (Sharira 4), and *Ashtanga Hridaya* (Sharira 3).
  - Decision rules for *Eka-Doshaja* (single dominant), *Dwandwaja* (dual-doshic, ~85% of population), and *Sama-Doshaja* (balanced tridoshic).

### 6. Assessment & Dual Report APIs
- **Report Generator (`GET /api/assessments/:id/report?level=doctor|patient`)**:
  - `?level=doctor`: Full clinical dossier with demographics, context, raw points, Ashtavidha Pariksha, and Samhita citations.
  - `?level=patient`: Simplified summary ("You are naturally a Vata-Pitta type") without clinical wording, including Dinacharya daily wellness guidance.
- **Ethical Non-Diagnostic Boundary**:
  - Explicit disclaimers across all outputs: evaluates natural constitution (*Prakriti*); does **NOT** diagnose diseases (*Vikriti*) or prescribe pharmaceutical medicines.
