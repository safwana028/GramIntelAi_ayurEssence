import React, { useState } from "react";
import { ArrowLeft, Calendar, ShieldCheck, AlertCircle, FileText, CheckCircle2, User, Activity, Clock } from "lucide-react";
import { DoshaRadarChart, DoshaProportionBar } from "../report/DoshaRadarChart";

export function PatientHistoryView({
  patient,
  activeRole,
  onBack,
  onViewReport,
  onSupervisorApprove
}) {
  const assessments = patient?.assessments || [];
  const [selectedIdxA, setSelectedIdxA] = useState(0);
  const [selectedIdxB, setSelectedIdxB] = useState(assessments.length > 1 ? assessments.length - 1 : 0);

  if (!patient) return null;

  const currentA = assessments[selectedIdxA] || null;
  const currentB = assessments[selectedIdxB] || null;

  return (
    <div className="space-y-6">
      {/* Back & Patient Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 tracking-tight font-serif-heading">
                {patient.name}
              </h2>
              <span className="text-xs font-mono text-stone-500">({patient.id})</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {patient.age} yrs • {patient.gender} • {patient.city} • Baseline: <strong className="text-emerald-800">{patient.baselinePrakriti}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            Total Evaluations Recorded: <strong className="text-stone-800 font-bold">{assessments.length}</strong>
          </span>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
          <Activity className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No Assessment Records Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Initiate a new Prakriti assessment session for this patient to establish their baseline constitutional record.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Assessment Timeline</span>
            </h3>

            <div className="space-y-3">
              {assessments.map((asm, idx) => {
                const isSelected = idx === selectedIdxA;
                const isPending = !asm.supervisorApproved;

                return (
                  <div
                    key={asm.id || idx}
                    onClick={() => setSelectedIdxA(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {asm.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {asm.scores.dominantPrakriti}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 mb-2">
                      Conducted by: <span className="font-medium text-stone-700">{asm.conductedBy?.name}</span>
                    </div>

                    {/* Proportion preview */}
                    <DoshaProportionBar scores={asm.scores} className="h-2 mb-2" />

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">
                        V: {asm.scores.vata}% • P: {asm.scores.pitta}% • K: {asm.scores.kapha}%
                      </span>
                      {isPending ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Needs Review
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assessment Detail & Comparison (Right 8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {currentA && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                      Selected Evaluation
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
                      {currentA.scores.dominantPrakriti} ({currentA.scores.constitutionType})
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>Date: <strong>{currentA.date}</strong></span>
                      <span>•</span>
                      <span>Evaluator: <strong>{currentA.conductedBy?.name} ({currentA.conductedBy?.role})</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReport(patient, currentA)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>View Formal Dossier</span>
                  </button>
                </div>

                {/* Supervisor Review Action Box (Doctor Role) */}
                {!currentA.supervisorApproved && (
                  <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Student Draft Pending Senior Vaidya Sign-Off</span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        Conducted by student. Needs supervising clinical mentor to sign off and approve the constitutional findings.
                      </p>
                    </div>

                    {activeRole === "doctor" && (
                      <button
                        onClick={() => onSupervisorApprove(patient.id, currentA.id)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign Off & Approve</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Visual Radar & Subscore Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center p-3 bg-stone-50/50 rounded-xl border border-stone-200">
                    <DoshaRadarChart scores={currentA.scores} size={250} />
                    <div className="text-[11px] text-stone-500 mt-2 text-center">
                      Tri-Dosha Polar Geometry (Equilateral Coordinate System)
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-sky-900">
                        <span>Vata (वात): {currentA.scores.vata}%</span>
                        <span>Air + Space</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500" style={{ width: `${currentA.scores.vata}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-amber-900">
                        <span>Pitta (पित्त): {currentA.scores.pitta}%</span>
                        <span>Fire + Water</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${currentA.scores.pitta}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-emerald-900">
                        <span>Kapha (कफ): {currentA.scores.kapha}%</span>
                        <span>Water + Earth</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{ width: `${currentA.scores.kapha}%` }} />
                      </div>
                    </div>

                    {/* Dimensional Subscores */}
                    {currentA.scores.subScores && (
                      <div className="pt-3 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                          <div className="font-semibold text-stone-700">Physical</div>
                          <div className="text-stone-500 mt-0.5">
                            V:{currentA.scores.subScores.physical?.vata}% P:{currentA.scores.subScores.physical?.pitta}% K:{currentA.scores.subScores.physical?.kapha}%
                          </div>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                          <div className="font-semibold text-stone-700">Physiological</div>
                          <div className="text-stone-500 mt-0.5">
                            V:{currentA.scores.subScores.physiological?.vata}% P:{currentA.scores.subScores.physiological?.pitta}% K:{currentA.scores.subScores.physiological?.kapha}%
                          </div>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                          <div className="font-semibold text-stone-700">Psychological</div>
                          <div className="text-stone-500 mt-0.5">
                            V:{currentA.scores.subScores.psychological?.vata}% P:{currentA.scores.subScores.psychological?.pitta}% K:{currentA.scores.subScores.psychological?.kapha}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Free Text Observations */}
                {currentA.observations?.freeText && (
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                    <h4 className="font-bold text-stone-800 mb-1">
                      Recorded Clinical Observations & Notes
                    </h4>
                    <p className="text-stone-600 leading-relaxed italic">
                      "{currentA.observations.freeText}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
