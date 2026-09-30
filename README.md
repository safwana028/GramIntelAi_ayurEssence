# AyurEssence: Intelligent Ayurvedic Prakriti Assessment Platform
### Production Clinical System for SDM College of Ayurveda, Udupi & SMVITM Bantakal
**Version:** 2.4 Clinician Pro  
**Architecture:** React 19 + Vite (Frontend) | Node.js + Express 5 (Backend REST API) | PostgreSQL / Embedded ACID (Database)  
**Security & Access:** Strict Role-Based Access Control (Doctor, Student, Patient) + JWT + Centralized Error Handling

---

## 🌿 System Overview
**AyurEssence** is a clinical-grade Ayurvedic constitution (*Prakriti*) assessment and patient management platform designed for real-world healthcare and academic environments. Rooted in classical Ayurvedic treatises (*Charaka Samhita*, *Sushruta Samhita*, and *Ashtanga Hridaya*), it provides:

1. **Standardized 24-Trait Classical Questionnaire**: Covering Physical (*Sharirika*), Physiological (*Kriyatmaka*), and Psychological (*Manasika*) dimensions.
2. **Mathematical Calculation Engine**: Normalizes score distributions ensuring \(\text{Vata} + \text{Pitta} + \text{Kapha} = 100\%\) under all permutations, classifying constitutions into *Eka-Doshaja* (single dominant), *Dwandwaja* (dual-doshic), or *Sama-Doshaja* (tridoshic).
3. **Assessment State Machine**: `DRAFT` $\rightarrow$ `SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `FINALIZED`.
4. **Atomic Concurrency Protection**: Race-condition safe doctor finalization with row-level locks and strict post-finalization immutability (HTTP 403).
5. **Role-Gated Clinical Isolation**:
   - **Doctor (Senior Vaidya)**: Full clinical authority, per-question diagnostic notes, supervisor review queue, voice dictation, atomic sign-off, and explicit report delivery.
   - **Student (BAMS Scholar)**: Supervised intake, draft creation, and clinical notes submission; strictly barred from finalizing reports.
   - **Patient**: Dedicated Swastha Portal; strictly forbidden from taking or modifying clinical assessments; views only verified and officially delivered wellness reports with internal clinical observations redacted.
6. **Dual-Tier Report Architecture**:
   - **Doctor Clinical Dossier**: Comprehensive diagnostic evidence, Ashtavidha Pariksha, per-question observations, radial dosha mapping, and classical Samhita citations.
   - **Patient Swastha Wellness Report**: Empathetic constitutional summary, personalized doctor message, Dinacharya daily schedule, and Ahara dietary guidance.
7. **Clinical Speed Tools**: Progressive Web Speech API voice dictation for instant transcription into per-question clinical notes and patient messages.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy the provided environment template:
```bash
cp .env.example .env
```
Key configuration settings in `.env`:
- `PORT=5000`: Backend REST API port.
- `JWT_SECRET`: Secure cryptographic key for token signing.
- `DATABASE_URL`: Optional PostgreSQL connection pool URI (`postgresql://...`). If unset, automatically utilizes embedded ACID transactional persistence with zero configuration required.
- `ADAPTIVE_DOSHA_THRESHOLD=80`: Configurable percentage threshold for provisional dominant dosha alerts.

### 3. Running Backend REST Server
```bash
npm run server
```
Server runs at `http://localhost:5000`.  
- Deep Readiness Check: `http://localhost:5000/api/health/ready`
- Live Health: `http://localhost:5000/api/health`

### 4. Running Frontend Application
In a separate terminal:
```bash
npm run dev
```
Frontend development server runs at `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🧪 Automated Testing & Load Benchmarks

### 1. Run Complete Test Suite (37 Test Cases)
```bash
npm test
```
Executes all 37 comprehensive test cases:
- 18 core evaluation tests (server, database, auth, calculation engine, 100% dosha invariant, reports).
- 19 enterprise tests (state machine transitions, concurrent atomic finalization, immutability, patient role isolation, report delivery workflow, internal note redaction, pagination, readiness probe, request ID tracking, and audit logging).

### 2. Run Real Multi-Concurrency Load Testing
```bash
npm run loadtest
```
Executes real concurrent HTTP load benchmarks against the live API across 50, 100, and 250 simultaneous client connections measuring RPS, average latency, p95, p99, and connection stability without mock data.

---

## 🔑 Pre-Configured Clinical Accounts

| Role | Name | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Doctor** | Dr. K. Raghavendra Rao | `doctor@sdm.edu` | `Doctor@123` | Full clinical authority, finalization, report delivery, question CRUD |
| **Student** | Pooja Hegde | `student@smvitm.ac.in` | `Student@123` | Draft creation, question notes, patient intake (cannot finalize) |
| **Patient** | Sudhir Kamath | `patient@kamath.org` | `Patient@123` | View delivered Swastha reports and lifestyle guidance (read-only) |

---

## 🏛️ Classical Samhita Methodological Citations
- **Charaka Samhita** (*Vimanasthana*, Ch. 8, Verses 95–100): Definition of bodily constitutions based on dominant maternal and paternal doshas at conception (*Shukra-Shonita Prakriti*).
- **Sushruta Samhita** (*Sharirasthana*, Ch. 4, Verses 62–76): Congenital stability of Janma Prakriti throughout the lifespan.
- **Ashtanga Hridaya** (*Sharirasthana*, Ch. 3, Verses 83–104): Mathematical and physical characterization of *Dwandwaja* bi-constitutional states.

---

## ⚖️ Ethical & Clinical Non-Diagnostic Disclaimer
AyurEssence evaluates congenital physiological constitution (*Prakriti*) for holistic health maintenance, preventive Dinacharya routines, and constitutional equilibrium. In accordance with Ayurvedic clinical ethics and medical device regulations, it does **NOT** diagnose pathological disease states (*Vikriti*) or prescribe scheduled pharmaceutical medicines.
