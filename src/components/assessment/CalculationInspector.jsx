import React from "react";
import { X, BookOpen, Calculator, HelpCircle, CheckCircle, Info } from "lucide-react";

export function CalculationInspector({ isOpen, onClose, calculationResult }) {
  if (!isOpen || !calculationResult) return null;

  const { points, vata, pitta, kapha, totalPoints, answeredCount, dominantPrakriti, constitutionType, classicalTerm, rationale } = calculationResult;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E4D3E] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold font-serif-heading tracking-wide">
                Ayurvedic Mathematical Basis & Scoring Methodology
              </h3>
              <p className="text-[11px] text-emerald-200">
                SDM College of Ayurveda, Udupi & Classical Samhita Formula Transparency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-stone-700">
          {/* Classical Classification Result */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Assessment Classification Verdict
            </div>
            <div className="text-base font-bold text-stone-900 font-serif-heading">
              {classicalTerm}
            </div>
            <p className="text-stone-600 mt-1 leading-relaxed text-xs">
              {rationale}
            </p>
          </div>

          {/* Mathematical Formulation */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Percentage Formulation & Normalization</span>
            </h4>

            <div className="bg-stone-100 p-3 rounded-xl font-mono text-[11px] text-stone-800 space-y-1">
              <div>Vata% = (Final Vata Points / Total Points) × 100</div>
              <div>Pitta% = (Final Pitta Points / Total Points) × 100</div>
              <div>Kapha% = (Final Kapha Points / Total Points) × 100</div>
              <div className="text-stone-500 pt-1 border-t border-stone-200">
                Total Evaluated Points = {totalPoints} | Answered Traits = {answeredCount}
              </div>
            </div>

            {/* Points Decomposition Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="p-2.5 font-bold">Dosha</th>
                    <th className="p-2.5 font-bold">24-Question Pts</th>
                    <th className="p-2.5 font-bold">Observation Cues Pts</th>
                    <th className="p-2.5 font-bold">Aggregated Raw Pts</th>
                    <th className="p-2.5 font-bold text-right">Normalized Integer %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="p-2.5 font-bold text-sky-800">Vata (वात)</td>
                    <td className="p-2.5">{points?.questionnaireVata || 0}</td>
                    <td className="p-2.5">+{points?.observationVata || 0}</td>
                    <td className="p-2.5 font-semibold">{points?.vata || 0}</td>
                    <td className="p-2.5 font-bold text-right text-sky-900">{vata}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-800">Pitta (पित्त)</td>
                    <td className="p-2.5">{points?.questionnairePitta || 0}</td>
                    <td className="p-2.5">+{points?.observationPitta || 0}</td>
                    <td className="p-2.5 font-semibold">{points?.pitta || 0}</td>
                    <td className="p-2.5 font-bold text-right text-amber-900">{pitta}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-emerald-800">Kapha (कफ)</td>
                    <td className="p-2.5">{points?.questionnaireKapha || 0}</td>
                    <td className="p-2.5">+{points?.observationKapha || 0}</td>
                    <td className="p-2.5 font-semibold">{points?.kapha || 0}</td>
                    <td className="p-2.5 font-bold text-right text-emerald-900">{kapha}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Classical Samhita Decision Thresholds */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Classical Decision Boundary Rules</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-lg border border-stone-200 bg-white">
                <div className="font-bold text-stone-800 mb-1">1. Eka-Doshaja</div>
                <p className="text-stone-500 leading-relaxed">
                  Single Dosha ≥ 45% with a distinct lead ≥ 12% over secondary. (Charaka Samhita Vimana 8:95).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/50">
                <div className="font-bold text-emerald-900 mb-1">2. Dwandwaja (Dual)</div>
                <p className="text-stone-600 leading-relaxed">
                  Combined predominance of top two doshas; tertiary dosha is recessive. ~85% clinical occurrence. (Ashtanga Hridaya Sharira 3:84).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-stone-200 bg-white">
                <div className="font-bold text-stone-800 mb-1">3. Sama-Doshaja</div>
                <p className="text-stone-500 leading-relaxed">
                  All 3 doshas in equilibrium within ±4% (~33-34% each). Ideal constitutional balance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
