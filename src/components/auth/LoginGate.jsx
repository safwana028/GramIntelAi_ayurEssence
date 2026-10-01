import React, { useState } from "react";
import {
  Stethoscope,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import { TRANSLATIONS } from "../../data/translations";
import { CLINICAL_ACCOUNTS, api } from "../../services/apiService";

export function LoginGate({ onSelectPortal, activeLang = "en", onLangChange }) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const [loadingRole, setLoadingRole] = useState(null);
  const [loginError, setLoginError] = useState("");

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

            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("doctor")}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "doctor" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Doctor`}</span>
                <ArrowRight className="w-4 h-4" />
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
                  <span>24-Question classical SDM Udupi Prakriti examination</span>
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

            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("student")}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "student" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Scholar`}</span>
                <ArrowRight className="w-4 h-4" />
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

            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={loadingRole !== null}
                onClick={() => handlePortalEnter("patient")}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loadingRole === "patient" ? "Connecting..." : `${t.quickLogin || "Quick Access"} — Patient`}</span>
                <ArrowRight className="w-4 h-4" />
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
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-emerald-800/60 text-center text-xs text-emerald-300/80 space-y-1">
        <p className="font-semibold text-emerald-200">
          SDM College of Ayurveda & Hospital, Udupi • SMVITM Bantakal Academic Calibration
        </p>
        <p className="text-[11px] text-emerald-400/70">
          Charaka Samhita Vimana 8 • Sushruta Samhita Sharira 4 • Ashtanga Hridaya Sharira 3
        </p>
      </footer>
    </div>
  );
}
