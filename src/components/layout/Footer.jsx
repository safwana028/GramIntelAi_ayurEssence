import React from "react";
import { Download, RefreshCw, ShieldAlert, Award } from "lucide-react";
import { exportFullDataBackup, resetToDefaults } from "../../services/storageService";

export function Footer({ onResetData }) {
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data back to the default sample dataset for demonstration?")) {
      resetToDefaults();
      if (onResetData) onResetData();
      window.location.reload();
    }
  };

  return (
    <footer className="no-print bg-[#132820] text-stone-300 border-t border-emerald-900/60 mt-12 py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-emerald-900/50">
          {/* Col 1: Institutional Attribution */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200 tracking-wide">
                HPL 2026 • PS 01 AyurEssence
              </h4>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Developed for Round 2 Live Competitive Prototyping at <strong className="text-stone-200">Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal</strong> in association with <strong className="text-stone-200">Code Troopers</strong>.
            </p>
            <p className="text-stone-400 mt-1 text-[11px]">
              Official Problem Sponsor: <strong className="text-amber-300">SDM College of Ayurveda, Udupi</strong> (Kuthpady, Karnataka).
            </p>
          </div>

          {/* Col 2: Classical Philosophy */}
          <div className="bg-[#0C1B15] p-3 rounded-lg border border-emerald-900/40">
            <div className="text-[11px] font-semibold text-emerald-300 mb-1">
              Classical Definition of Health (Swastha Lakshana)
            </div>
            <p className="font-serif italic text-amber-200/90 text-xs">
              "समदोषः समाग्निश्च समधातुमलक्रियः।<br />
              प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥"
            </p>
            <p className="text-[10px] text-stone-400 mt-1">
              — Sushruta Samhita, Sutrasthana 15:41 (Equilibrium of Dosha, Agni, Dhatu, and Mala with a serene soul and mind).
            </p>
          </div>

          {/* Col 3: Ethical Boundaries & Data Controls */}
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 mb-1.5 font-semibold text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Strict Ayurvedic Non-Diagnostic Scope</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              This platform digitally evaluates physiological Prakriti (constitutional tendencies) only. It explicitly does not diagnose diseases, prescribe medication, or replace a Vaidya's clinical decision.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={exportFullDataBackup}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/40 text-[11px] transition-colors"
                title="Download full database as JSON"
              >
                <Download className="w-3 h-3" />
                <span>Backup Data (JSON)</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800/60 hover:bg-stone-700 text-stone-300 border border-stone-700 text-[11px] transition-colors"
                title="Reset sample patients and questionnaires to initial demo state"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2">
          <div>
            © 2026 AyurEssence Platform. Built for SDMCA Udupi & SMVITM Hackathon Premier League.
          </div>
          <div className="flex items-center gap-3">
            <span>Charaka Samhita</span>
            <span>•</span>
            <span>Sushruta Samhita</span>
            <span>•</span>
            <span>Ashtanga Hridaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
