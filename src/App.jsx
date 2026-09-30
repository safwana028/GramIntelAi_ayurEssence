import React, { useState, useEffect } from "react";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./components/landing/LandingPage";
import { DoctorDashboard } from "./components/dashboard/DoctorDashboard";
import { StudentDashboard } from "./components/dashboard/StudentDashboard";
import { ReviewQueue } from "./components/review/ReviewQueue";
import { ReportsView } from "./components/reports/ReportsView";
import { ProfileView } from "./components/profile/ProfileView";
import { SettingsView } from "./components/settings/SettingsView";
import { PatientList } from "./components/patient/PatientList";
import { PatientModal } from "./components/patient/PatientModal";
import { PatientHistoryView } from "./components/patient/PatientHistoryView";
import { AssessmentWorkflow } from "./components/assessment/AssessmentWorkflow";
import { QuestionnaireManager } from "./components/questionnaire-builder/QuestionnaireManager";
import { MethodologyModal } from "./components/modals/MethodologyModal";
import { AuthModal } from "./components/modals/AuthModal";
import { DoctorReport } from "./components/report/DoctorReport";
import { PatientReport } from "./components/report/PatientReport";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";
import {
  getStoredPatients,
  savePatients,
  getStoredQuestionnaires,
  saveQuestionnaires,
  getStoredRole,
  saveStoredRole,
  getStoredLanguage,
  saveStoredLanguage,
  exportFullDataBackup
} from "./services/storageService";
import {
  api,
  getStoredUser,
  saveStoredUser,
  CLINICAL_ACCOUNTS
} from "./services/apiService";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  FileText,
  CheckCircle2,
  Printer,
  Send
} from "lucide-react";

