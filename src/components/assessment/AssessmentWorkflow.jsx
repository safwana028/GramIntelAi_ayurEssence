import React, { useState, useEffect } from "react";
import {
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Save,
  RotateCcw, Wand2, AlertCircle, FileText, Check, ShieldCheck,
  BrainCircuit, Info, Eye, Lock, Send, Share2, ListChecks
} from "lucide-react";
import { STANDARD_QUESTIONS } from "../../data/standardQuestionnaire";
import { calculatePrakriti } from "../../services/prakritiCalculator";
import { extractDoshaIndicators, getSampleObservation } from "../../services/nlpObservationParser";
import { DoshaRadarChart, DoshaProportionBar } from "../report/DoshaRadarChart";
import { CalculationInspector } from "./CalculationInspector";
import { DoctorReport } from "../report/DoctorReport";
import { PatientReport } from "../report/PatientReport";
import { VoiceDictationWidget } from "./VoiceDictationWidget";
import { InlineVoiceDictation } from "./InlineVoiceDictation";
import { AdaptiveDoshaBanner } from "./AdaptiveDoshaBanner";
import { TRANSLATIONS } from "../../data/translations";

export function AssessmentWorkflow({
  patient,
  allPatients,
  activeRole,
  activeLang,
  onCancel,
  onSaveAssessment,
  initialData = null
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // Active Wizard Step (1: Context, 2: 24 Questions, 3: Observations & Voice, 4: Review & Finalize, 5: Constitutional Reports)
  const [currentStep, setCurrentStep] = useState(initialData ? 4 : 1);

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState(patient?.id || allPatients[0]?.id || "");
  const currentPatient = allPatients.find((p) => p.id === selectedPatientId) || patient || allPatients[0];

  // Assessment Context
  const [season, setSeason] = useState(initialData?.season || "Varsha / Sharad (Autumn)");
  const [assessmentType, setAssessmentType] = useState("Baseline Janma Prakriti");
  const [examinerName, setExaminerName] = useState(() => {
    if (initialData?.conductedBy?.name) return initialData.conductedBy.name;
    if (activeRole === "student") return "Dr. Mahesh Bhat (Final Year BAMS Scholar)";
    if (activeRole === "patient") return patient?.name ? `${patient.name} (Patient Self-Assessment)` : "Patient Self-Assessment";
    return "Dr. K. Raghavendra Rao, BAMS, MD (Ayu)";
  });

  useEffect(() => {
    if (!initialData?.conductedBy?.name) {
      if (activeRole === "student") {
        setExaminerName("Dr. Mahesh Bhat (Final Year BAMS Scholar)");
      } else if (activeRole === "patient") {
        setExaminerName(currentPatient?.name ? `${currentPatient.name} (Patient Self-Assessment)` : "Patient Self-Assessment");
      } else {
        setExaminerName("Dr. K. Raghavendra Rao, BAMS, MD (Ayu)");
      }
    }
  }, [activeRole, currentPatient?.name, initialData]);

  // Assessment State Machine
  const [assessmentStatus, setAssessmentStatus] = useState(
    initialData?.status?.toUpperCase() || (activeRole === "doctor" ? "DRAFT" : "DRAFT")
  );
  const isFinalized = assessmentStatus === "FINALIZED";

  // Questionnaire & Per-Question Notes State
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState("categorized"); // 'categorized' | 'single'
  const [answers, setAnswers] = useState(initialData?.answers || {});
  const [questionNotes, setQuestionNotes] = useState(initialData?.questionNotes || {});
  const [patientMessage, setPatientMessage] = useState(initialData?.patientMessage || "");

  // Clinical Observations & NLP State
  const [freeTextObs, setFreeTextObs] = useState(initialData?.observations?.freeText || "");
  const [nlpIndicators, setNlpIndicators] = useState(initialData?.observations?.nlpSignals || initialData?.observations?.nlpIndicators || []);
  const [includeNlpInCalculation, setIncludeNlpInCalculation] = useState(true);
  const [ashtavidha, setAshtavidha] = useState(
    initialData?.observations?.ashtavidha || {
      nadi: "Sarpa-Manduka Gati (Vata-Pitta)",
      mutra: "Prakruta (Normal straw)",
      mala: "Sama / Madhyama",
      jihva: "Niralpa (Clean)",
      shabda: "Spashta (Clear)",
      sparsha: "Samashitoshna (Normal temp)",
      drik: "Prakruta (Clear)",
      akriti: "Madhyama (Medium)"
    }
  );
  const [supervisorNotes, setSupervisorNotes] = useState(
    initialData?.supervisorNotes || ""
  );

  // Delivery state
  const [reportDelivered, setReportDelivered] = useState(initialData?.reportDelivered || false);

  // Modals & Notices
  const [showInspector, setShowInspector] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [reportViewMode, setReportViewMode] = useState(activeRole === "patient" ? "patient" : "doctor");
  const [completionNotice, setCompletionNotice] = useState(null);

  // Dynamic Calculation Result (Guaranteed V+P+K = 100)
  const [calcResult, setCalcResult] = useState(
    initialData?.scores || calculatePrakriti(answers, STANDARD_QUESTIONS, nlpIndicators, includeNlpInCalculation)
  );

  // Re-calculate when answers or NLP indicators change
  useEffect(() => {
    if (!isFinalized) {
      const res = calculatePrakriti(
        answers,
        STANDARD_QUESTIONS,
        nlpIndicators,
        includeNlpInCalculation
      );
      setCalcResult(res);
    }
  }, [answers, nlpIndicators, includeNlpInCalculation, isFinalized]);

  // Answer handler - Supports single or multi/dual dosha selection
  const handleSelectAnswer = (questionId, optionId) => {
    if (isFinalized) return;
    setAnswers((prev) => {
      const current = prev[questionId];
      if (!current) {
        return { ...prev, [questionId]: [optionId] };
      }
      const arr = Array.isArray(current) ? current : [current];
      if (arr.includes(optionId)) {
        // Toggle off if already selected
        const nextArr = arr.filter((id) => id !== optionId);
        return {
          ...prev,
          [questionId]: nextArr.length === 1 ? nextArr[0] : (nextArr.length > 0 ? nextArr : undefined)
        };
      } else {
        // Multi-option selection: add to array
        return {
          ...prev,
          [questionId]: [...arr, optionId]
        };
      }
    });
  };

  // Per-Question note handler
  const handleUpdateQuestionNote = (questionId, note) => {
    if (isFinalized) return;
    setQuestionNotes((prev) => ({
      ...prev,
      [questionId]: note
    }));
  };

  // Demo auto-fill helper for judges and evaluators
  const handleAutoFillDemo = (type = "vata-pitta") => {
    if (isFinalized) return;
    const demoAnswers = {};
    const demoNotes = {};
    STANDARD_QUESTIONS.forEach((q, idx) => {
      if (type === "vata-pitta") {
        demoAnswers[q.id] = idx % 2 === 0 ? "v" : "p";
        demoNotes[q.id] = idx % 4 === 0 ? "Observed typical coastal climatic variation." : "";
      } else if (type === "pitta-kapha") {
        demoAnswers[q.id] = idx % 2 === 0 ? "p" : "k";
        demoNotes[q.id] = idx % 4 === 0 ? "Exhibits moderate heat tolerance." : "";
      } else {
        demoAnswers[q.id] = idx % 3 === 0 ? "v" : idx % 3 === 1 ? "p" : "k";
      }
    });
    setAnswers(demoAnswers);
    setQuestionNotes(demoNotes);
    setPatientMessage("Please maintain regular hydration, follow warm meals, and protect sleep routines as advised.");

    const sampleNote = getSampleObservation(type);
    setFreeTextObs(sampleNote);
    const extracted = extractDoshaIndicators(sampleNote);
    setNlpIndicators(extracted);
  };

  // Run NLP Extraction on Doctor's Free Text
  const handleRunNlp = () => {
    const extracted = extractDoshaIndicators(freeTextObs);
    setNlpIndicators(extracted);
  };

  // Route transcribed text from Voice Dictation Widget
  const handleVoiceInsert = (text, destination, qId) => {
    if (isFinalized) return;
    if (destination === "clinical") {
      setFreeTextObs((prev) => (prev ? `${prev} ${text}` : text));
    } else if (destination === "question" && qId) {
      setQuestionNotes((prev) => ({
        ...prev,
        [qId]: prev[qId] ? `${prev[qId]} ${text}` : text
      }));
    } else if (destination === "patient") {
      setPatientMessage((prev) => (prev ? `${prev} ${text}` : text));
    } else if (destination === "doctor") {
      setSupervisorNotes((prev) => (prev ? `${prev} ${text}` : text));
    }
  };

  // Save Draft (Student or Doctor)
  const handleSaveDraft = () => {
    const draftAssessment = {
      id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      season,
      conductedBy: {
        name: examinerName,
        role: activeRole,
        institution: "SDM College of Ayurveda, Udupi"
      },
      status: "DRAFT",
      supervisorApproved: false,
      supervisorNotes: supervisorNotes || "Draft in progress.",
      questionnaireId: "sdm-udupi-standard-24",
      scores: calcResult,
      observations: {
        freeText: freeTextObs,
        ashtavidha,
        nlpSignals: nlpIndicators
      },
      questionNotes,
      patientMessage,
      answers,
      reportDelivered: false
    };

    setAssessmentStatus("DRAFT");
    onSaveAssessment(currentPatient.id, draftAssessment);
    alert("Draft saved successfully. You can continue editing later.");
  };

  // Submit Assessment (Student or Patient action -> placed in Doctor review queue as draft)
  const handleSubmitForReview = () => {
    if (answeredCount < STANDARD_QUESTIONS.length) {
      alert(`Please answer all 24 questions before submitting (${answeredCount}/24 completed).`);
      return;
    }

    const submittedAssessment = {
      id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      season,
      conductedBy: {
        name: examinerName,
        role: activeRole,
        institution: activeRole === "patient" ? "Patient Self-Assessment" : "SDM College of Ayurveda, Udupi"
      },
      status: "UNDER_REVIEW",
      supervisorApproved: false,
      supervisorNotes:
        supervisorNotes ||
        (activeRole === "patient"
          ? "Submitted by patient for official clinical evaluation."
          : "Submitted by scholar for supervising doctor evaluation."),
      questionnaireId: "sdm-udupi-standard-24",
      scores: calcResult,
      observations: {
        freeText: freeTextObs,
        ashtavidha,
        nlpSignals: nlpIndicators
      },
      questionNotes,
      patientMessage,
      answers,
      reportDelivered: false
    };

    setAssessmentStatus("UNDER_REVIEW");
    onSaveAssessment(currentPatient.id, submittedAssessment);
    setCompletionNotice({
      title: t.assessmentCompleted || "Assessment Completed Successfully!",
      message: `${t.savedInPatientFile || "Saved in patient dossier"}: ${currentPatient.name}. ${
        activeRole === "patient"
          ? "Your self-assessment has been saved to your file and submitted as a draft to the Doctor's Review Queue for official clinical verification."
          : (t.studentNotificationDesc || "Submitted as draft to Doctor Review Queue for supervisor approval.")
      }`,
      patientName: currentPatient.name
    });
    setCurrentStep(5);
  };

  // Doctor Finalize Assessment (Atomic & Permanent)
  const handleConfirmFinalize = () => {
    if (answeredCount < STANDARD_QUESTIONS.length) {
      alert(`Cannot finalize incomplete assessment. All 24 questions are mandatory (${answeredCount}/24 answered).`);
      setShowFinalizeModal(false);
      return;
    }

    const finalizedAssessment = {
      id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      season,
      conductedBy: {
        name: examinerName,
        role: activeRole,
        institution: "SDM College of Ayurveda, Udupi"
      },
      status: "FINALIZED",
      supervisorApproved: true,
      supervisorNotes: supervisorNotes || `Verified and confirmed by Dr. ${examinerName}, BAMS.`,
      finalizedBy: {
        name: examinerName,
        timestamp: new Date().toISOString()
      },
      questionnaireId: "sdm-udupi-standard-24",
      scores: calcResult,
      observations: {
        freeText: freeTextObs,
        ashtavidha,
        nlpSignals: nlpIndicators
      },
      questionNotes,
      patientMessage,
      answers,
      reportDelivered: reportDelivered
    };

    setAssessmentStatus("FINALIZED");
    setShowFinalizeModal(false);
    onSaveAssessment(currentPatient.id, finalizedAssessment);
    setCompletionNotice({
      title: t.assessmentCompleted || "Assessment Completed Successfully!",
      message: `${t.savedInPatientFile || "Saved in patient dossier"}: ${currentPatient.name}. Constitutional assessment finalized and recorded.`,
      patientName: currentPatient.name
    });
    setCurrentStep(5);
  };

  // Doctor Generates Patient Report for Handout
  const handleDeliverReport = () => {
    setReportDelivered(true);
    const updated = {
      ...(initialData || {}),
      id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
      reportDelivered: true,
      reportDeliveredAt: new Date().toISOString()
    };
    onSaveAssessment(currentPatient.id, updated);
    alert("Patient Report finalized for handout! The physician can now provide the physical report to the patient.");
  };

  const answeredCount = STANDARD_QUESTIONS.filter((q) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length > 0 : Boolean(a);
  }).length;
  const progressPercent = Math.round((answeredCount / STANDARD_QUESTIONS.length) * 100);
  const unansweredQuestions = STANDARD_QUESTIONS.filter((q) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length === 0 : !a;
  });

  return (
    <div className="space-y-6">
      {/* Immutability Banner if Finalized */}
      {/* Immutability Banner if Finalized */}
      {isFinalized && (
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                {t.lockedAssessmentNotice || "🔒 Assessment Finalized — Immutable Record"}
              </h4>
              <p className="text-[11px] text-amber-800">
                {t.lockedAssessmentDesc || "This clinical assessment has been formally approved and locked. Answers, notes, and constitutional scoring cannot be modified."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!reportDelivered && activeRole === "doctor" && (
              <button
                type="button"
                onClick={handleDeliverReport}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.btnDeliverReport || "Deliver Patient Report"}</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-950 border border-amber-300">
              {reportDelivered ? (t.deliveredToPatient || "Delivered to Patient") : (t.pendingDelivery || "Pending Delivery")}
            </span>
          </div>
        </div>
      )}

      {/* Wizard Stepper */}
      <div className="no-print bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
          {[
            { step: 1, label: t.step1Stepper || "1. Patient & Context" },
            { step: 2, label: `${t.step2Stepper || "2. 24 Questions"} (${answeredCount}/24)` },
            { step: 3, label: t.step3Stepper || "3. Clinical Notes & Voice" },
            { step: 4, label: t.step4Stepper || "4. Review & Finalize" },
            { step: 5, label: t.step5Stepper || "5. Constitutional Reports" }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentStep === item.step
                  ? "bg-emerald-800 text-white shadow-sm"
                  : currentStep > item.step
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === item.step
                    ? "bg-amber-400 text-stone-900"
                    : currentStep > item.step
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {currentStep > item.step ? "✓" : item.step}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: PATIENT PROFILE & CONTEXT */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
              {t.step1Title || "1. Patient Profile & Clinical Assessment Context"}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {activeLang === "kn"
                ? "ರೋಗಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಋತುಮಾನದ ಸನ್ನಿವೇಶವನ್ನು (ಋತು) ನಿರ್ದಿಷ್ಟಪಡಿಸಿ ಮತ್ತು ವೈದ್ಯರ ವಿವರಗಳನ್ನು ದೃಢೀಕರಿಸಿ."
                : activeLang === "hi"
                ? "रोगी का चयन करें, मौसमी संदर्भ (ऋतु) निर्दिष्ट करें और चिकित्सक विवरण की पुष्टि करें।"
                : "Select patient, specify seasonal context (Ritu), and confirm clinician credentials."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                {activeRole === "patient" ? (t.patientDemographicsTitle || "Patient Profile *") : (t.patientDemographicsTitle || "Active Patient *")}
              </label>
              <select
                disabled={isFinalized || activeRole === "patient"}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50 font-medium disabled:opacity-80"
              >
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.baselinePrakriti}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">{t.primaryComplaint || "Evaluation Purpose"}</label>
              <select
                disabled={isFinalized}
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {activeRole === "patient" && (
                  <option value="Patient Self-Assessment">{t.purposePatient || "Patient Self-Assessment (Swastha Pariksha)"}</option>
                )}
                <option value="Baseline Janma Prakriti">{t.purposeJanma || "Baseline Janma Prakriti (Primary Constitution)"}</option>
                <option value="Seasonal Constitutional Review">{t.purposeSeasonal || "Seasonal Constitutional Review (Ritucharya)"}</option>
                <option value="Student Academic Training Case">{t.purposeStudent || "Student Academic Training Case (Supervised)"}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">{t.season || "Current Season (Ritu)"}</label>
              <select
                disabled={isFinalized}
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Varsha / Sharad (Autumn)">{t.seasonVarsha || "Varsha / Sharad (Monsoon to Autumn)"}</option>
                <option value="Hemanta / Shishira (Winter)">{t.seasonHemanta || "Hemanta / Shishira (Winter)"}</option>
                <option value="Vasanta (Spring)">{t.seasonVasanta || "Vasanta (Spring)"}</option>
                <option value="Grishma (Summer)">{t.seasonGrishma || "Grishma (Summer)"}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                {activeRole === "patient" ? (t.submittedByPatient || "Submitter (Patient Profile)") : (t.conductedByLabel || "Examiner Clinician")}
              </label>
              <input
                disabled={isFinalized || activeRole === "patient"}
                type="text"
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white disabled:bg-stone-50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <span>{t.nextQuestions || "Next: 24 Questions"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 24-QUESTION ASSESSMENT */}
      {currentStep === 2 && (
        <div className="space-y-5 max-w-5xl mx-auto">
          {/* Top Static Control Bar with 24 Questions Progress & Filter Pills */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { key: "All", label: t.dimensionAll || "All Questions (24)" },
                  { key: "Physical", label: t.dimensionPhysical || "Physical (Sharirika)" },
                  { key: "Physiological", label: t.dimensionPhysiological || "Physiological (Kriyatmaka)" },
                  { key: "Psychological", label: t.dimensionPsychological || "Psychological (Manasika)" }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      activeCategory === cat.key
                        ? "bg-emerald-800 text-white font-semibold"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Progress Bar & Counter */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-right text-xs">
                  <div className="font-semibold text-stone-800">
                    {t.questionProgress || "Question Progress"}: {answeredCount} / 24 {t.answered || "Answered"} ({progressPercent}%)
                  </div>
                  <div className="w-40 h-2 bg-stone-100 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        answeredCount === 24 ? "bg-emerald-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {!isFinalized && (
                  <button
                    onClick={handleSaveDraft}
                    className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <Save className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.saveDraft || "Save Draft"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Configurable Adaptive 80% Threshold Indicator Banner */}
            <AdaptiveDoshaBanner
              scores={calcResult}
              answeredCount={answeredCount}
              totalQuestions={24}
              threshold={80}
            />

            {/* Multi-Dosha / Dual Trait Notice Banner */}
            <div className="bg-sky-50/70 border border-sky-200/80 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sky-900 font-medium">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.dualTraitNotice || "Dual / Mixed Traits Allowed (Select 1 or more options if mixed traits are observed)"}</span>
              </div>
              <span className="text-[10px] text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200 uppercase font-bold">
                Charaka Vimana 8
              </span>
            </div>

            {/* Unanswered Questions Alert if incomplete */}
            {answeredCount < 24 && (
              <div className="bg-amber-50/60 border border-amber-200/80 px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>{24 - answeredCount} {t.missingQuestionsWarning || "questions remaining: Mandatory 24 questions required before final submission."}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-800">
                  Missing: {unansweredQuestions.map((q) => q.id.replace("q", "").split("_")[0]).slice(0, 8).join(", ")}
                  {unansweredQuestions.length > 8 ? "..." : ""}
                </span>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {STANDARD_QUESTIONS.filter(
              (q) => activeCategory === "All" || q.dimension === activeCategory
            ).map((q, idx) => {
              const currentAnswer = answers[q.id];
              const selectedOptIds = Array.isArray(currentAnswer)
                ? currentAnswer
                : currentAnswer
                ? [currentAnswer]
                : [];
              const isAnswered = selectedOptIds.length > 0;
              const isMultiSelected = selectedOptIds.length > 1;
              const questionNum = q.order || STANDARD_QUESTIONS.findIndex((item) => item.id === q.id) + 1;
              const questionText = q.question[activeLang] || q.question.en;
              const currentNote = questionNotes[q.id] || "";

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isAnswered
                      ? "border-emerald-300 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                          {t.questionNumLabel || "Question"} {questionNum} {t.of24 || "of 24"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 uppercase">
                          {q.dimension === "Physical"
                            ? (t.dimensionPhysical || "Physical")
                            : q.dimension === "Physiological"
                            ? (t.dimensionPhysiological || "Physiological")
                            : (t.dimensionPsychological || "Psychological")}
                        </span>
                        <span className="text-[11px] font-serif text-emerald-800 italic">
                          {q.sanskritTrait}
                        </span>
                        {isMultiSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>{t.dualTraitSelected || "Dual / Mixed Traits Selected"} ({selectedOptIds.length})</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                        {questionNum}. {questionText}
                      </h4>
                    </div>

                    <span className="text-[10px] text-stone-400 whitespace-nowrap font-mono">
                      {q.context}
                    </span>
                  </div>

                  {/* 3 Classical Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOptIds.includes(opt.id) || selectedOptIds.includes(opt.dosha);
                      const rawOptText = opt.text[activeLang] || opt.text.en;
                      // Mask any explicit Vata / Pitta / Kapha text in option text during quiz taking
                      const optText = rawOptText
                        .replace(/\s*\((?:Vata|Pitta|Kapha|V|P|K)\)/gi, "")
                        .replace(/\s*\[(?:Vata|Pitta|Kapha|V|P|K)\]/gi, "");

                      let borderColor = "border-stone-200 hover:border-stone-300";
                      let bgColor = "bg-white hover:bg-stone-50/50";
                      let badgeColor = "bg-stone-100 text-stone-600";

                      if (isSelected) {
                        borderColor = "border-emerald-600 ring-2 ring-emerald-500/20";
                        bgColor = "bg-emerald-50/70";
                        badgeColor = "bg-emerald-700 text-white";
                      }

                      const optionLabel = `Option ${String.fromCharCode(65 + optIndex)}`;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${borderColor} ${bgColor} ${
                            isFinalized ? "pointer-events-none opacity-80" : ""
                          }`}
                        >
                          <p className="text-xs text-stone-700 leading-relaxed font-medium">
                            {optText}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                              {optionLabel}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-stone-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Section 20: Extra text box below MCQ options */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-stone-700">
                        {t.additionalObservationNote || "Additional observation / note"} ({t.questionNumLabel || "Question"} {questionNum}):
                      </label>
                      {!isFinalized && (
                        <InlineVoiceDictation
                          value={currentNote}
                          onChange={(val) => handleUpdateQuestionNote(q.id, val)}
                          fieldName={`Question ${questionNum} Note`}
                        />
                      )}
                    </div>
                    <input
                      disabled={isFinalized}
                      type="text"
                      value={currentNote}
                      onChange={(e) => handleUpdateQuestionNote(q.id, e.target.value)}
                      placeholder={t.clinicalObservationPlaceholder || "e.g. Mild dryness on shins; seasonal fluctuation in winter..."}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-emerald-600 bg-stone-50/40 text-stone-800"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 21: Patient-Facing Additional Message Textbox */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>{t.additionalPatientMessage || "Additional message for patient (Appears in Patient Swastha Report)"}</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.patientHandoutNote || "Patient Handout Note"}
                </span>
                {!isFinalized && (
                  <InlineVoiceDictation
                    value={patientMessage}
                    onChange={setPatientMessage}
                    fieldName="Patient Message"
                  />
                )}
              </div>
            </div>
            <p className="text-[11px] text-stone-500">
              {t.patientMessageGuidance || "Doctor/Student words intended directly for the patient. Internal clinical notes are kept strictly confidential and will not appear in the patient-facing report."}
            </p>
            <textarea
              disabled={isFinalized}
              rows={3}
              value={patientMessage}
              onChange={(e) => setPatientMessage(e.target.value)}
              placeholder="e.g. Please maintain regular hydration, favor warm freshly cooked foods, and practice gentle Abhyanga..."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.btnBack || "Back"}</span>
            </button>

            <div className="flex items-center gap-2">
              {!isFinalized && (
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveDraft || "Save Draft"}</span>
                </button>
              )}

              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
              >
                <span>{t.nextNotes || "Next: Clinical Notes & Voice"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CLINICAL OBSERVATIONS & VOICE DICTATION */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
                {t.step3Title || "3. Clinical Observations & Voice-to-Text Dictation"}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {activeLang === "kn"
                  ? "ವೈದ್ಯಕೀಯ ಮುಕ್ತ ಟಿಪ್ಪಣಿಗಳು, ಅಷ್ಟವಿಧ ಪರೀಕ್ಷೆ ಮತ್ತು ಧ್ವನಿ-ಇಂದ-ಪಠ್ಯ ದಾಖಲೆಯನ್ನು ನಮೂದಿಸಿ."
                  : activeLang === "hi"
                  ? "स्वतंत्र नैदानिक टिप्पणियां, अष्टविध परीक्षा और ध्वनि-से-पाठ डिक्टेशन दर्ज करें।"
                  : "Record free-form clinical notes, Ashtavidha examination, and speech-to-text dictation."}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Doctor Speech & NLP Module
            </span>
          </div>

          {/* Voice Dictation Component */}
          {activeRole === "doctor" && !isFinalized && (
            <VoiceDictationWidget
              onInsertText={handleVoiceInsert}
              activeQuestionId={STANDARD_QUESTIONS[0]?.id}
              activeQuestionTitle="Frame & Build"
            />
          )}

          {/* Free-form notes & NLP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 text-xs">
                {t.clinicalObservations || "Free-Form Clinical Notes (Internal Practitioner Observations)"}
              </label>
              <div className="flex items-center gap-2">
                {!isFinalized && (
                  <InlineVoiceDictation
                    value={freeTextObs}
                    onChange={setFreeTextObs}
                    fieldName="Clinical Notes"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRunNlp}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>{t.nlpExtractBtn || "Extract Dosha Cues"}</span>
                </button>
              </div>
            </div>

            <textarea
              disabled={isFinalized}
              rows={4}
              value={freeTextObs}
              onChange={(e) => setFreeTextObs(e.target.value)}
              placeholder="e.g. Patient exhibits lean frame with prominent joints. Speaks rapidly with enthusiasm. Appetite is erratic and digestion shows bloating..."
              className="w-full p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs leading-relaxed bg-stone-50/50"
            />
          </div>

          {/* Extracted NLP signals */}
          {nlpIndicators.length > 0 && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-stone-800">
                    {t.detectedCues || "NLP Extracted Clinical Signals"} ({nlpIndicators.length} {t.detectedCues || "Cues Detected"})
                  </h4>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNlpInCalculation}
                    onChange={(e) => setIncludeNlpInCalculation(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Blend into Prakriti Scoring</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {nlpIndicators.map((ind, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      ind.dosha === "vata"
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : ind.dosha === "pitta"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    <strong className="capitalize">{t[ind.dosha] || ind.dosha}:</strong>
                    <span>"{ind.matchedPhrase}"</span>
                    <span className="text-[10px] text-stone-400">({ind.guna})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ashtavidha Pariksha */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-stone-800 text-xs">
              {t.ashtavidhaTitle || "Ashtavidha Pariksha (Classical Eightfold Clinical Examination)"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">1. {t.nadiLabel || "Nadi (Pulse)"}</label>
                <input
                  disabled={isFinalized}
                  type="text"
                  value={ashtavidha.nadi}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, nadi: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">2. {t.jihvaLabel || "Jihva (Tongue)"}</label>
                <input
                  disabled={isFinalized}
                  type="text"
                  value={ashtavidha.jihva}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, jihva: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">3. {t.sparshaLabel || "Sparsha (Touch)"}</label>
                <input
                  disabled={isFinalized}
                  type="text"
                  value={ashtavidha.sparsha}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, sparsha: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">4. {t.drikLabel || "Drik (Eyes/Gaze)"}</label>
                <input
                  disabled={isFinalized}
                  type="text"
                  value={ashtavidha.drik}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, drik: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backToQuestions || "Back to 24 Questions"}</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t.nextReview || "Next: Review & Finalize"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & PRAKRITI SYNTHESIS */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  {t.constitutionalSynthesis || "Constitutional Synthesis"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isFinalized ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"
                }`}>
                  {t.status || "Status"}: {isFinalized ? (t.finalized || "FINALIZED") : (t.draft || "DRAFT")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-serif-heading mt-0.5">
                {t.evaluatedConstitution || "Evaluated Constitution"}: {calcResult.dominantPrakriti}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.classification || "Classification"}: <strong className="text-stone-800">{calcResult.constitutionType}</strong> • {calcResult.classicalTerm}
              </p>
            </div>

            <button
              onClick={() => setShowInspector(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-4 h-4 text-emerald-700" />
              <span>{t.inspectMathBasis || "Inspect Mathematical Basis"}</span>
            </button>
          </div>

          {/* Radar Chart & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
              <DoshaRadarChart scores={calcResult} size={270} />
              <div className="text-[11px] text-stone-500 text-center mt-2">
                {t.vectorSpaceTitle || "Equilateral Tri-Dosha Vector Space (Vata + Pitta + Kapha = 100%)"}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Vata Bar */}
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
                <div className="flex justify-between font-bold text-sky-900 mb-1">
                  <span>{t.vata || "Vata"} (वात): {calcResult.vata}%</span>
                  <span>{t.dominanceMovement || "Movement & Agility"}</span>
                </div>
                <div className="w-full h-2.5 bg-sky-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${calcResult.vata}%` }} />
                </div>
              </div>

              {/* Pitta Bar */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <div className="flex justify-between font-bold text-amber-900 mb-1">
                  <span>{t.pitta || "Pitta"} (पित्त): {calcResult.pitta}%</span>
                  <span>{t.dominanceMetabolism || "Metabolism & Tejas"}</span>
                </div>
                <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${calcResult.pitta}%` }} />
                </div>
              </div>

              {/* Kapha Bar */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex justify-between font-bold text-emerald-900 mb-1">
                  <span>{t.kapha || "Kapha"} (कफ): {calcResult.kapha}%</span>
                  <span>{t.dominanceStructure || "Structure & Stability"}</span>
                </div>
                <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${calcResult.kapha}%` }} />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 leading-relaxed text-[11px]">
                <strong>{t.scoringRationale || "Classical Synthesis Rationale"}:</strong> {calcResult.rationale}
              </div>
            </div>
          </div>

          {/* Validation Checklist before Submission */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-emerald-700" />
              <span>{t.completenessChecklist || "Assessment Completeness Verification"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                  answeredCount === 24 ? "bg-emerald-600" : "bg-amber-500"
                }`}>
                  {answeredCount === 24 ? "✓" : "!"}
                </span>
                <span>{t.navNewAssessment || "Questions"}: <strong>{answeredCount} / 24</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                  freeTextObs ? "bg-emerald-600" : "bg-stone-400"
                }`}>
                  {freeTextObs ? "✓" : "—"}
                </span>
                <span>{t.step3Stepper || "Clinical Notes"}: <strong>{freeTextObs ? (t.answered || "Recorded") : "Optional"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>Sum Invariant: <strong>V+P+K = 100%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                  patientMessage ? "bg-emerald-600" : "bg-stone-400"
                }`}>
                  {patientMessage ? "✓" : "—"}
                </span>
                <span>{t.patientHandoutNote || "Patient Message"}: <strong>{patientMessage ? (t.answered || "Configured") : "None"}</strong></span>
              </div>
            </div>
          </div>

          {/* Doctor Supervisor Note Field */}
          {activeRole === "doctor" && !isFinalized && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-stone-800 text-xs">
                  {t.doctorFinalNoteLabel || "Doctor Final Review & Approval Note"}:
                </label>
                <InlineVoiceDictation
                  value={supervisorNotes}
                  onChange={setSupervisorNotes}
                  fieldName="Supervisor Note"
                />
              </div>
              <textarea
                rows={2}
                value={supervisorNotes}
                onChange={(e) => setSupervisorNotes(e.target.value)}
                placeholder="e.g. Constitutional baseline verified and confirmed based on physical traits and Ashtavidha Pariksha..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          )}

          {/* Workflow Action Buttons based on Role */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backToNotes || "Back to Clinical Notes"}</span>
            </button>

            <div className="flex items-center gap-2">
              {!isFinalized && (
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveDraft || "Save Draft"}</span>
                </button>
              )}

              {/* Student / Patient Action: Submit for Doctor Review (CANNOT FINALIZE) */}
              {(activeRole === "student" || activeRole === "patient") && !isFinalized && (
                <button
                  onClick={handleSubmitForReview}
                  disabled={answeredCount < 24}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-stone-300 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {activeRole === "patient"
                      ? (t.submitReviewPatient || "Submit to Doctor's Draft & Review Queue")
                      : (t.submitReviewScholar || "Submit for Supervising Doctor Review")}
                  </span>
                </button>
              )}

              {/* Doctor Action: Finalize Assessment (Triggers confirmation modal) */}
              {activeRole === "doctor" && !isFinalized && (
                <button
                  onClick={() => setShowFinalizeModal(true)}
                  disabled={answeredCount < 24}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.finalizeDoctorBtn || "Finalize Assessment"}</span>
                </button>
              )}

              {/* View Report button if already finalized */}
              {isFinalized && (
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{t.viewFinalizedReports || "View Finalized Reports"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL REPORTS */}
      {currentStep === 5 && (
        <div className="space-y-4">
          {/* Assessment Completed Confirmation Banner */}
          {completionNotice && (
            <div className="no-print bg-emerald-50 border-2 border-emerald-500 p-4 sm:p-5 rounded-2xl flex items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {completionNotice.title}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {completionNotice.message}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompletionNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold text-xs p-1"
                aria-label="Dismiss notice"
              >
                ✕
              </button>
            </div>
          )}

          {/* Report Switcher Header */}
          <div className="no-print bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {activeRole !== "patient" && (
                <button
                  onClick={() => setReportViewMode("doctor")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    reportViewMode === "doctor"
                      ? "bg-emerald-800 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.viewDoctorDossier}</span>
                </button>
              )}

              <button
                onClick={() => setReportViewMode("patient")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  reportViewMode === "patient"
                    ? "bg-emerald-800 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.viewPatientSummary}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Back to Home / Dashboard Button */}
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <span>{t.btnReturnHome || "← Return to Dashboard / Home"}</span>
              </button>

              {!reportDelivered && activeRole === "doctor" && isFinalized && (
                <button
                  onClick={handleDeliverReport}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.btnDeliverReport || "Generate Handout for Patient"}</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
              >
                <span>{t.printReport || "Print / Save PDF"}</span>
              </button>
            </div>
          </div>

          {/* Render Active Report */}
          {reportViewMode === "doctor" && activeRole !== "patient" ? (
            <DoctorReport
              patient={currentPatient}
              assessment={{
                id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
                date: new Date().toISOString().slice(0, 10),
                conductedBy: { name: examinerName, role: activeRole },
                supervisorApproved: isFinalized,
                supervisorNotes,
                scores: calcResult,
                answers,
                questionNotes,
                patientMessage,
                observations: { freeText: freeTextObs, ashtavidha, nlpSignals: nlpIndicators },
                season,
                reportDelivered
              }}
              activeRole={activeRole}
              activeLang={activeLang}
            />
          ) : (
            <PatientReport
              patient={currentPatient}
              scores={calcResult}
              assessment={{
                id: initialData?.id || `ASM-${Date.now().toString().slice(-6)}`,
                date: new Date().toISOString().slice(0, 10),
                conductedBy: { name: examinerName, role: activeRole },
                patientMessage
              }}
              patientMessage={patientMessage}
              activeLang={activeLang}
            />
          )}
        </div>
      )}

      {/* Strong Finalization Confirmation Modal for Doctor (Section 41) */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {t.finalizeModalTitle || "Finalize Assessment Permanently"}
                </h3>
                <span className="text-xs text-rose-700 font-semibold">
                  {t.irreversibleAction || "Irreversible Clinical Action"}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 leading-relaxed">
              <strong>"{t.finalizeModalWarning || "Once finalized, this assessment cannot be modified."}"</strong>
              <p className="mt-1 text-stone-600">
                {t.finalizeModalDesc || "All 24 answers, question observations, patient communication, and constitutional percentages will become strictly immutable in accordance with Ayurvedic clinical audit standards."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFinalizeModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors"
              >
                {t.cancelBtn || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmFinalize}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-colors"
              >
                {t.finalizePermanentlyBtn || "Finalize Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Inspector Modal */}
      <CalculationInspector
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        calculationResult={calcResult}
      />
    </div>
  );
}
