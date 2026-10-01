import React from "react";
import { STANDARD_QUESTIONS } from "../../data/standardQuestionnaire";
import { CheckCircle2, ListFilter, Sparkles, Scale } from "lucide-react";

export function ChosenAnswerMatrix({ answers = {}, scores = {}, activeLang = "en" }) {
  // Count traits selected across 24 questions
  let vCount = 0;
  let pCount = 0;
  let kCount = 0;
  let totalSelections = 0;

  const domainCounts = {
    Physical: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Physiological: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Psychological: { vata: 0, pitta: 0, kapha: 0, total: 0 }
  };

  const detailedComparison = STANDARD_QUESTIONS.map((q) => {
    const ans = answers[q.id];
    const selectedOptIds = Array.isArray(ans) ? ans : ans ? [ans] : [];
    const selectedOptions = q.options.filter(
      (opt) => selectedOptIds.includes(opt.id) || selectedOptIds.includes(opt.dosha)
    );

    selectedOptions.forEach((opt) => {
      totalSelections++;
      if (opt.dosha === "vata") {
        vCount++;
        if (domainCounts[q.dimension]) domainCounts[q.dimension].vata++;
      } else if (opt.dosha === "pitta") {
        pCount++;
        if (domainCounts[q.dimension]) domainCounts[q.dimension].pitta++;
      } else if (opt.dosha === "kapha") {
        kCount++;
        if (domainCounts[q.dimension]) domainCounts[q.dimension].kapha++;
      }
      if (domainCounts[q.dimension]) domainCounts[q.dimension].total++;
    });

    return {
      q,
      selectedOptions
    };
  });

  const rawVPercent = totalSelections > 0 ? Math.round((vCount / totalSelections) * 100) : 33;
  const rawPPercent = totalSelections > 0 ? Math.round((pCount / totalSelections) * 100) : 33;
  const rawKPercent = totalSelections > 0 ? Math.round((kCount / totalSelections) * 100) : 34;

  return (
    <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-800" />
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-serif-heading">
            Chosen Answer Trait Comparison Matrix
          </h3>
        </div>
        <span className="text-[11px] text-stone-500 font-mono">
          24 Questionnaire Traits • {totalSelections} Selections Made
        </span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        This matrix compares the exact physical, physiological, and psychological options chosen during the assessment against the final weighted Prakriti score algorithm.
      </p>

      {/* Raw Selection vs Weighted Score Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-sky-50/80 p-4 rounded-xl border border-sky-200 space-y-1">
          <div className="flex justify-between font-bold text-sky-900">
            <span>Vata Trait Selections</span>
            <span className="text-sky-700">{vCount} / {totalSelections}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] text-sky-700">Raw Choice Share:</span>
            <span className="text-sm font-extrabold text-sky-950">{rawVPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-sky-200/60 pt-1 mt-1">
            <span className="text-[11px] font-semibold text-sky-800">Final Weighted Score:</span>
            <span className="text-base font-extrabold text-sky-900">{scores.vata}%</span>
          </div>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
          <div className="flex justify-between font-bold text-amber-900">
            <span>Pitta Trait Selections</span>
            <span className="text-amber-700">{pCount} / {totalSelections}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] text-amber-700">Raw Choice Share:</span>
            <span className="text-sm font-extrabold text-amber-950">{rawPPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-amber-200/60 pt-1 mt-1">
            <span className="text-[11px] font-semibold text-amber-800">Final Weighted Score:</span>
            <span className="text-base font-extrabold text-amber-900">{scores.pitta}%</span>
          </div>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-1">
          <div className="flex justify-between font-bold text-emerald-900">
            <span>Kapha Trait Selections</span>
            <span className="text-emerald-700">{kCount} / {totalSelections}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[11px] text-emerald-700">Raw Choice Share:</span>
            <span className="text-sm font-extrabold text-emerald-950">{rawKPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-emerald-200/60 pt-1 mt-1">
            <span className="text-[11px] font-semibold text-emerald-800">Final Weighted Score:</span>
            <span className="text-base font-extrabold text-emerald-900">{scores.kapha}%</span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100/80 text-stone-700 text-[11px] uppercase font-bold border-b border-stone-200">
              <th className="p-2.5">Constitutional Dimension</th>
              <th className="p-2.5 text-center text-sky-800">Vata Choices</th>
              <th className="p-2.5 text-center text-amber-800">Pitta Choices</th>
              <th className="p-2.5 text-center text-emerald-800">Kapha Choices</th>
              <th className="p-2.5 text-right">Dominant Trait</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-[11px]">
            {Object.entries(domainCounts).map(([dim, data]) => {
              const dom = data.vata >= data.pitta && data.vata >= data.kapha ? "Vata" : data.pitta >= data.kapha ? "Pitta" : "Kapha";
              return (
                <tr key={dim} className="hover:bg-stone-50/60">
                  <td className="p-2.5 font-semibold text-stone-800">{dim} Traits</td>
                  <td className="p-2.5 text-center font-mono font-bold text-sky-900">{data.vata}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-amber-900">{data.pitta}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-emerald-900">{data.kapha}</td>
                  <td className="p-2.5 text-right font-bold text-stone-900">{dom} Predominant</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