export function App() {
  const [patients, setPatients] = useState(getStoredPatients);
  const [questionnaires, setQuestionnaires] = useState(getStoredQuestionnaires);
  const [currentUser, setCurrentUser] = useState(() => {
    const u = getStoredUser();
    return u?.role === "patient" ? null : u;
  });
  const [activeRole, setActiveRole] = useState(() => {
    const r = getStoredRole();
    return r === "patient" ? "doctor" : (r || "doctor");
  });
  const [activeLang, setActiveLang] = useState(getStoredLanguage);

  // Initial tab: Defaults to public landing page so anyone visiting tridoshalab.com sees the homepage
  const [activeTab, setActiveTab] = useState("landing");

  // Selected contexts
  const [activePatientForAssessment, setActivePatientForAssessment] = useState(null);
  const [activePatientForHistory, setActivePatientForHistory] = useState(null);
  const [activeDossierView, setActiveDossierView] = useState(null); // { patient, assessment }
  const [editingAssessment, setEditingAssessment] = useState(null);

  // Modals & Server connectivity
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);

  // Background sync with Backend REST API
  useEffect(() => {
    async function syncBackend() {
      try {
        const health = await api.checkHealth();
        if (health.ok) {
          setServerOnline(true);
          const patRes = await api.getPatients();
          if (patRes.ok && Array.isArray(patRes.data?.data || patRes.data?.patients)) {
            const serverPatients = patRes.data.data || patRes.data.patients;
            if (serverPatients.length > 0) {
              setPatients(serverPatients);
              savePatients(serverPatients);
            }
          }
        }
      } catch (err) {
        console.info("Running in resilient standalone mode:", err.message);
      }
    }
    syncBackend();
  }, []);

  // Calculate pending supervisor reviews count for badge
  const pendingReviewCount = patients
    .flatMap((p) => p.assessments || [])
    .filter((a) => !a.supervisorApproved).length;

  // Persistence side effects
  const handleRoleChange = (role) => {
    const validRole = role === "student" ? "student" : "doctor";
    setActiveRole(validRole);
    saveStoredRole(validRole);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveStoredUser(user);
    if (user.role) {
      handleRoleChange(user.role);
    }
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
  const handleSavePatientModal = async (patient) => {
    const exists = patients.some((p) => p.id === patient.id);
    let updated;
    if (exists) {
      updated = patients.map((p) => (p.id === patient.id ? patient : p));
    } else {
      updated = [patient, ...patients];
    }
    handleSavePatients(updated);

    try {
      await api.createPatient(patient);
    } catch (err) {
      console.warn("Backend patient sync notice:", err.message);
    }
  };

  // Start assessment from patient card (Doctor or Student only)
  const handleStartAssessmentForPatient = (patient, existingAssessment = null) => {
    if (activeRole === "patient") {
      alert("Patients are not permitted to access assessment workflows.");
      return;
    }
    setActivePatientForAssessment(patient);
    setEditingAssessment(existingAssessment);
    setActiveDossierView(null);
    setActiveTab("assessment");
  };

  // View history
  const handleViewPatientHistory = (patient) => {
    setActivePatientForHistory(patient);
    setActiveDossierView(null);
    setActiveTab("history");
  };

  // Quick view report
  const handleQuickViewReport = (patient, assessment) => {
    setActiveDossierView({ patient, assessment });
  };

  // Save or update assessment session
  const handleSaveAssessment = async (patientId, newAssessment) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const existingAssessments = pat.assessments || [];
        const index = existingAssessments.findIndex((a) => a.id === newAssessment.id);
        let updatedAssessments;

        if (index >= 0) {
          updatedAssessments = [...existingAssessments];
          updatedAssessments[index] = newAssessment;
        } else {
          updatedAssessments = [...existingAssessments, newAssessment];
        }

        return {
          ...pat,
          baselinePrakriti: newAssessment.scores?.dominantPrakriti || pat.baselinePrakriti,
          assessments: updatedAssessments
        };
      }
      return pat;
    });

    handleSavePatients(updated);

    // Sync with backend API if available
    try {
      if (newAssessment.status === "FINALIZED") {
        await api.finalizeAssessment(newAssessment.id, {
          notes: newAssessment.supervisorNotes || "Officially verified and signed off.",
          patientMessage: newAssessment.patientMessage || ""
        });
      } else {
        await api.createAssessment({
          id: newAssessment.id,
          patientId,
          answers: newAssessment.answers,
          questionNotes: newAssessment.questionNotes,
          patientMessage: newAssessment.patientMessage,
          status: newAssessment.status || "DRAFT",
          scores: newAssessment.scores,
          observations: newAssessment.observations
        });
      }
    } catch (err) {
      console.warn("Backend assessment sync notice:", err.message);
    }
  };

  // Supervising doctor sign-off action
  const handleSupervisorApprove = async (
    patientId,
    assessmentId,
    customNotes = "Official clinical verification confirmed by Supervising Vaidya."
  ) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const updatedAssessments = (pat.assessments || []).map((asm) => {
          if (asm.id === assessmentId) {
            return {
              ...asm,
              status: "FINALIZED",
              supervisorApproved: true,
              supervisorNotes: customNotes
            };
          }
          return asm;
        });
        return { ...pat, assessments: updatedAssessments };
      }
      return pat;
    });
    handleSavePatients(updated);

    try {
      await api.finalizeAssessment(assessmentId, {
        notes: customNotes
      });
    } catch (err) {
      console.warn("Backend supervisor approve notice:", err.message);
    }

    if (activePatientForHistory && activePatientForHistory.id === patientId) {
      const updatedPat = updated.find((p) => p.id === patientId);
      setActivePatientForHistory(updatedPat);
    }

    if (activeDossierView && activeDossierView.assessment?.id === assessmentId) {
      setActiveDossierView((prev) => ({
        ...prev,
        assessment: {
          ...prev.assessment,
          status: "FINALIZED",
          supervisorApproved: true,
          supervisorNotes: customNotes
        }
      }));
    }
  };

  // Deliver report to patient
  const handleDoctorDeliverReport = async (patientId, assessmentId) => {
    const updated = patients.map((pat) => {
      if (pat.id === patientId) {
        const updatedAssessments = (pat.assessments || []).map((asm) => {
          if (asm.id === assessmentId) {
            return {
              ...asm,
              reportDelivered: true,
              reportDeliveredAt: new Date().toISOString()
            };
          }
          return asm;
        });
        return { ...pat, assessments: updatedAssessments };
      }
      return pat;
    });
    handleSavePatients(updated);

    try {
      await api.deliverReport(assessmentId);
    } catch (err) {
      console.warn("Backend report deliver notice:", err.message);
    }

    if (activeDossierView && activeDossierView.assessment?.id === assessmentId) {
      setActiveDossierView((prev) => ({
        ...prev,
        assessment: {
          ...prev.assessment,
          reportDelivered: true,
          reportDeliveredAt: new Date().toISOString()
        }
      }));
    }

    alert("Report delivered! Patient record has been updated with delivery confirmation.");
  };

  return (
    <AppShell
      activeRole={activeRole}
      onRoleChange={handleRoleChange}
      activeLang={activeLang}
      onLangChange={handleLangChange}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setActiveDossierView(null);
      }}
      currentUser={currentUser}
      onOpenAuthModal={() => setIsAuthModalOpen(true)}
      onOpenMethodology={() => setIsMethodologyOpen(true)}
      pendingReviewCount={pendingReviewCount}
    >
      {/* Quick View Dossier Overlay (if viewing saved report) */}
      {activeDossierView ? (
        <div className="space-y-4">
          <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs">
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => setActiveDossierView(null)}
            >
              {activeRole === "patient" ? "Back to My Reports" : "Back to Directory"}
            </Button>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {activeRole === "doctor" &&
                !activeDossierView.assessment?.reportDelivered && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Send}
                    onClick={() =>
                      handleDoctorDeliverReport(
                        activeDossierView.patient.id,
                        activeDossierView.assessment.id
                      )
                    }
                  >
                    Deliver to Patient
                  </Button>
                )}

              <Button
                variant="gold"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Strict data separation: Patient views only PatientReport */}
          {activeRole === "patient" ? (
            <PatientReport
              patient={activeDossierView.patient}
              scores={activeDossierView.assessment.scores}
              assessment={activeDossierView.assessment}
              patientMessage={activeDossierView.assessment.patientMessage}
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
          {/* TAB: PUBLIC LANDING PAGE */}
          {activeTab === "landing" && (
            <LandingPage
              onSelectRoleAndNavigate={(role, targetTab) => {
                handleRoleChange(role);
                setActiveTab(targetTab);
              }}
              onOpenMethodology={() => setIsMethodologyOpen(true)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* TAB: DOCTOR DASHBOARD */}
          {activeTab === "dashboard" && activeRole === "doctor" && (
            <DoctorDashboard
              patients={patients}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setActiveDossierView(null);
              }}
              onStartAssessment={handleStartAssessmentForPatient}
              onQuickViewReport={handleQuickViewReport}
              onSupervisorApprove={handleSupervisorApprove}
              onOpenNewPatientModal={() => setIsPatientModalOpen(true)}
              onExportBackup={exportFullDataBackup}
            />
          )}

          {/* TAB: STUDENT DASHBOARD */}
          {activeTab === "dashboard" && activeRole === "student" && (
            <StudentDashboard
              patients={patients}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setActiveDossierView(null);
              }}
              onStartAssessment={handleStartAssessmentForPatient}
              onQuickViewReport={handleQuickViewReport}
              onOpenMethodology={() => setIsMethodologyOpen(true)}
            />
          )}


          {/* TAB: PATIENTS DIRECTORY */}
          {activeTab === "patients" && activeRole !== "patient" && (
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

          {/* TAB: START ASSESSMENT WORKFLOW */}
          {activeTab === "assessment" && activeRole !== "patient" && (
            <AssessmentWorkflow
              patient={activePatientForAssessment || patients[0]}
              allPatients={patients}
              activeRole={activeRole}
              activeLang={activeLang}
              initialData={editingAssessment}
              onCancel={() => {
                setActiveTab(activeRole === "doctor" ? "dashboard" : "patients");
                setEditingAssessment(null);
              }}
              onSaveAssessment={handleSaveAssessment}
            />
          )}

          {/* TAB: REVIEW QUEUE (Doctor only) */}
          {activeTab === "reviewQueue" && activeRole === "doctor" && (
            <ReviewQueue
              patients={patients}
              onSupervisorApprove={handleSupervisorApprove}
              onQuickViewReport={handleQuickViewReport}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setActiveDossierView(null);
              }}
            />
          )}

          {/* TAB: REPORTS ARCHIVE */}
          {activeTab === "reports" && activeRole !== "patient" && (
            <ReportsView
              patients={patients}
              activeRole={activeRole}
              onQuickViewReport={handleQuickViewReport}
              onDoctorDeliverReport={handleDoctorDeliverReport}
            />
          )}

          {/* TAB: ASSESSMENT HISTORY & CLINICAL RECORDS */}
          {activeTab === "history" && activeRole !== "patient" && (
            <PatientHistoryView
              patient={activePatientForHistory || patients[0]}
              activeRole={activeRole}
              onBack={() => setActiveTab("patients")}
              onViewReport={handleQuickViewReport}
              onSupervisorApprove={handleSupervisorApprove}
            />
          )}

          {/* TAB: QUESTIONNAIRE BUILDER (Doctor only) */}
          {activeTab === "builder" && activeRole === "doctor" && (
            <QuestionnaireManager
              questionnaires={questionnaires}
              onSaveQuestionnaires={handleSaveQuestionnaires}
            />
          )}

          {/* TAB: CLINICIAN / USER PROFILE */}
          {activeTab === "profile" && (
            <ProfileView
              currentUser={currentUser}
              activeRole={activeRole}
              onRoleChange={handleRoleChange}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                saveStoredUser(user);
              }}
            />
          )}

          {/* TAB: PLATFORM SETTINGS */}
          {activeTab === "settings" && (
            <SettingsView
              activeLang={activeLang}
              onLangChange={handleLangChange}
              serverOnline={serverOnline}
              onResetData={() => setPatients(getStoredPatients())}
            />
          )}
        </>
      )}

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

      {/* Clinician Authentication Portal Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />
    </AppShell>
  );
}

export default App;
