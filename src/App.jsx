import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { PatientList } from "./components/patient/PatientList";
import { PatientModal } from "./components/patient/PatientModal";
import { PatientHistoryView } from "./components/patient/PatientHistoryView";
import { AssessmentWorkflow } from "./components/assessment/AssessmentWorkflow";
import { QuestionnaireManager } from "./components/questionnaire-builder/QuestionnaireManager";
import { MethodologyModal } from "./components/modals/MethodologyModal";
import { DoctorReport } from "./components/report/DoctorReport";
import { PatientReport } from "./components/report/PatientReport";
import { AnatomicalBodyScanner } from "./components/scanner/AnatomicalBodyScanner";
import {
  getStoredPatients, savePatients,
  getStoredQuestionnaires, saveQuestionnaires,
  getStoredRole, saveStoredRole,
  getStoredLanguage, saveStoredLanguage,
  resetToDefaults
} from "./services/storageService";
import { ArrowLeft, Sparkles, UserCheck, Layers, History, BookOpen } from "lucide-react";

export function App() {
  const [patients, setPatients] = useState(getStoredPatients);
  const [questionnaires, setQuestionnaires] = useState(getStoredQuestionnaires);
  const [activeRole, setActiveRole] = useState(getStoredRole);
  const [activeLang, setActiveLang] = useState(getStoredLanguage);
  const [activeTab, setActiveTab] = useState("patients");

  // Selected contexts
  const [activePatientForAssessment, setActivePatientForAssessment] = useState(null);
  const [activePatientForHistory, setActivePatientForHistory] = useState(null);
  const [activeDossierView, setActiveDossierView] = useState(null); // { patient, assessment }

  // Modals
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Persistence side effects
  const handleRoleChange = (role) => {
    setActiveRole(role);
    saveStoredRole(role);
  };

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    saveStoredLanguage(lang);
  };

  const handleSavePatients = (updatedList) => {
    setPatients(updatedList);
    savePatients(updatedList);
  };

  const handleSaveQuestionnaires = (updatedList) => {
    setQuestionnaires(updatedList);
    saveQuestionnaires(updatedList);
  };

  // Add / edit patient
  const handleSavePatientModal = (patient) => {
    const exists = patients.some((p) => p.id === patient.id);
    let updated;
    if (exists) {
      updated = patients.map((p) => (p.id === patient.id ? patient : p));
    } else {
      updated = [patient, ...patients];
    }
    handleSavePatients(updated);
  };

  // Start assessment from patient card
  const handleStartAssessmentForPatient = (patient) => {
    setActivePatientForAssessment(patient);
    setActiveDossierView(null);
    setActiveTab("assessment");
  };

  // View history
  const handleViewPatientHistory = (patient) => {
    setActivePatientForHistory(patient);
    setActiveTab("history");
  };

  // Quick view dossier
  const handleQuickViewReport = (patient, assessment) => {
    setActiveDossierView({ patient, assessment });
  };

  // Save assessment session
  const handleSaveAssessment = (patientId, newAssessment) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const existingAssessments = pat.assessments || [];
        return {
          ...pat,
          baselinePrakriti: newAssessment.scores.dominantPrakriti,
          assessments: [...existingAssessments, newAssessment]
        };
      }
      return pat;
    });
    handleSavePatients(updated);
  };

  // Supervising doctor sign-off action
  const handleSupervisorApprove = (patientId, assessmentId) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const updatedAssessments = (pat.assessments || []).map((asm) => {
          if (asm.id === assessmentId) {
            return {
              ...asm,
              supervisorApproved: true,
              supervisorNotes: "Official clinical verification confirmed by Supervising Vaidya."
            };
          }
          return asm;
        });
        return { ...pat, assessments: updatedAssessments };
      }
      return pat;
    });
    handleSavePatients(updated);

    // Update active history view if open
    if (activePatientForHistory && activePatientForHistory.id === patientId) {
      const updatedPat = updated.find((p) => p.id === patientId);
      setActivePatientForHistory(updatedPat);
    }
  };

  // Save scanned herbal recommendations to patient record
  const handleSaveScannerRecommendation = (patientId, zoneName, vulnerabilityData) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const existingNotes = pat.scannedHerbalProtocols || [];
        return {
          ...pat,
          scannedHerbalProtocols: [
            ...existingNotes,
            {
              zone: zoneName,
              date: new Date().toISOString().slice(0, 10),
              riskLevel: vulnerabilityData.riskLevel,
              herbs: vulnerabilityData.herbalBalancers.map(h => h.name).join(", "),
              dietary: vulnerabilityData.dietaryLifestyle
            }
          ]
        };
      }
      return pat;
    });
    handleSavePatients(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      {/* Clinician & Institutional Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        activeLang={activeLang}
        onLangChange={handleLangChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveDossierView(null);
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Quick View Dossier Overlay (if viewing saved report) */}
        {activeDossierView ? (
          <div className="space-y-4">
            <div className="no-print flex items-center justify-between bg-white p-3 rounded-2xl border border-stone-200">
              <button
                onClick={() => setActiveDossierView(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Patient Directory</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow transition-colors"
              >
                Print / Save PDF
              </button>
            </div>

            {activeRole === "patient" ? (
              <PatientReport
                patient={activeDossierView.patient}
                scores={activeDossierView.assessment.scores}
                activeLang={activeLang}
              />
            ) : (
              <DoctorReport
                patient={activeDossierView.patient}
                assessment={activeDossierView.assessment}
                activeRole={activeRole}
              />
            )}
          </div>
        ) : (
          <>
            {/* TAB 1: PATIENTS DIRECTORY */}
            {activeTab === "patients" && (
              <PatientList
                patients={patients}
                activeRole={activeRole}
                activeLang={activeLang}
                onSelectPatientForAssessment={handleStartAssessmentForPatient}
                onViewPatientHistory={handleViewPatientHistory}
                onOpenNewPatientModal={() => setIsPatientModalOpen(true)}
                onQuickViewReport={handleQuickViewReport}
              />
            )}

            {/* TAB 2: START ASSESSMENT WORKFLOW */}
            {activeTab === "assessment" && (
              <AssessmentWorkflow
                patient={activePatientForAssessment || patients[0]}
                allPatients={patients}
                activeRole={activeRole}
                activeLang={activeLang}
                onCancel={() => setActiveTab("patients")}
                onSaveAssessment={handleSaveAssessment}
              />
            )}

            {/* TAB 3: LONGITUDINAL HISTORY & TRENDS */}
            {activeTab === "history" && (
              <PatientHistoryView
                patient={activePatientForHistory || patients[0]}
                activeRole={activeRole}
                onBack={() => setActiveTab("patients")}
                onViewReport={handleQuickViewReport}
                onSupervisorApprove={handleSupervisorApprove}
              />
            )}

            {/* TAB 4: AI ANATOMICAL BODY SCANNER */}
            {activeTab === "scanner" && (
              <AnatomicalBodyScanner
                patient={activePatientForAssessment || patients[0]}
                allPatients={patients}
                onSelectPatient={(p) => setActivePatientForAssessment(p)}
                onSaveToPatient={handleSaveScannerRecommendation}
              />
            )}

            {/* TAB 5: CUSTOM QUESTIONNAIRE BUILDER */}
            {activeTab === "builder" && (
              <QuestionnaireManager
                questionnaires={questionnaires}
                onSaveQuestionnaires={handleSaveQuestionnaires}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: New Patient */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatientModal}
      />

      {/* Modal: Classical Ayurvedic Methodology & References */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Institutional Footer */}
      <Footer onResetData={() => setPatients(getStoredPatients())} />
    </div>
  );
}

export default App;
