import React from "react";
import { UserCheck, GraduationCap, User, Globe, Stethoscope, Sparkles, BookOpen, Layers, History, Activity } from "lucide-react";
import { TRANSLATIONS } from "../../data/translations";

export function Header({
  activeRole,
  onRoleChange,
  activeLang,
  onLangChange,
  activeTab,
  onTabChange,
  onOpenMethodology
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  return (
    <header className="no-print bg-gradient-to-b from-[#1E4D3E] to-[#16382D] text-white shadow-lg sticky top-0 z-40">
      {/* Top Notification Bar: Sponsor & Ethical Compliance */}
      <div className="bg-[#122A22] border-b border-emerald-900/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="font-semibold text-amber-400 tracking-wide uppercase text-[11px]">HPL 2026 - PS 01</span>
            <span className="text-emerald-500">•</span>
            <span className="font-medium">SDM College of Ayurveda, Udupi & SMVITM Bantakal</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300/80 text-[11px] italic">
            <span>{t.disclaimerBar}</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange("patients")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 shadow-md ring-2 ring-amber-300/40">
            <Sparkles className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-amber-100 font-serif-heading">
                {t.appTitle}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 rounded-full">
                v2.4 Clinician Pro
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Role Switcher, Language Switcher, Reference Modal */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Methodology Button */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/50 transition-colors"
            title="View Charaka, Sushruta & Ashtanga Hridaya References"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navMethodology}</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-[#122A22] rounded-lg p-0.5 border border-emerald-800/80 text-xs shadow-inner">
            <button
              onClick={() => onRoleChange("doctor")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                activeRole === "doctor"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
              title="Doctor: Full clinical authorization, supervisor approval, clinical PDF dossier"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t.roleDoctor}</span>
            </button>

            <button
              onClick={() => onRoleChange("student")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                activeRole === "student"
                  ? "bg-sky-500 text-white shadow-sm font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
              title="Student: Supervised assessment workflow with teacher review"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t.roleStudent}</span>
            </button>

            <button
              onClick={() => onRoleChange("patient")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                activeRole === "patient"
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-emerald-200 hover:text-white"
              }`}
              title="Patient: Simplified constitutional summary & non-diagnostic lifestyle guidance"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.rolePatient}</span>
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#122A22] rounded-lg p-0.5 border border-emerald-800/80 text-xs">
            <div className="px-1.5 text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => onLangChange("en")}
              className={`px-2 py-1 rounded-md font-medium text-xs transition-all ${
                activeLang === "en" ? "bg-emerald-700 text-white font-bold" : "text-emerald-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLangChange("kn")}
              className={`px-2 py-1 rounded-md font-medium text-xs transition-all font-kannada ${
                activeLang === "kn" ? "bg-emerald-700 text-white font-bold" : "text-emerald-300 hover:text-white"
              }`}
              title="ಕನ್ನಡ (Kannada - Udupi regional language)"
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => onLangChange("hi")}
              className={`px-2 py-1 rounded-md font-medium text-xs transition-all ${
                activeLang === "hi" ? "bg-emerald-700 text-white font-bold" : "text-emerald-300 hover:text-white"
              }`}
              title="हिंदी (Hindi)"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#183E32] border-t border-emerald-800/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => onTabChange("patients")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "patients"
                ? "bg-[#FAF8F5] text-emerald-950 shadow"
                : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.navPatients}</span>
          </button>

          <button
            onClick={() => onTabChange("assessment")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "assessment"
                ? "bg-[#FAF8F5] text-emerald-950 shadow"
                : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navNewAssessment}</span>
          </button>

          <button
            onClick={() => onTabChange("scanner")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "scanner"
                ? "bg-[#FAF8F5] text-emerald-950 shadow"
                : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navScanner || "AI Body Scanner"}</span>
          </button>

          <button
            onClick={() => onTabChange("history")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "history"
                ? "bg-[#FAF8F5] text-emerald-950 shadow"
                : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.navHistory}</span>
          </button>

          <button
            onClick={() => onTabChange("builder")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "builder"
                ? "bg-[#FAF8F5] text-emerald-950 shadow"
                : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.navBuilder}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
