import React from "react";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  Sparkles,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Activity,
  CheckCircle2,
  Mic,
  Layers,
  FileText
} from "lucide-react";

export function LandingPage({
  onSelectRoleAndNavigate,
  onOpenMethodology,
  onOpenAuth,
  currentUser,
  activeRole = "doctor"
}) {
  return (
    <div className="space-y-12 pb-16">
      {/* Institutional Top Trust Bar */}
      <div className="bg-gradient-to-r from-[#122A22] via-[#1B4D3E] to-[#122A22] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                SDM Ayurveda & SMVITM
              </span>
              <span className="text-xs text-emerald-200 hidden sm:inline">•</span>
              <span className="text-xs text-emerald-200/90 font-medium hidden sm:inline">
                Academic & Clinical Research Calibration
              </span>
            </div>
            <p className="text-xs text-stone-200 mt-0.5">
              SDM College of Ayurveda, Udupi & Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenMethodology}
            icon={BookOpen}
            className="bg-emerald-950/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-900/80 text-xs min-h-[38px]"
          >
            Samhita Methodology
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={onOpenAuth}
            className="text-xs min-h-[38px]"
          >
            {activeRole === "patient" ? "Patient Profile" : "Clinician Profile"}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#183E32] to-[#112D24] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-800/80 shadow-xl">
        {/* Subtle Background Radial Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TridoshaLab • Precision Ayurvedic Intelligence</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif-heading text-white leading-tight">
              Evidence-Based <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                Deha Prakriti Assessment
              </span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans max-w-2xl">
              An intelligent, classical Ayurvedic clinical platform calibrated to the treatises of 
              <strong className="text-amber-200"> Charaka, Sushruta, and Vagbhata</strong>. 
              Engineered for supervising Vaidyas and BAMS scholars conducting institutional Prakriti Pariksha with deterministic Largest Remainder calculations.
            </p>
          </div>

          {/* Role-Isolated Portal Entry CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {activeRole === "patient" ? (
              <>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("patient", "assessment")}
                  icon={Sparkles}
                  className="min-h-[44px] shadow-lg shadow-amber-950/20"
                >
                  Start Self-Assessment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("patient", "dashboard")}
                  icon={ArrowRight}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 min-h-[44px]"
                >
                  Return to Patient Dashboard
                </Button>
              </>
            ) : activeRole === "student" ? (
              <>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("student", "assessment")}
                  icon={Sparkles}
                  className="min-h-[44px] shadow-lg shadow-amber-950/20"
                >
                  Start Prakriti Pariksha
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("student", "dashboard")}
                  icon={GraduationCap}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 min-h-[44px]"
                >
                  Scholar Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("doctor", "dashboard")}
                  icon={Stethoscope}
                  className="min-h-[44px] shadow-lg shadow-amber-950/20"
                >
                  Clinical Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onSelectRoleAndNavigate("doctor", "assessment")}
                  icon={Sparkles}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 min-h-[44px]"
                >
                  Assess Prakriti
                </Button>
              </>
            )}
          </div>

          {/* Key Assurance Indicators */}
          <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-200/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Janma Prakriti vs Vikriti Separation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Deterministic Tri-Dosha Geometry (100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Strict Non-Diagnostic Scope</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Platform Pillars Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="neutral" size="sm">
            Core Architecture
          </Badge>
          <h2 className="text-2xl font-bold font-serif-heading text-stone-900">
            Bridging Ancient Samhitas & Modern Clinical Rigor
          </h2>
          <p className="text-xs text-stone-500">
            Calibrated specifically to institutional standards with verifiable academic authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 24 Standard Parameters */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-heading">
              Classical 24-Trait Pariksha
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Standardized questionnaire mapped across Physical, Physiological, and Psychological dimensions with per-question Vaidya notes and Kannada/Hindi localization.
            </p>
          </div>

          {/* Card 2: Doctor Voice Dictation */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-heading">
              Doctor Voice Dictation & STT
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hands-free clinical speech-to-text with Indian English accent tuning, real-time interim streaming, and manual Vaidya editing beside observation fields.
            </p>
          </div>

          {/* Card 3: Senior Vaidya Verification */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif-heading">
              Hierarchical Review Queue
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Multi-tiered clinical verification ensuring student scholar assessments remain in draft state until formally evaluated and signed off by a Supervising Vaidya.
            </p>
          </div>
        </div>
      </div>

      {/* Classical Samhita Shloka Inscription */}
      <div className="bg-[#FAF8F5] border-2 border-dashed border-amber-300/80 rounded-2xl p-6 sm:p-8 text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-widest">
          Sushruta Samhita • Sutrasthana 15:41
        </span>
        <blockquote className="font-serif italic text-base sm:text-lg text-emerald-950 leading-relaxed">
          "समदोषः समाग्निश्च समधातुमलक्रियः।<br />
          प्रसन्नात्मेन्द्रियमनाಃ स्वस्थ ಇತ್ಯಭಿಧೀಯತೇ॥"
        </blockquote>
        <p className="text-xs text-stone-600 max-w-xl mx-auto">
          "One whose Doshas (metabolic humors), Agni (digestive fire), Dhatus (tissues), and Malas (excretory functions) are in balance, and whose Soul, Senses, and Mind are serene, is termed Healthy (Swastha)."
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
