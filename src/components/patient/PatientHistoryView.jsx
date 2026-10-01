import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileText,
  CheckCircle2,
  Activity,
  Clock
} from "lucide-react";
import { DoshaRadarChart, DoshaProportionBar } from "../report/DoshaRadarChart";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { TRANSLATIONS } from "../../data/translations";

export function PatientHistoryView({
  patient,
  activeRole,
  onBack,
  onViewReport,
  onSupervisorApprove,
  activeLang = "en"
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const rawAssessments = patient?.assessments || [];
  // Ensure no duplicate reports in history
  const seenKeys = new Set();
  const assessments = rawAssessments.filter((a) => {
    const key = a.id || `${a.date}-${a.conductedBy?.name}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });
  const [selectedIdxA, setSelectedIdxA] = useState(0);

  if (!patient) return null;

  const currentA = assessments[selectedIdxA] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Back & Patient Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="p-2 rounded-xl"
            aria-label="Back to Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 tracking-tight font-serif-heading">
                {patient.name}
              </h2>
              <span className="text-xs font-mono text-stone-500">({patient.id})</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {patient.age} yrs • {patient.gender} • {patient.city} • Baseline:{" "}
              <strong className="text-emerald-800">{patient.baselinePrakriti}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="md">
            Total Evaluations: <strong className="ml-1 text-stone-900">{assessments.length}</strong>
          </Badge>
        </div>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Assessment Records Yet"
          description="Initiate a new Prakriti assessment session for this patient to establish their baseline constitutional record."
          actionLabel="Back to Directory"
          onAction={onBack}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-800" />
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {asm.date}
                      </span>
                      <Badge variant="neutral" size="sm">
                        {asm.scores?.dominantPrakriti}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-stone-500 mb-2">
                      Conducted by:{" "}
                      <span className="font-medium text-stone-700">
                        {asm.conductedBy?.name || "Clinician"}
                      </span>
                    </div>

                    {/* Proportion preview */}
                    <DoshaProportionBar scores={asm.scores} className="h-1.5 mb-2" />

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500 font-mono">
                        V: {asm.scores?.vata}% • P: {asm.scores?.pitta}% • K: {asm.scores?.kapha}%
                      </span>
                      {isPending ? (
                        <Badge variant="warning" size="sm" dot>
                          Needs Review
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm" dot>
                          Approved
                        </Badge>
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
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Selected Evaluation Dossier
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 font-serif-heading mt-0.5">
                      {currentA.scores?.dominantPrakriti} ({currentA.scores?.constitutionType || "Bi-Doshic"})
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                      <span>Date: <strong className="text-stone-700">{currentA.date}</strong></span>
                      <span>•</span>
                      <span>
                        Evaluator:{" "}
                        <strong className="text-stone-700">
                          {currentA.conductedBy?.name} ({currentA.conductedBy?.role || "Resident"})
                        </strong>
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={FileText}
                    onClick={() => onViewReport(patient, currentA)}
                  >
                    View Formal Dossier
                  </Button>
                </div>

                {/* Supervisor Review Action Box (Doctor Role) */}
                {!currentA.supervisorApproved && (
                  <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Student Draft Pending Senior Vaidya Sign-Off</span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        Conducted by student scholar. Needs supervising clinical mentor to sign off and approve findings.
                      </p>
                    </div>

                    {activeRole === "doctor" && (
                      <Button
                        variant="gold"
                        size="sm"
                        icon={ShieldCheck}
                        onClick={() => onSupervisorApprove(patient.id, currentA.id)}
                        className="whitespace-nowrap"
                      >
                        Sign Off & Approve
                      </Button>
                    )}
                  </div>
                )}

                {/* Visual Radar & Subscore Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center p-4 bg-stone-50/60 rounded-2xl border border-stone-200">
                    <DoshaRadarChart scores={currentA.scores} size={240} />
                    <div className="text-[11px] text-stone-500 mt-2 text-center">
                      Tri-Dosha Polar Geometry (Equilateral Coordinate System)
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-sky-900">
                        <span>Vata (वात): {currentA.scores?.vata}%</span>
                        <span className="text-stone-500 text-[11px]">Air + Space</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${currentA.scores?.vata}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-amber-900">
                        <span>Pitta (पित्त): {currentA.scores?.pitta}%</span>
                        <span className="text-stone-500 text-[11px]">Fire + Water</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${currentA.scores?.pitta}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1 text-emerald-900">
                        <span>Kapha (कफ): {currentA.scores?.kapha}%</span>
                        <span className="text-stone-500 text-[11px]">Water + Earth</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${currentA.scores?.kapha}%` }}
                        />
                      </div>
                    </div>

                    {/* Dimensional Subscores */}
                    {currentA.scores?.subScores && (
                      <div className="pt-3 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                          <div className="font-semibold text-stone-700">Physical</div>
                          <div className="text-stone-500 mt-0.5">
                            V:{currentA.scores.subScores.physical?.vata}% P:{currentA.scores.subScores.physical?.pitta}% K:{currentA.scores.subScores.physical?.kapha}%
                          </div>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                          <div className="font-semibold text-stone-700">Physiological</div>
                          <div className="text-stone-500 mt-0.5">
                            V:{currentA.scores.subScores.physiological?.vata}% P:{currentA.scores.subScores.physiological?.pitta}% K:{currentA.scores.subScores.physiological?.kapha}%
                          </div>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
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
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
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

export default PatientHistoryView;
