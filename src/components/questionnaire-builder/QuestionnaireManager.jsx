import React, { useState } from "react";
import { Layers, Plus, Download, Upload, Trash2, Edit3, CheckCircle, FileCode } from "lucide-react";
import { QuestionEditorModal } from "./QuestionEditorModal";

export function QuestionnaireManager({
  questionnaires,
  onSaveQuestionnaires
}) {
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const activeQuestionnaire = questionnaires[activeQIndex] || questionnaires[0];
  const questions = activeQuestionnaire.questions || [];

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsEditorOpen(true);
  };

  const handleEditQuestion = (q) => {
    setEditingQuestion(q);
    setIsEditorOpen(true);
  };

  const handleDeleteQuestion = (qId) => {
    if (window.confirm("Are you sure you want to remove this question from the questionnaire?")) {
      const updatedQuestions = questions.filter(q => q.id !== qId);
      const updatedQ = {
        ...activeQuestionnaire,
        questions: updatedQuestions,
        metadata: {
          ...activeQuestionnaire.metadata,
          itemCount: updatedQuestions.length
        }
      };
      const updatedList = [...questionnaires];
      updatedList[activeQIndex] = updatedQ;
      onSaveQuestionnaires(updatedList);
    }
  };

  const handleSaveQuestion = (savedQuestion) => {
    let updatedQuestions;
    if (editingQuestion) {
      updatedQuestions = questions.map(q => q.id === savedQuestion.id ? savedQuestion : q);
    } else {
      updatedQuestions = [...questions, savedQuestion];
    }

    const updatedQ = {
      ...activeQuestionnaire,
      questions: updatedQuestions,
      metadata: {
        ...activeQuestionnaire.metadata,
        itemCount: updatedQuestions.length
      }
    };
    const updatedList = [...questionnaires];
    updatedList[activeQIndex] = updatedQ;
    onSaveQuestionnaires(updatedList);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(activeQuestionnaire, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeQuestionnaire.metadata.id || "questionnaire"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          const updatedList = [...questionnaires, parsed];
          onSaveQuestionnaires(updatedList);
          setActiveQIndex(updatedList.length - 1);
          alert(`Successfully imported "${parsed.metadata?.title || "Custom Questionnaire"}" with ${parsed.questions.length} questions.`);
        } else {
          alert("Invalid questionnaire JSON format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900 font-serif-heading">
              Custom Questionnaire Management & Builder
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Configure institutional templates, modify questions, and export/import questionnaires in JSON.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors border border-stone-300">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors border border-stone-300"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Active Questionnaire Metadata Card */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
            Active Evaluation Template
          </span>
          <h3 className="text-base font-bold text-stone-900 mt-0.5">
            {activeQuestionnaire.metadata.title}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {activeQuestionnaire.metadata.institution} • Version {activeQuestionnaire.metadata.version}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-100/80 rounded-xl text-center border border-emerald-300">
            <span className="block text-[10px] font-bold text-emerald-800">Total Items</span>
            <span className="text-sm font-extrabold text-emerald-950">{questions.length} Questions</span>
          </div>
        </div>
      </div>

      {/* Questions Inventory */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Questions Inventory ({questions.length} Items)
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {questions.map((q, idx) => {
            const vOpt = q.options.find(o => o.dosha === "vata");
            const pOpt = q.options.find(o => o.dosha === "pitta");
            const kOpt = q.options.find(o => o.dosha === "kapha");

            return (
              <div
                key={q.id || idx}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {idx + 1}. {q.question?.en || q.question}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600">
                      {q.dimension}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-sky-50/60 border border-sky-200/60 text-sky-900">
                      <strong>Vata:</strong> {vOpt?.text?.en || vOpt?.text}
                    </div>
                    <div className="p-2 rounded bg-amber-50/60 border border-amber-200/60 text-amber-900">
                      <strong>Pitta:</strong> {pOpt?.text?.en || pOpt?.text}
                    </div>
                    <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                      <strong>Kapha:</strong> {kOpt?.text?.en || kOpt?.text}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleEditQuestion(q)}
                    className="p-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
                    title="Edit question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveQuestion={handleSaveQuestion}
        questionToEdit={editingQuestion}
      />
    </div>
  );
}
