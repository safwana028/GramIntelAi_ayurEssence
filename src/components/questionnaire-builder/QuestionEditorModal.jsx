import React, { useState } from "react";
import { X, Save, PlusCircle } from "lucide-react";

export function QuestionEditorModal({ isOpen, onClose, onSaveQuestion, questionToEdit = null }) {
  const [dimension, setDimension] = useState(questionToEdit?.dimension || "Physical");
  const [sanskritTrait, setSanskritTrait] = useState(questionToEdit?.sanskritTrait || "");
  const [questionEn, setQuestionEn] = useState(questionToEdit?.question?.en || "");
  const [questionKn, setQuestionKn] = useState(questionToEdit?.question?.kn || "");
  const [context, setContext] = useState(questionToEdit?.context || "SDM Clinical Guideline");

  const [vataText, setVataText] = useState(questionToEdit?.options?.find(o => o.dosha === "vata")?.text?.en || "");
  const [pittaText, setPittaText] = useState(questionToEdit?.options?.find(o => o.dosha === "pitta")?.text?.en || "");
  const [kaphaText, setKaphaText] = useState(questionToEdit?.options?.find(o => o.dosha === "kapha")?.text?.en || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionEn.trim() || !vataText.trim() || !pittaText.trim() || !kaphaText.trim()) {
      alert("Please fill in question text and all 3 dosha options.");
      return;
    }

    const questionObj = {
      id: questionToEdit?.id || `custom_q_${Date.now()}`,
      dimension,
      sanskritTrait: sanskritTrait || "ಕಸ್ಟಮ್ ಗುಣಲಕ್ಷಣ (Custom Trait)",
      question: {
        en: questionEn,
        kn: questionKn || questionEn,
        hi: questionEn
      },
      context,
      options: [
        { id: "v", dosha: "vata", weight: 1.0, text: { en: vataText, kn: vataText, hi: vataText } },
        { id: "p", dosha: "pitta", weight: 1.0, text: { en: pittaText, kn: pittaText, hi: pittaText } },
        { id: "k", dosha: "kapha", weight: 1.0, text: { en: kaphaText, kn: kaphaText, hi: kaphaText } }
      ]
    };

    onSaveQuestion(questionObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-[#1E4D3E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-serif-heading">
              {questionToEdit ? "Edit Questionnaire Trait" : "Add Custom Assessment Trait"}
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Dimension *</label>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Physical">Physical (Sharirika)</option>
                <option value="Physiological">Physiological (Kriyatmaka)</option>
                <option value="Psychological">Psychological (Manasika)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Classical Trait Title (Sanskrit)</label>
              <input
                type="text"
                value={sanskritTrait}
                onChange={(e) => setSanskritTrait(e.target.value)}
                placeholder="e.g. स्पर्श एवं शीतता (Sparsha & Sheetatva)"
                className="w-full p-2 rounded-lg border border-stone-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Question Description (English) *</label>
            <input
              type="text"
              required
              value={questionEn}
              onChange={(e) => setQuestionEn(e.target.value)}
              placeholder="e.g. Sensitivity to Coastal Humidity and Cold Weather"
              className="w-full p-2 rounded-lg border border-stone-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Question Description (ಕನ್ನಡ - Optional)</label>
            <input
              type="text"
              value={questionKn}
              onChange={(e) => setQuestionKn(e.target.value)}
              placeholder="ಉದಾಹರಣೆ: ತೇವಾಂಶ ಮತ್ತು ಚಳಿಗಾಲದ ಸಹಿಷ್ಣುತೆ"
              className="w-full p-2 rounded-lg border border-stone-300 bg-white font-kannada"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h4 className="font-bold text-stone-800">Configure Dosha Specific Indicators</h4>

            <div>
              <label className="block font-semibold text-sky-800 mb-1">Vata Option (Air + Ether indicator) *</label>
              <input
                type="text"
                required
                value={vataText}
                onChange={(e) => setVataText(e.target.value)}
                placeholder="e.g. Shivers quickly, dislikes damp breezes, dry skin worsens"
                className="w-full p-2 rounded-lg border border-sky-300 bg-sky-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-amber-800 mb-1">Pitta Option (Fire + Water indicator) *</label>
              <input
                type="text"
                required
                value={pittaText}
                onChange={(e) => setPittaText(e.target.value)}
                placeholder="e.g. Tolerates cold well, sweats heavily in humid weather, prone to heat rashes"
                className="w-full p-2 rounded-lg border border-amber-300 bg-amber-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-800 mb-1">Kapha Option (Water + Earth indicator) *</label>
              <input
                type="text"
                required
                value={kaphaText}
                onChange={(e) => setKaphaText(e.target.value)}
                placeholder="e.g. Steady tolerance, sluggish in rainy weather, prone to congestion"
                className="w-full p-2 rounded-lg border border-emerald-300 bg-emerald-50/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
