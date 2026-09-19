import React from "react";
import { Sparkles, Sun, Moon, Utensils, Heart, ShieldAlert, Award } from "lucide-react";
import { DOSHA_PROFILES } from "../../data/samhitaReferences";
import { DoshaProportionBar } from "./DoshaRadarChart";
import { TRANSLATIONS } from "../../data/translations";

export function PatientReport({ patient, scores, activeLang = "en" }) {
  if (!patient || !scores) return null;

  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // Identify dominant doshas
  const primaryDoshaKey = scores.dominantPrakriti.toLowerCase().includes("vata")
    ? "vata"
    : scores.dominantPrakriti.toLowerCase().includes("pitta")
    ? "pitta"
    : "kapha";

  const primaryProfile = DOSHA_PROFILES[primaryDoshaKey] || DOSHA_PROFILES.vata;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-md max-w-4xl mx-auto overflow-hidden">
      {/* Patient Friendly Header */}
      <div className="bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-400 text-stone-900 inline-block mb-2">
              Your Constitutional Profile Summary
            </span>
            <h1 className="text-2xl font-bold font-serif-heading text-white">
              Namaste, {patient.name}
            </h1>
            <p className="text-xs text-emerald-100 mt-1">
              SDM College of Ayurveda, Udupi • Swastha Health & Wellness Guide
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center">
            <span className="text-[11px] text-emerald-200 block uppercase tracking-wide">
              Your Constitution (Prakriti)
            </span>
            <div className="text-xl font-extrabold text-amber-300 font-serif-heading">
              {scores.dominantPrakriti}
            </div>
            <span className="text-[10px] text-emerald-100">
              {scores.constitutionType}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-800">
        {/* Visual Balance Bar */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span>Your Constitutional Balance</span>
            <span className="text-stone-500 font-normal">
              Vata: {scores.vata}% • Pitta: {scores.pitta}% • Kapha: {scores.kapha}%
            </span>
          </div>
          <DoshaProportionBar scores={scores} className="h-3" />
        </div>

        {/* What This Means For You */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Natural Strengths & Talents</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {primaryProfile.strengths}
            </p>
          </div>

          <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Heart className="w-4 h-4 text-amber-700" />
              <span>Areas of Natural Sensitivity</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {primaryProfile.vulnerabilities}
            </p>
          </div>
        </div>

        {/* Daily Dinacharya & Lifestyle Guidance */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 font-serif-heading flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t.dinacharyaHeading}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {primaryProfile.dinacharyaTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-stone-700 text-xs leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Non-Diagnostic Warning */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs">Important Health & Ethics Notice</h4>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              {t.ethicalDisclaimerDetailed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
