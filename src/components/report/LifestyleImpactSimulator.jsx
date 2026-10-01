import React, { useState } from "react";
import { Sparkles, Sun, Moon, Utensils, RotateCcw, AlertTriangle } from "lucide-react";
import { DoshaProportionBar } from "./DoshaRadarChart";

export function LifestyleImpactSimulator({ baseScores = { vata: 40, pitta: 35, kapha: 25 } }) {
  const [activeTriggers, setActiveTriggers] = useState([]);

  const triggers = [
    { id: "late_night", label: "Late Night Sleep / Insomnia", vDelta: 15, pDelta: 5, kDelta: -10, icon: Moon, desc: "Increases Ruksha & Chala gunas (Vata aggravated)" },
    { id: "spicy_food", label: "Excess Pungent / Hot Foods", vDelta: 0, pDelta: 20, kDelta: -10, icon: Utensils, desc: "Increases Ushna & Tikshna gunas (Pitta aggravated)" },
    { id: "cold_drinks", label: "Cold Refrigerated Drinks & Ice", vDelta: 10, pDelta: -10, kDelta: 15, icon: Sun, desc: "Dampens Agni & increases Sheeta guna (Vata & Kapha increased)" },
    { id: "sedentary", label: "Sedentary Routine / Overeating", vDelta: -10, pDelta: -5, kDelta: 25, icon: Utensils, desc: "Increases Guru & Manda gunas (Kapha aggravated)" },
    { id: "warm_regimen", label: "Warm Medicated Ghee & Yoga", vDelta: -15, pDelta: -10, kDelta: 5, icon: Sparkles, desc: "Pacifies Vata & Pitta (Restores Tridosha Samya equilibrium)" }
  ];

  const toggleTrigger = (id) => {
    setActiveTriggers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const resetSimulator = () => setActiveTriggers([]);

  // Calculate simulated scores
  let rawV = baseScores.vata || 33;
  let rawP = baseScores.pitta || 33;
  let rawK = baseScores.kapha || 34;

  activeTriggers.forEach((id) => {
    const tr = triggers.find((t) => t.id === id);
    if (tr) {
      rawV += tr.vDelta;
      rawP += tr.pDelta;
      rawK += tr.kDelta;
    }
  });

  // Clamp and normalize to 100%
  rawV = Math.max(5, rawV);
  rawP = Math.max(5, rawP);
  rawK = Math.max(5, rawK);
  const total = rawV + rawP + rawK;

  const simV = Math.round((rawV / total) * 100);
  const simP = Math.round((rawP / total) * 100);
  const simK = 100 - simV - simP;

  return (
    <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider inline-block mb-1">
            Working Innovation Feature
          </span>
          <h3 className="text-base font-bold text-stone-900 font-serif-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>Interactive Dinacharya & Ahara Lifestyle Impact Simulator</span>
          </h3>
        </div>

        {activeTriggers.length > 0 && (
          <button
            onClick={resetSimulator}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>Reset Baseline</span>
          </button>
        )}
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Toggle daily habit factors below to simulate real-time constitutional shifts (Vikriti) on your baseline Deha Prakriti.
      </p>

      {/* Trigger Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
        {triggers.map((tr) => {
          const isActive = activeTriggers.includes(tr.id);
          const IconComponent = tr.icon;
          return (
            <button
              key={tr.id}
              onClick={() => toggleTrigger(tr.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? "bg-emerald-900 text-white border-emerald-950 shadow-sm ring-2 ring-emerald-600/40"
                  : "bg-white text-stone-800 border-stone-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <IconComponent className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-emerald-700"}`} />
                <span>{tr.label}</span>
              </div>
              <span className={`text-[10px] ${isActive ? "text-emerald-200" : "text-stone-500"}`}>
                {tr.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Simulated Output Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Simulated Constitutional Balance vs Baseline
          </span>
          <div className="flex items-center gap-3 text-xs font-extrabold">
            <span className="text-sky-900">Vata: {simV}% ({simV - baseScores.vata >= 0 ? `+${simV - baseScores.vata}` : simV - baseScores.vata}%)</span>
            <span className="text-amber-900">Pitta: {simP}% ({simP - baseScores.pitta >= 0 ? `+${simP - baseScores.pitta}` : simP - baseScores.pitta}%)</span>
            <span className="text-emerald-900">Kapha: {simK}% ({simK - baseScores.kapha >= 0 ? `+${simK - baseScores.kapha}` : simK - baseScores.kapha}%)</span>
          </div>
        </div>

        <DoshaProportionBar scores={{ vata: simV, pitta: simP, kapha: simK }} className="h-4" />

        {activeTriggers.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical Insight:</strong> Selected habits shift your baseline Prakriti toward a temporary imbalance state (Vikriti). Following prescribed Dinacharya pacifies these spikes.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
