import React, { useState, useEffect } from "react";
import {
  Sparkles, Activity, ShieldAlert, CheckCircle2, AlertTriangle,
  Play, RotateCw, HeartPulse, Stethoscope, ChevronRight, Layers,
  Pill, Leaf, Utensils, Info, Check
} from "lucide-react";
import { ANATOMICAL_ZONES } from "../../data/bodyScanVulnerabilityData";

export function AnatomicalBodyScanner({
  patient,
  allPatients,
  onSelectPatient,
  onSaveToPatient
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(patient?.id || allPatients[0]?.id || "");
  const currentPatient = allPatients.find(p => p.id === selectedPatientId) || patient || allPatients[0];

  const latestAssessment = currentPatient?.assessments?.[currentPatient.assessments.length - 1];
  const scores = latestAssessment?.scores || { vata: 45, pitta: 38, kapha: 17, dominantPrakriti: "Vata-Pitta" };

  // Scanner Animation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState("Ready to initiate anatomical scan");
  const [scanCompleted, setScanCompleted] = useState(false);

  // Selected Zone for Detail Inspection
  const [activeZoneId, setActiveZoneId] = useState("zone_abdomen");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Determine dominant dosha for a zone
  const getDominantDoshaForPatient = () => {
    const v = scores.vata || 33;
    const p = scores.pitta || 33;
    const k = scores.kapha || 33;
    if (v >= p && v >= k) return "vata";
    if (p >= v && p >= k) return "pitta";
    return "kapha";
  };

  const dominantDosha = getDominantDoshaForPatient();

  // Run Animated Scan
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanCompleted(false);
    setSavedSuccess(false);

    const steps = [
      { p: 15, msg: "Aligning multi-spectral anatomical sensors with patient constitution...", zone: "zone_head" },
      { p: 35, msg: "Scanning Shiras (Cranial) & Pranavaha Srotas...", zone: "zone_head" },
      { p: 55, msg: "Analyzing Uras (Cardiorespiratory) & Rasavaha channels...", zone: "zone_chest" },
      { p: 75, msg: "Evaluating Amashaya-Grahani metabolic Agni core...", zone: "zone_abdomen" },
      { p: 90, msg: "Mapping Sandhi (Joints), Asthi, & Twak micro-circulation...", zone: "zone_joints" },
      { p: 100, msg: "Scan complete. Synthesizing classical herbal balancers (Dravya)...", zone: "zone_abdomen" }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const cur = steps[stepIndex];
        setScanProgress(cur.p);
        setScanStatusMessage(cur.msg);
        setActiveZoneId(cur.zone);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanCompleted(true);
      }
    }, 700);
  };

  const activeZone = ANATOMICAL_ZONES.find(z => z.id === activeZoneId) || ANATOMICAL_ZONES[2];
  const vulnerability = activeZone.vulnerabilities[dominantDosha];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-stone-900 font-serif-heading">
              AI Anatomical Body Scanner & Srotas Vulnerability Predictor
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              AI Innovation
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Non-invasive anatomical inspection (Darshana Pariksha) mapping physiological vulnerability (Kha-Vaigunya) to classical herbal balancers.
          </p>
        </div>

        {/* Patient Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setScanCompleted(false);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-semibold"
          >
            {allPatients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.baselinePrakriti})
              </option>
            ))}
          </select>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all whitespace-nowrap ${
              isScanning
                ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white"
            }`}
          >
            {isScanning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning {scanProgress}%...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-300" />
                <span>Initiate AI Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Body Scanner (Left) & Vulnerability & Herbal Balancers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Interactive Anatomical Avatar & Zones (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center relative overflow-hidden">
          {/* Status Bar */}
          <div className="w-full mb-4 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 truncate max-w-[260px]">
              {scanStatusMessage}
            </span>
            <span className="font-mono font-bold text-emerald-800">
              {scanProgress}%
            </span>
          </div>

          {/* Interactive SVG Human Body Model */}
          <div className="relative w-[320px] h-[480px] bg-gradient-to-b from-[#FAF8F5] to-emerald-50/40 rounded-2xl border border-stone-200 flex items-center justify-center shadow-inner overflow-hidden">
            {/* Animated Laser Scanning Beam */}
            {isScanning && (
              <div
                className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] z-20 transition-all duration-300 pointer-events-none"
                style={{ top: `${scanProgress}%` }}
              />
            )}

            <svg
              viewBox="0 0 320 480"
              className="w-full h-full select-none"
            >
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E6E0D2" />
                  <stop offset="100%" stopColor="#D5CBB9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized Human Anatomical Silhouette */}
              <g fill="url(#bodyGradient)" stroke="#B8AC98" strokeWidth="1.5">
                {/* Head */}
                <circle cx="160" cy="52" r="24" />
                {/* Neck */}
                <rect x="152" y="74" width="16" height="18" rx="4" />
                {/* Torso & Shoulders */}
                <path d="M 120 92 C 105 102 95 145 92 185 C 90 205 105 240 120 250 L 200 250 C 215 240 230 205 228 185 C 225 145 215 102 200 92 Z" />
                {/* Left Arm */}
                <path d="M 108 98 L 78 170 L 68 240 L 78 245 L 90 178 L 115 110 Z" />
                {/* Right Arm */}
                <path d="M 212 98 L 242 170 L 252 240 L 242 245 L 230 178 L 205 110 Z" />
                {/* Pelvis & Legs */}
                <path d="M 120 250 L 115 340 L 110 440 L 132 440 L 148 340 L 155 270 L 165 270 L 172 340 L 188 440 L 210 440 L 205 340 L 200 250 Z" />
              </g>

              {/* Anatomical Vulnerability Hotspots */}
              {ANATOMICAL_ZONES.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                let ringColor = "#0284C7"; // Vata blue
                if (dominantDosha === "pitta") ringColor = "#D97706";
                if (dominantDosha === "kapha") ringColor = "#059669";

                return (
                  <g
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Pulsing Outer Halo */}
                    <circle
                      cx={zone.svgCoords.cx}
                      cy={zone.svgCoords.cy}
                      r={zone.svgCoords.r + 6}
                      fill={isSelected ? ringColor : "none"}
                      fillOpacity={isSelected ? "0.22" : "0"}
                      stroke={ringColor}
                      strokeWidth={isSelected ? "2" : "1"}
                      strokeDasharray={isSelected ? "none" : "3,3"}
                      className={isSelected ? "animate-pulse" : "group-hover:stroke-width-2"}
                    />

                    {/* Center Target Dot */}
                    <circle
                      cx={zone.svgCoords.cx}
                      cy={zone.svgCoords.cy}
                      r="7"
                      fill={isSelected ? ringColor : "#FFFFFF"}
                      stroke={ringColor}
                      strokeWidth="2.5"
                    />

                    {/* Icon / Crosshair */}
                    <circle
                      cx={zone.svgCoords.cx}
                      cy={zone.svgCoords.cy}
                      r="2"
                      fill="#FFFFFF"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Zone Navigation Buttons */}
          <div className="w-full grid grid-cols-5 gap-1.5 mt-4">
            {ANATOMICAL_ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZoneId(z.id)}
                className={`p-1.5 rounded-lg text-[10px] font-bold text-center transition-all ${
                  activeZoneId === z.id
                    ? "bg-emerald-800 text-white shadow"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {z.id.replace("zone_", "").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Vulnerability Assessment & Classical Herbal Balancers (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Zone Card Header */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Target Channel Inspection (Srotas Pariksha)
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
                  {activeZone.name}
                </h3>
                <div className="text-xs text-stone-500 font-serif italic">
                  {activeZone.sanskritName} • Srotas: {activeZone.srotas}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Constitutional Risk:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  vulnerability.riskLevel.includes("High")
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {vulnerability.riskLevel}
                </span>
              </div>
            </div>

            {/* AI Predicted Vulnerability Description */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>AI Predicted Constitutional Susceptibility (Kha-Vaigunya)</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                {vulnerability.condition}
              </p>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                <strong className="text-stone-700">Classical Manifestation Signs: </strong>
                <span className="font-serif italic text-emerald-950">{vulnerability.classicalSigns}</span>
              </div>
            </div>

            {/* Recommended Classical Ayurvedic Rasayanas & Dravyas */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Classical Herbal Balancers (Rasayana Dravyas & Formulations)
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {vulnerability.herbalBalancers.map((herb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {herb.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {herb.form}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        {herb.role}
                      </p>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono shrink-0">
                      Charaka / SDMCA Formulatory
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary & Lifestyle Rebalancing (Ahara & Vihara) */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Utensils className="w-4 h-4 text-emerald-700" />
                <span>Constitutional Ahara (Diet) & Vihara (Daily Care)</span>
              </div>
              <p className="text-stone-700 leading-relaxed text-[11px]">
                {vulnerability.dietaryLifestyle}
              </p>
            </div>

            {/* Clinician Approval & Integration Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500">
                Validated for Patient: <strong className="text-stone-800">{currentPatient.name}</strong> ({scores.dominantPrakriti})
              </span>

              <button
                onClick={() => {
                  setSavedSuccess(true);
                  if (onSaveToPatient) onSaveToPatient(currentPatient.id, activeZone.name, vulnerability);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all ${
                  savedSuccess
                    ? "bg-emerald-800 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-stone-950"
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Approved & Appended to Dossier</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    <span>Approve Herbal Protocol for Patient</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Statutory Regulatory & Ethical Disclaimer */}
          <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-300 text-amber-950 flex items-start gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-[11px]">
                Regulatory Compliance Notice (HPL 2026 PS 01 Brief Section 8)
              </h5>
              <p className="text-[10px] text-amber-900/90 leading-relaxed">
                This anatomical vulnerability prediction models constitutional channel susceptibility (Kha-vaigunya) based on classical principles. It provides educational Rasayana herbs and dietary lifestyle guidance. It does <strong>NOT</strong> diagnose clinical pathology or prescribe pharmaceutical medicines. All recommendations require licensed Vaidya clinical verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
