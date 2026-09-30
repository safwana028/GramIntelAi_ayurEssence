import React, { useState } from "react";
import {
  Settings,
  Globe,
  Printer,
  ShieldAlert,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileCheck
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { resetToDefaults } from "../../services/storageService";

export function SettingsView({
  activeLang,
  onLangChange,
  serverOnline,
  onResetData
}) {
  const [autoSaveInterval, setAutoSaveInterval] = useState("60");
  const [includeSanskritVerses, setIncludeSanskritVerses] = useState(true);
  const [scannerResolution, setScannerResolution] = useState("standard");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExecuteReset = () => {
    resetToDefaults();
    if (onResetData) onResetData();
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" size="sm">
              System Configuration
            </Badge>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-500 font-medium">TridoshaLab Platform Preferences</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-stone-900">
            Clinical Platform Settings
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Configure regional dialects, dossier printing layout, doctor voice dictation options, and demonstration database resets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {serverOnline ? (
            <Badge variant="success" size="md" dot>
              REST Server Online
            </Badge>
          ) : (
            <Badge variant="neutral" size="md" dot>
              Resilient Offline Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Section 1: Regional & Dialect Language */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Globe className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 font-serif-heading">
                Language & Regional Localization
              </h2>
              <p className="text-[11px] text-stone-500">
                Calibrate terminology to local patients and clinical scholars in Karnataka and pan-India.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onLangChange("en")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeLang === "en"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-2xs ring-2 ring-emerald-600/20 font-bold"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="font-bold text-xs text-stone-900">English (Clinical)</div>
              <div className="text-[10px] text-stone-500 mt-1">Standard medical & academic English</div>
            </button>

            <button
              type="button"
              onClick={() => onLangChange("kn")}
              className={`p-4 rounded-2xl border text-left transition-all font-kannada ${
                activeLang === "kn"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-2xs ring-2 ring-emerald-600/20 font-bold"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="font-bold text-xs text-stone-900">ಕನ್ನಡ (Kannada)</div>
              <div className="text-[10px] text-stone-500 mt-1">Regional coastal Karnataka language</div>
            </button>

            <button
              type="button"
              onClick={() => onLangChange("hi")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeLang === "hi"
                  ? "border-emerald-600 bg-emerald-50/70 shadow-2xs ring-2 ring-emerald-600/20 font-bold"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="font-bold text-xs text-stone-900">हिंदी (Hindi)</div>
              <div className="text-[10px] text-stone-500 mt-1">Devanagari Sanskrit-aligned terms</div>
            </button>
          </div>
        </div>

        {/* Section 2: Clinical Dossier Print Layout */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Printer className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 font-serif-heading">
                Clinical Dossier & Print Options
              </h2>
              <p className="text-[11px] text-stone-500">
                Adjust how Deha Prakriti Pariksha reports are generated for hospital records and patient discharge.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
              <div>
                <span className="font-bold text-stone-800 block">
                  Include Sanskrit Shloka References
                </span>
                <span className="text-[11px] text-stone-500">
                  Embed Charaka & Sushruta Samhita verses with English translations on final PDF dossier.
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeSanskritVerses}
                onChange={(e) => setIncludeSanskritVerses(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
              />
            </label>

            <div className="p-3 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-stone-800 block">
                  Assessment Auto-Save Interval
                </span>
                <span className="text-[11px] text-stone-500">
                  Automatically save in-progress questionnaire drafts to local resilient cache.
                </span>
              </div>
              <select
                value={autoSaveInterval}
                onChange={(e) => setAutoSaveInterval(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-800"
              >
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
                <option value="120">Every 2 minutes</option>
                <option value="0">Manual save only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Reset Demonstration Dataset */}
        <div className="bg-rose-50/50 rounded-3xl border border-rose-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
            <ShieldAlert className="w-5 h-5 text-rose-700" />
            <div>
              <h2 className="text-sm font-bold text-rose-950 font-serif-heading">
                Reset Demo Patient Records
              </h2>
              <p className="text-[11px] text-rose-800/90">
                Restore pre-seeded SDM College of Ayurveda clinical trial profiles for evaluators.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-rose-900 leading-relaxed max-w-lg">
              Resetting returns the database to the 3 default SDM patients (Sudhir Kamath, Sneha Hegde, Dr. Ananya) and refreshes demo assessments. All custom questionnaires and edits will be returned to initial competition prototype defaults.
            </p>

            <Button
              variant="danger"
              size="sm"
              icon={RefreshCw}
              onClick={() => setShowResetConfirm(true)}
              className="shrink-0"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                Reset Demo Database?
              </h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to restore initial demo records? This will reload the browser and reset local modifications.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleExecuteReset}
                className="flex-1"
              >
                Yes, Reset Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsView;
