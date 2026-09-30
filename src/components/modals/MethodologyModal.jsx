import React, { useEffect } from "react";
import { X, BookOpen, Award, CheckCircle, Scale } from "lucide-react";
import { SAMHITA_REFERENCES } from "../../data/samhitaReferences";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";

export function MethodologyModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-modal-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TridoshaLabLogo variant="icon" size="sm" light={true} />
            <div>
              <h3 id="methodology-modal-title" className="text-base font-bold font-serif-heading">
                Classical Ayurvedic Methodology & Treatises
              </h3>
              <p className="text-[11px] text-emerald-200/90">
                SDM College of Ayurveda, Udupi Clinical Guidelines (Charaka, Sushruta, Ashtanga Hridaya)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-stone-700">
          {/* Section 1: Distinction between Prakriti and Vikriti */}
          <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>Fundamental Ayurvedic Principle: Janma Prakriti vs. Vikriti</span>
            </div>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              Ayurveda explicitly distinguishes between an individual's congenital physiological constitution (<strong>Janma Prakriti</strong>) and temporary, acquired pathological imbalances (<strong>Vikriti</strong>). Prakriti is determined at conception by maternal and paternal factors, intrauterine environment, and maternal dietary habits. It remains an immutable lifelong physiological baseline.
            </p>
            <p className="text-stone-600 leading-relaxed text-[11px] italic">
              "Consequently, this digital platform is calibrated exclusively for constitutional baseline mapping (Prakriti), and does not attempt to diagnose pathological diseases (Vikriti) or prescribe therapeutic medications."
            </p>
          </div>

          {/* Section 2: Classical Samhita Verses and Citations */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Classical Treatises & Shloka References</span>
            </h4>

            <div className="space-y-3">
              {SAMHITA_REFERENCES.map((ref) => (
                <div key={ref.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">
                        {ref.source} — {ref.section}
                      </h5>
                      <div className="text-[11px] text-emerald-800 font-medium">
                        {ref.chapter} ({ref.verse})
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600">
                      {ref.id}
                    </span>
                  </div>

                  {ref.sanskrit && (
                    <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-stone-200/80 font-serif text-[11px] text-emerald-950 leading-relaxed">
                      {ref.sanskrit}
                    </div>
                  )}

                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    <strong className="text-stone-800">English Translation:</strong> {ref.translation}
                  </p>

                  <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <strong className="text-stone-700">Clinical Application:</strong> {ref.clinicalSignificance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: SDM Udupi Assessment Framework */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>SDM College of Ayurveda, Udupi Clinical Triad</span>
            </h4>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              In concordance with the teaching methods at SDMCA Udupi, a holistic constitutional assessment combines:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 text-[11px]">
              <li><strong>Prashna Pariksha (Structured Inquest):</strong> 24 standardized questions covering morphological, physiological, and emotional parameters.</li>
              <li><strong>Pratyaksha Pariksha (Direct Clinical Observation):</strong> Free-form practitioner observation notes with speech-to-text dictation and NLP Guna extraction.</li>
              <li><strong>Anumana (Clinical Inference):</strong> Mathematical synthesis of weighted points into normalized 100% distribution and bi-doshic / mono-doshic classification.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[40px] bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
}

export default MethodologyModal;
