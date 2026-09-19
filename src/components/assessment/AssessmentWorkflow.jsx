import React, { useState, useEffect } from "react";
import {
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Save,
  RotateCcw, Wand2, Mic, MicOff, AlertCircle, FileText, Check, ShieldCheck,
  BrainCircuit, Info, Eye
} from "lucide-react";
import { STANDARD_QUESTIONS } from "../../data/standardQuestionnaire";
import { calculatePrakriti } from "../../services/prakritiCalculator";
import { extractDoshaIndicators, getSampleObservation } from "../../services/nlpObservationParser";
import { DoshaRadarChart, DoshaProportionBar } from "../report/DoshaRadarChart";
import { CalculationInspector } from "./CalculationInspector";
import { DoctorReport } from "../report/DoctorReport";
import { PatientReport } from "../report/PatientReport";
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

  // Active Step (1: Context, 2: Questionnaire, 3: Observations, 4: Results, 5: Report)
  const [currentStep, setCurrentStep] = useState(initialData ? 4 : 1);

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState(patient?.id || allPatients[0]?.id || "");
  const currentPatient = allPatients.find((p) => p.id === selectedPatientId) || patient || allPatients[0];

  // Assessment Context
  const [season, setSeason] = useState("Varsha / Sharad (Autumn)");
  const [assessmentType, setAssessmentType] = useState("Baseline Janma Prakriti");
  const [examinerName, setExaminerName] = useState(
    activeRole === "student"
      ? "Dr. Mahesh Bhat (Final Year BAMS Scholar)"
      : "Dr. K. Raghavendra Rao, BAMS, MD (Ayu)"
  );

  // Questionnaire State
  const [activeCategory, setActiveCategory] = useState("All");
  const [answers, setAnswers] = useState(initialData?.answers || {});

  // Clinical Observations & NLP State
  const [freeTextObs, setFreeTextObs] = useState(initialData?.observations?.freeText || "");
  const [nlpIndicators, setNlpIndicators] = useState(initialData?.observations?.nlpIndicators || []);
  const [includeNlpInCalculation, setIncludeNlpInCalculation] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
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

  // Calculation Result
  const [calcResult, setCalcResult] = useState(
    initialData?.scores || calculatePrakriti(answers, STANDARD_QUESTIONS, nlpIndicators, includeNlpInCalculation)
  );

  // Modal and Report views
  const [showInspector, setShowInspector] = useState(false);
  const [reportViewMode, setReportViewMode] = useState(activeRole === "patient" ? "patient" : "doctor");

  // Re-calculate when answers or NLP indicators change
  useEffect(() => {
    const res = calculatePrakriti(
      answers,
      STANDARD_QUESTIONS,
      nlpIndicators,
      includeNlpInCalculation
    );
    setCalcResult(res);
  }, [answers, nlpIndicators, includeNlpInCalculation]);

  // Answer handler
  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Demo auto-fill helper for judges and evaluators
  const handleAutoFillDemo = (type = "vata-pitta") => {
    const demoAnswers = {};
    STANDARD_QUESTIONS.forEach((q, idx) => {
      if (type === "vata-pitta") {
        demoAnswers[q.id] = idx % 2 === 0 ? "v" : "p";
      } else if (type === "pitta-kapha") {
        demoAnswers[q.id] = idx % 2 === 0 ? "p" : "k";
      } else {
        demoAnswers[q.id] = idx % 3 === 0 ? "v" : idx % 3 === 1 ? "p" : "k";
      }
    });
    setAnswers(demoAnswers);

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

  // Voice recording simulation (using Web Speech API if supported, or sample dictation)
  const handleToggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      // Fallback simulated dictation
      setIsRecording(true);
      setTimeout(() => {
        const sampleDict = "Patient shows lean physique with rough skin and talks quickly. Sleep is light and disturbed.";
        setFreeTextObs((prev) => (prev ? `${prev} ${sampleDict}` : sampleDict));
        setIsRecording(false);
      }, 1200);
      return;
    }

    // Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFreeTextObs((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsRecording(false);

    recognition.start();
  };

  // Finalize and save
  const handleFinalize = () => {
    const newAssessment = {
      id: `ASM-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      conductedBy: {
        name: examinerName,
        role: activeRole,
        institution: "SDM College of Ayurveda, Udupi"
      },
      supervisorApproved: activeRole === "doctor",
      supervisorNotes:
        activeRole === "doctor"
          ? "Assessment verified and confirmed by Supervising Vaidya."
          : "Drafted by student. Pending supervisor verification.",
      questionnaireId: "sdm-udupi-standard-24",
      scores: calcResult,
      observations: {
        freeText: freeTextObs,
        ashtavidha,
        nlpIndicators
      },
      answers
    };

    onSaveAssessment(currentPatient.id, newAssessment);
    setCurrentStep(5);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / STANDARD_QUESTIONS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="no-print bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1">
          {[
            { step: 1, label: t.step1Title },
            { step: 2, label: t.step2Title },
            { step: 3, label: t.step3Title },
            { step: 4, label: t.step4Title },
            { step: 5, label: t.step5Title }
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
              1. Patient Profile & Clinical Assessment Context
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Select or confirm patient information, seasonal context (Ritu), and clinical examiner credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Patient Selector */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Active Patient *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50 font-medium"
              >
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.baselinePrakriti}
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment Session Type */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Evaluation Purpose
              </label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Baseline Janma Prakriti">Baseline Janma Prakriti (Primary Constitution)</option>
                <option value="Seasonal Constitutional Review">Seasonal Constitutional Review (Ritucharya)</option>
                <option value="Student Academic Training Case">Student Academic Training Case (Supervised)</option>
              </select>
            </div>

            {/* Current Season (Ritu) */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Current Season (Ritu) - Coastal Karnataka
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Varsha / Sharad (Autumn)">Varsha / Sharad (Monsoon to Autumn)</option>
                <option value="Hemanta / Shishira (Winter)">Hemanta / Shishira (Winter)</option>
                <option value="Vasanta (Spring)">Vasanta (Spring)</option>
                <option value="Grishma (Summer)">Grishma (Summer)</option>
              </select>
            </div>

            {/* Examiner Name */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Examiner / Student Clinician
              </label>
              <input
                type="text"
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* Quick Summary Card of Patient */}
          {currentPatient && (
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Patient Demographic Summary
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-600">
                <div>
                  <span className="text-stone-400 block">Age / Gender:</span>
                  <span className="font-semibold text-stone-800">{currentPatient.age} yrs • {currentPatient.gender}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Location:</span>
                  <span className="font-semibold text-stone-800">{currentPatient.city || "Udupi, Karnataka"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Diet:</span>
                  <span className="font-semibold text-stone-800">{currentPatient.dietType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Prior Assessments:</span>
                  <span className="font-semibold text-emerald-800">{currentPatient.assessments?.length || 0} recorded</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Fill Buttons for Hackathon Jury */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <Wand2 className="w-4 h-4 text-amber-600" />
                <span>Quick Evaluation Demo Presets (For Judges)</span>
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Automatically populate questionnaire and observation notes to test calculation models instantly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAutoFillDemo("vata-pitta")}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Vata-Pitta Case
              </button>
              <button
                type="button"
                onClick={() => handleAutoFillDemo("pitta-kapha")}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Pitta-Kapha Case
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <span>{t.btnNext}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLASSICAL QUESTIONNAIRE */}
      {currentStep === 2 && (
        <div className="space-y-5 max-w-5xl mx-auto">
          {/* Top Control Bar: Categories & Progress */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-16 z-30">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {["All", "Physical", "Physiological", "Psychological"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-emerald-800 text-white font-semibold"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat === "All" ? "All Traits (24)" : cat}
                </button>
              ))}
            </div>

            {/* Answer Progress */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="text-right text-xs">
                <div className="font-semibold text-stone-800">
                  {answeredCount} / {STANDARD_QUESTIONS.length} Answered ({progressPercent}%)
                </div>
                <div className="w-36 h-2 bg-stone-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleAutoFillDemo("vata-pitta")}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
                title="Populate remaining questions with realistic test responses"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {STANDARD_QUESTIONS.filter(
              (q) => activeCategory === "All" || q.dimension === activeCategory
            ).map((q, idx) => {
              const selectedOptId = answers[q.id];
              const isAnswered = Boolean(selectedOptId);

              const questionText = q.question[activeLang] || q.question.en;

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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 uppercase">
                          {q.dimension}
                        </span>
                        <span className="text-[11px] font-serif text-emerald-800 italic">
                          {q.sanskritTrait}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                        {q.id.replace("q", "").split("_")[0]}. {questionText}
                      </h4>
                    </div>

                    <span className="text-[10px] text-stone-400 whitespace-nowrap font-mono">
                      {q.context}
                    </span>
                  </div>

                  {/* 3 Classical Options (Vata, Pitta, Kapha) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      const optText = opt.text[activeLang] || opt.text.en;

                      let borderColor = "border-stone-200 hover:border-stone-300";
                      let bgColor = "bg-white hover:bg-stone-50/50";
                      let badgeColor = "bg-stone-100 text-stone-600";

                      if (isSelected) {
                        if (opt.dosha === "vata") {
                          borderColor = "border-sky-500 ring-2 ring-sky-500/20";
                          bgColor = "bg-sky-50/60";
                          badgeColor = "bg-sky-500 text-white";
                        } else if (opt.dosha === "pitta") {
                          borderColor = "border-amber-500 ring-2 ring-amber-500/20";
                          bgColor = "bg-amber-50/60";
                          badgeColor = "bg-amber-500 text-white";
                        } else {
                          borderColor = "border-emerald-500 ring-2 ring-emerald-500/20";
                          bgColor = "bg-emerald-50/60";
                          badgeColor = "bg-emerald-600 text-white";
                        }
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${borderColor} ${bgColor}`}
                        >
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {optText}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeColor}`}>
                              {opt.dosha}
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
                </div>
              );
            })}
          </div>

          {/* Step 2 Bottom Navigation */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.btnBack}</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <span>{t.btnNext}: Practitioner Observations</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PRACTITIONER OBSERVATIONS & AI/NLP */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
                3. Clinical Observations & AI/NLP Assistant
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Record free-form practitioner notes and direct observations (Darshana, Sparshana, Prashna).
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Innovation Module
            </span>
          </div>

          {/* Free Text Clinical Field with Voice & NLP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 text-xs flex items-center gap-1.5">
                <span>Free-Form Clinical Notes (Practitioner Observations)</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isRecording
                      ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-300"
                  }`}
                  title="Speak notes hands-free"
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-500" />}
                  <span>{isRecording ? "Listening..." : "Dictate"}</span>
                </button>

                {/* AI / NLP Extract Button */}
                <button
                  type="button"
                  onClick={handleRunNlp}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Extract Dosha Cues</span>
                </button>
              </div>
            </div>

            <textarea
              rows="4"
              value={freeTextObs}
              onChange={(e) => setFreeTextObs(e.target.value)}
              placeholder="e.g. Patient exhibits lean body structure, cracked heels, dry hands. Speaks quickly with articulate enthusiasm. Reports erratic appetite and disturbed sleep..."
              className="w-full p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs leading-relaxed bg-stone-50/50"
            />
          </div>

          {/* NLP Extracted Indicators Display */}
          {nlpIndicators.length > 0 && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-stone-800">
                    AI/NLP Extracted Dosha Indicators ({nlpIndicators.length} Cues Detected)
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
                    <strong className="capitalize">{ind.dosha}:</strong>
                    <span>"{ind.matchedPhrase}"</span>
                    <span className="text-[10px] text-stone-400">({ind.guna})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ashtavidha Pariksha Quick Observations */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-stone-800 text-xs">
              Ashtavidha Pariksha (Classical Eightfold Clinical Examination)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">1. Nadi (Pulse)</label>
                <input
                  type="text"
                  value={ashtavidha.nadi}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, nadi: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">2. Jihva (Tongue)</label>
                <input
                  type="text"
                  value={ashtavidha.jihva}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, jihva: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">3. Sparsha (Touch)</label>
                <input
                  type="text"
                  value={ashtavidha.sparsha}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, sparsha: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-500 text-[11px] mb-1">4. Drik (Eyes/Gaze)</label>
                <input
                  type="text"
                  value={ashtavidha.drik}
                  onChange={(e) => setAshtavidha({ ...ashtavidha, drik: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Questionnaire</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <span>Calculate Prakriti & Inspect</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PRAKRITI CALCULATION RESULT */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Classical Synthesis
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif-heading">
                4. Calculated Constitution: {calcResult.dominantPrakriti}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Classification: <strong className="text-stone-800">{calcResult.constitutionType}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowInspector(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Inspect Mathematical Basis</span>
            </button>
          </div>

          {/* Radar Chart & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
              <DoshaRadarChart scores={calcResult} size={270} />
              <div className="text-[11px] text-stone-500 text-center mt-2">
                Equilateral Tri-Dosha Vector Space (Normalized)
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Vata Bar */}
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
                <div className="flex justify-between font-bold text-sky-900 mb-1">
                  <span>Vata (वात): {calcResult.vata}%</span>
                  <span>Air + Ether (Movement & Agility)</span>
                </div>
                <div className="w-full h-2.5 bg-sky-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${calcResult.vata}%` }} />
                </div>
              </div>

              {/* Pitta Bar */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <div className="flex justify-between font-bold text-amber-900 mb-1">
                  <span>Pitta (पित्त): {calcResult.pitta}%</span>
                  <span>Fire + Water (Metabolism & Tejas)</span>
                </div>
                <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${calcResult.pitta}%` }} />
                </div>
              </div>

              {/* Kapha Bar */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex justify-between font-bold text-emerald-900 mb-1">
                  <span>Kapha (कफ): {calcResult.kapha}%</span>
                  <span>Water + Earth (Structure & Stability)</span>
                </div>
                <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${calcResult.kapha}%` }} />
                </div>
              </div>

              {/* Classical Rationale */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 leading-relaxed text-[11px]">
                <strong>Classical Synthesis Rationale:</strong> {calcResult.rationale}
              </div>
            </div>
          </div>

          {/* Subdimensional Analysis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800">
              Dimensional Sub-scores (Sharirika, Kriyatmaka & Manasika)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-800">Physical (Sharirika)</div>
                <div className="text-[11px] text-stone-500 mt-1">
                  V: {calcResult.subScores?.physical?.vata}% • P: {calcResult.subScores?.physical?.pitta}% • K: {calcResult.subScores?.physical?.kapha}%
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-800">Physiological (Kriyatmaka)</div>
                <div className="text-[11px] text-stone-500 mt-1">
                  V: {calcResult.subScores?.physiological?.vata}% • P: {calcResult.subScores?.physiological?.pitta}% • K: {calcResult.subScores?.physiological?.kapha}%
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-800">Psychological (Manasika)</div>
                <div className="text-[11px] text-stone-500 mt-1">
                  V: {calcResult.subScores?.psychological?.vata}% • P: {calcResult.subScores?.psychological?.pitta}% • K: {calcResult.subScores?.psychological?.kapha}%
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Observations</span>
            </button>

            <button
              onClick={handleFinalize}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Finalize & Generate Report</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL REPORTS (DOCTOR DOSSIER & PATIENT SUMMARY) */}
      {currentStep === 5 && (
        <div className="space-y-4">
          {/* Report Mode Switcher Bar */}
          <div className="no-print bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
              >
                <span>{t.printReport}</span>
              </button>

              <button
                onClick={onCancel}
                className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors"
              >
                Exit to Directory
              </button>
            </div>
          </div>

          {/* Render Active Report View */}
          {reportViewMode === "doctor" ? (
            <DoctorReport
              patient={currentPatient}
              assessment={{
                date: new Date().toISOString().slice(0, 10),
                conductedBy: { name: examinerName, role: activeRole },
                supervisorApproved: activeRole === "doctor",
                scores: calcResult,
                observations: { freeText: freeTextObs, ashtavidha, nlpIndicators },
                season
              }}
              activeRole={activeRole}
            />
          ) : (
            <PatientReport
              patient={currentPatient}
              scores={calcResult}
              activeLang={activeLang}
            />
          )}
        </div>
      )}

      {/* Mathematical Basis Inspector Modal */}
      <CalculationInspector
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        calculationResult={calcResult}
      />
    </div>
  );
}
