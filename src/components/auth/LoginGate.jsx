import React, { useState } from "react";
import {
  Stethoscope,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Calendar,
  FileText
} from "lucide-react";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import { TRANSLATIONS } from "../../data/translations";
import { CLINICAL_ACCOUNTS, api } from "../../services/apiService";

export function LoginGate({ onSelectPortal, activeLang = "en", onLangChange }) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const [loadingRole, setLoadingRole] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [detailModalRole, setDetailModalRole] = useState(null);

  // Form states for Doctor
  const [doctorName, setDoctorName] = useState("Dr. K. Raghavendra Rao");
  const [doctorEmail, setDoctorEmail] = useState("dr.rao@sdm.ac.in");
  const [doctorTitle, setDoctorTitle] = useState("Senior Vaidya & Professor");
  const [doctorRegNo, setDoctorRegNo] = useState("AYUR-KA-2026-9812");
  const [doctorInstitution, setDoctorInstitution] = useState("SDM College of Ayurveda, Udupi");

  // Form states for Student
  const [studentName, setStudentName] = useState("Arjun Shenoy");
  const [studentEmail, setStudentEmail] = useState("arjun.scholar@sdm.ac.in");
  const [studentInstitution, setStudentInstitution] = useState("SDM College of Ayurveda, Udupi");
  const [studentYear, setStudentYear] = useState("Final Year BAMS Resident");

  // Form states for Patient
  const [patientName, setPatientName] = useState("Sneha Bhat");
  const [patientAge, setPatientAge] = useState("28");
  const [patientGender, setPatientGender] = useState("Female");
  const [patientPhone, setPatientPhone] = useState("+91 98765 43210");
  const [patientEmail, setPatientEmail] = useState("sneha.bhat@example.com");
  const [patientCity, setPatientCity] = useState("Udupi, Karnataka");
  const [patientDiet, setPatientDiet] = useState("Vegetarian");
  const [patientComplaint, setPatientComplaint] = useState("Constitutional Health Evaluation & Sleep Optimization");

  const handlePortalEnter = async (role) => {
    setLoadingRole(role);
    setLoginError("");

    const defaultAccount = CLINICAL_ACCOUNTS[role];
    if (role === "patient") {
      // Patient portal direct access
      onSelectPortal(defaultAccount);
      setLoadingRole(null);
      return;
    }

    const passwordMap = {
      doctor: "Doctor@123",
      student: "Student@123"
    };

    try {
      const res = await api.login(defaultAccount.email, passwordMap[role]);
      if (res.ok && res.data?.user) {
        onSelectPortal(res.data.user);
      } else {
        // Resilient fallback for standalone offline mode
        onSelectPortal(defaultAccount);
      }
    } catch {
      onSelectPortal(defaultAccount);
    } finally {
      setLoadingRole(null);
    }
  };

  const handleSubmitDoctor = (e) => {
    e.preventDefault();
    const user = {
      name: doctorName.trim() || "Dr. K. Raghavendra Rao",
      email: doctorEmail.trim() || "dr.rao@sdm.ac.in",
      role: "doctor",
      title: doctorTitle.trim() || "Senior Vaidya & Professor",
      regNo: doctorRegNo.trim() || "AYUR-KA-2026-9812",
      institution: doctorInstitution.trim() || "SDM College of Ayurveda, Udupi"
    };
    setDetailModalRole(null);
    onSelectPortal(user);
  };

  const handleSubmitStudent = (e) => {
    e.preventDefault();
    const user = {
      name: studentName.trim() || "Arjun Shenoy",
      email: studentEmail.trim() || "arjun.scholar@sdm.ac.in",
      role: "student",
      institution: studentInstitution.trim() || "SDM College of Ayurveda, Udupi",
      year: studentYear.trim() || "Final Year BAMS Resident"
    };
    setDetailModalRole(null);
    onSelectPortal(user);
  };

  const handleSubmitPatient = (e) => {
    e.preventDefault();
    const patientId = `PAT-${Date.now().toString(36).toUpperCase()}`;
    const newPatientRecord = {
      id: patientId,
      name: patientName.trim() || "Sneha Bhat",
      age: parseInt(patientAge, 10) || 28,
      gender: patientGender || "Female",
      phone: patientPhone.trim() || "+91 98765 43210",
      email: patientEmail.trim() || "patient@ayuressence.in",
      city: patientCity.trim() || "Udupi, Karnataka",
      diet: patientDiet || "Vegetarian",
      primaryComplaint: patientComplaint.trim() || "Constitutional Health & Regimen Assessment",
      baselinePrakriti: "Pending Assessment",
      assessments: []
    };
    const user = {
      id: patientId,
      patientId: patientId,
      name: newPatientRecord.name,
      email: newPatientRecord.email,
      role: "patient",
      phone: newPatientRecord.phone,
      age: newPatientRecord.age,
      gender: newPatientRecord.gender,
      city: newPatientRecord.city
    };
    setDetailModalRole(null);
    onSelectPortal(user, newPatientRecord);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2D23] via-[#164235] to-[#0A1F18] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased">
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 pb-6 border-b border-emerald-800/60">
        <TridoshaLabLogo variant="horizontal" size="md" light={true} />

        {/* Trilingual Selector */}
        <div className="flex items-center gap-1 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs">
          <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLang === "en"
                ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLangChange("kn")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all font-kannada ${
              activeLang === "kn"
                ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            type="button"
            onClick={() => onLangChange("hi")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLang === "hi"
                ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            हिंदी
          </button>
        </div>
      </header>

      {/* Main Portal Selection Area */}
      <main className="max-w-5xl w-full mx-auto my-auto py-10 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/90 border border-emerald-600/70 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sponsorHeader || "SDM College of Ayurveda, Udupi & SMVITM Bantakal"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading text-white tracking-tight">
            {t.selectDoctorOrStudent || "Select Clinical Portal"}
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t.appSubtitle || "Intelligent Ayurvedic Deha Prakriti Assessment Platform"} • SDM College of Ayurveda & Hospital, Udupi
          </p>
        </div>

        {/* Portal Entry Cards: 3 Columns (Doctor, Student, Patient) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* CARD 1: DOCTOR PORTAL */}
          <div className="relative group bg-gradient-to-b from-[#1E4D3E]/90 to-[#12352A]/90 hover:from-[#245D4B] hover:to-[#173F32] rounded-3xl p-6 sm:p-7 border-2 border-emerald-600/50 hover:border-amber-400 transition-all duration-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wide">
                  {t.roleDoctor || "Doctor (Senior Vaidya)"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold font-serif-heading text-white">
                  {t.roleDoctor || "Doctor (Senior Vaidya)"}
                </h2>
                <span className="text-xs text-amber-300 font-medium block mt-0.5">
                  Institutional Supervising Clinician
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {t.loginDoctorDesc || "Access Senior Vaidya Dashboard, Review Scholar Drafts & Finalize Records"}
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Review student & patient submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Clinical dossier finalization (Audit locked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dinacharya & Ahara guidance delivery</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("doctor")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "doctor" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Doctor`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDetailModalRole("doctor")}
                className="w-full py-2.5 px-3 rounded-xl border border-amber-400/50 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t.enterDoctorDetails || "Enter Doctor Details & Sign In"}</span>
              </button>
            </div>
          </div>

          {/* CARD 2: STUDENT SCHOLAR PORTAL */}
          <div className="relative group bg-gradient-to-b from-[#194034]/90 to-[#0F2D23]/90 hover:from-[#1F4E40] hover:to-[#14392D] rounded-3xl p-6 sm:p-7 border-2 border-sky-600/50 hover:border-sky-400 transition-all duration-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-sky-400/20 text-sky-300 border border-sky-400/40 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-400 text-stone-950 uppercase tracking-wide">
                  {t.roleStudent || "Ayurveda Scholar (Student)"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold font-serif-heading text-white">
                  {t.roleStudent || "Ayurveda Scholar (Student)"}
                </h2>
                <span className="text-xs text-sky-300 font-medium block mt-0.5">
                  BAMS Clinical Training Case Evaluation
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {t.loginStudentDesc || "Conduct 24-Trait Assessments & Submit Drafts for Supervisor Approval"}
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>24-Question classical SDM Udupi examination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Multi-trait & dual dosha selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Submission to Doctor Review Queue</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("student")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "student" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Scholar`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDetailModalRole("student")}
                className="w-full py-2.5 px-3 rounded-xl border border-sky-400/50 bg-sky-950/40 hover:bg-sky-900/60 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t.enterStudentDetails || "Enter Scholar Details & Sign In"}</span>
              </button>
            </div>
          </div>

          {/* CARD 3: PATIENT SWASTHA PORTAL */}
          <div className="relative group bg-gradient-to-b from-[#143B30]/90 to-[#0A241C]/90 hover:from-[#194538] hover:to-[#0D2D23] rounded-3xl p-6 sm:p-7 border-2 border-teal-500/50 hover:border-emerald-400 transition-all duration-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-400 text-stone-950 uppercase tracking-wide">
                  {t.rolePatient || "Patient (Swastha Pariksha)"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold font-serif-heading text-white">
                  {t.rolePatient || "Patient (Swastha Pariksha)"}
                </h2>
                <span className="text-xs text-emerald-300 font-medium block mt-0.5">
                  Constitutional Self-Assessment
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {t.loginPatientDesc || "Take 24-Trait Self-Assessment & View Doctor-Approved Wellness Plan"}
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24-Question self-evaluation of physical & mental traits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Directly saved to Doctor draft for clinical sign-off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>View personalized diet (Ahara) & Dinacharya regimen</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("patient")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "patient" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Patient`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDetailModalRole("patient")}
                className="w-full py-2.5 px-3 rounded-xl border border-emerald-400/50 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t.enterPatientDetails || "Enter Patient Details & Create Account"}</span>
              </button>
            </div>
          </div>
        </div>

        {loginError && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-rose-900/80 border border-rose-500 text-rose-200 text-xs text-center font-medium">
            {loginError}
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-emerald-800/60 text-center text-xs text-emerald-300/80 space-y-1">
        <p className="font-semibold text-emerald-200">
          SDM College of Ayurveda & Hospital, Udupi • SMVITM Bantakal Academic Calibration
        </p>
        <p className="text-[11px] text-emerald-400/70">
          Charaka Samhita Vimana 8 • Sushruta Samhita Sharira 4 • Ashtanga Hridaya Sharira 3
        </p>
      </footer>

      {/* ======================================================== */}
      {/* STRICT DOMAIN-ISOLATED DETAIL MODAL                      */}
      {/* ONLY asks for and displays the chosen domain's fields     */}
      {/* ======================================================== */}
      {detailModalRole && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF8F5] text-stone-900 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className={`p-6 text-white relative ${
              detailModalRole === "doctor"
                ? "bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B]"
                : detailModalRole === "student"
                ? "bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F2D6B]"
                : "bg-gradient-to-r from-[#143B30] via-[#1E4D3E] to-[#0A241C]"
            }`}>
              <button
                type="button"
                onClick={() => setDetailModalRole(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  {detailModalRole === "doctor" && <Stethoscope className="w-5 h-5 text-amber-300" />}
                  {detailModalRole === "student" && <GraduationCap className="w-5 h-5 text-sky-300" />}
                  {detailModalRole === "patient" && <HeartHandshake className="w-5 h-5 text-emerald-300" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {detailModalRole === "doctor" && (t.roleDoctor || "Doctor Domain")}
                    {detailModalRole === "student" && (t.roleStudent || "Scholar Domain")}
                    {detailModalRole === "patient" && (t.rolePatient || "Patient Domain")}
                  </span>
                  <h3 className="text-xl font-bold font-serif-heading text-white">
                    {detailModalRole === "doctor" && (t.enterDoctorDetails || "Enter Doctor Details & Sign In")}
                    {detailModalRole === "student" && (t.enterStudentDetails || "Enter Scholar Details & Sign In")}
                    {detailModalRole === "patient" && (t.createPatientAccount || "Create Patient Swastha Account")}
                  </h3>
                </div>
              </div>
            </div>

            {/* DOCTOR DETAILS FORM */}
            {detailModalRole === "doctor" && (
              <form onSubmit={handleSubmitDoctor} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Doctor Full Name & Title <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. K. Raghavendra Rao"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Clinical Email <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      placeholder="dr.rao@sdm.ac.in"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Clinical Designation / Title
                    </label>
                    <input
                      type="text"
                      value={doctorTitle}
                      onChange={(e) => setDoctorTitle(e.target.value)}
                      placeholder="Senior Vaidya & Professor"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.doctorRegNo || "Registration / Seal No"}
                    </label>
                    <input
                      type="text"
                      value={doctorRegNo}
                      onChange={(e) => setDoctorRegNo(e.target.value)}
                      placeholder="AYUR-KA-2026-9812"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.institutionLabel || "Hospital / Institution"}
                  </label>
                  <input
                    type="text"
                    value={doctorInstitution}
                    onChange={(e) => setDoctorInstitution(e.target.value)}
                    placeholder="SDM College of Ayurveda & Hospital, Udupi"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDetailModalRole(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                  >
                    {t.cancelBtn || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t.saveDoctorDetails || "Sign In as Doctor"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* SCHOLAR / STUDENT DETAILS FORM */}
            {detailModalRole === "student" && (
              <form onSubmit={handleSubmitStudent} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Scholar Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Arjun Shenoy"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Academic Email <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="arjun.scholar@sdm.ac.in"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.scholarYear || "BAMS Academic Year"}
                    </label>
                    <input
                      type="text"
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      placeholder="Final Year BAMS Resident"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.institutionLabel || "College / University"}
                    </label>
                    <input
                      type="text"
                      value={studentInstitution}
                      onChange={(e) => setStudentInstitution(e.target.value)}
                      placeholder="SDM College of Ayurveda, Udupi"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDetailModalRole(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                  >
                    {t.cancelBtn || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t.saveStudentDetails || "Sign In as Scholar"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* PATIENT DETAILS & CREATE ACCOUNT FORM */}
            {detailModalRole === "patient" && (
              <form onSubmit={handleSubmitPatient} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Patient Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Sneha Bhat"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Age (Years) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="28"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Gender <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-stone-800"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.phoneLabel || "Phone Number"} <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Registered Email <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="sneha.bhat@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.cityLabel || "City / Location"}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={patientCity}
                        onChange={(e) => setPatientCity(e.target.value)}
                        placeholder="Udupi, Karnataka"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t.dietLabel || "Dietary Lifestyle (Ahara)"}
                    </label>
                    <select
                      value={patientDiet}
                      onChange={(e) => setPatientDiet(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-stone-800"
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t.complaintLabel || "Primary Health Concern / Goals"}
                  </label>
                  <input
                    type="text"
                    value={patientComplaint}
                    onChange={(e) => setPatientComplaint(e.target.value)}
                    placeholder="e.g. Constitutional Prakriti Evaluation, sleep balance, digestion"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDetailModalRole(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                  >
                    {t.cancelBtn || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t.savePatientDetails || "Create Account & Enter Swastha Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginGate;
