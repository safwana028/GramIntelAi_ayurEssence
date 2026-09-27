-- ===============================================================
-- AYURESSENCE — ENTERPRISE POSTGRESQL PRODUCTION SCHEMA
-- SDM College of Ayurveda, Udupi & SMVITM Bantakal
-- ===============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('Doctor', 'Student', 'Patient', 'doctor', 'student', 'patient')),
  qualification VARCHAR(255),
  institution VARCHAR(255),
  phone VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(32) NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(255),
  city VARCHAR(255),
  occupation VARCHAR(255),
  diet_type VARCHAR(128),
  primary_complaint TEXT,
  registered_date DATE DEFAULT CURRENT_DATE,
  baseline_prakriti VARCHAR(128) DEFAULT 'Pending Assessment',
  created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- 3. QUESTIONNAIRES TABLE
CREATE TABLE IF NOT EXISTS questionnaires (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  institution VARCHAR(255),
  version VARCHAR(32) DEFAULT '2.4.0',
  item_count INTEGER DEFAULT 24,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. QUESTIONNAIRE QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id VARCHAR(64) PRIMARY KEY,
  questionnaire_id VARCHAR(64) REFERENCES questionnaires(id) ON DELETE CASCADE,
  order_num INTEGER NOT NULL,
  dimension VARCHAR(64) NOT NULL,
  category VARCHAR(64),
  sanskrit_trait VARCHAR(255),
  question_json JSONB NOT NULL,
  context VARCHAR(255),
  options_json JSONB NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_qid ON questionnaire_questions(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_questions_dim ON questionnaire_questions(dimension);

-- 5. ASSESSMENTS TABLE (Core State Machine)
CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
  patient_email VARCHAR(255),
  questionnaire_id VARCHAR(64) REFERENCES questionnaires(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  season VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'FINALIZED')),
  conducted_by_json JSONB NOT NULL,
  supervisor_approved BOOLEAN DEFAULT FALSE,
  supervisor_notes TEXT,
  scores_json JSONB,
  observations_json JSONB,
  question_notes_json JSONB DEFAULT '{}'::jsonb,
  patient_message TEXT DEFAULT '',
  answers_json JSONB NOT NULL,
  finalized_by_json JSONB,
  finalized_at TIMESTAMP WITH TIME ZONE,
  report_delivered BOOLEAN DEFAULT FALSE,
  report_delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(date DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- 6. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(64) PRIMARY KEY,
  assessment_id VARCHAR(64) UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
  patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
  report_type VARCHAR(64) NOT NULL,
  prakriti_json JSONB NOT NULL,
  scores_json JSONB NOT NULL,
  interpretation TEXT,
  patient_message TEXT,
  is_delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_assessment ON reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON reports(patient_id);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  actor_id VARCHAR(64) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(128) NOT NULL,
  assessment_id VARCHAR(64),
  request_id VARCHAR(128),
  metadata_json JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_assessment ON audit_logs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- 8. VOICE TRANSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS voice_transcriptions (
  id VARCHAR(64) PRIMARY KEY,
  assessment_id VARCHAR(64) REFERENCES assessments(id) ON DELETE CASCADE,
  destination VARCHAR(64) NOT NULL,
  question_id VARCHAR(64),
  transcript TEXT NOT NULL,
  recorded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_assessment ON voice_transcriptions(assessment_id);
