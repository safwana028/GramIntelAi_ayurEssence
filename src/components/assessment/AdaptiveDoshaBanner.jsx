import React from "react";
import { Sparkles, Info, ShieldAlert } from "lucide-react";

/**
 * Adaptive Dosha Threshold Indicator (Default threshold: 80%)
 * Highlights provisional dominance signals when Vata, Pitta, or Kapha >= threshold.
 * Explicitly distinguishes provisional trends from authoritative final Prakriti.
 */
export function AdaptiveDoshaBanner({
  scores,
  answeredCount,
  totalQuestions = 24,
  threshold = 80
}) {
  if (!scores) return null;

  const vata = Number(scores.vata) || 0;
  const pitta = Number(scores.pitta) || 0;
  const kapha = Number(scores.kapha) || 0;

  const doshas = [
    { name: "Vata", pct: vata, color: "sky", desc: "Air + Ether elements predominant" },
    { name: "Pitta", pct: pitta, color: "amber", desc: "Fire + Water elements predominant" },
    { name: "Kapha", pct: kapha, color: "emerald", desc: "Water + Earth elements predominant" }
  ];

  const dominant = doshas.find((d) => d.pct >= threshold);
  if (!dominant) return null;

  const isCompleted = answeredCount >= totalQuestions;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      dominant.color === "sky"
        ? "bg-sky-50/80 border-sky-300 text-sky-950"
        : dominant.color === "amber"
        ? "bg-amber-50/80 border-amber-300 text-amber-950"
        : "bg-emerald-50/80 border-emerald-300 text-emerald-950"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          dominant.color === "sky"
            ? "bg-sky-500 text-white shadow-sm"
            : dominant.color === "amber"
            ? "bg-amber-500 text-white shadow-sm"
            : "bg-emerald-600 text-white shadow-sm"
        }`}>
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
              <span>Adaptive Signal ({threshold}% Threshold Active):</span>
              <span className="underline decoration-2">
                Current provisional result strongly indicates {dominant.name} dominance ({dominant.pct}%).
              </span>
            </h4>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-stone-200">
              {dominant.pct}% {dominant.name}
            </span>
          </div>

          <p className="text-xs opacity-90 leading-relaxed">
            {dominant.desc}. Provisional scores dynamically synthesize your answered questionnaire traits and clinical observations.
          </p>

          {!isCompleted && (
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-medium text-stone-600">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Clinical Notice:</strong> Do not present this provisional result as the final Prakriti. Final Prakriti is calculated only after all {totalQuestions} required questions are completed and the assessment is finalized by the supervising doctor.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
