import React from "react";
import {
  Users,
  FileCheck2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText,
  UserPlus,
  Layers,
  Download,
  Activity,
  CheckCircle2
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { DoshaProportionBar } from "../report/DoshaRadarChart";

export function DoctorDashboard({
  patients,
  onNavigate,
  onStartAssessment,
  onQuickViewReport,
  onSupervisorApprove,
  onOpenNewPatientModal,
  onExportBackup
}) {
  // Aggregate Metrics
  const totalPatients = patients.length;

  const allAssessments = patients.flatMap((p) =>
    (p.assessments || []).map((a) => ({
      ...a,
      patientName: p.name,
      patientId: p.id,
      patientBaseline: p.baselinePrakriti
    }))
  );

  const totalAssessments = allAssessments.length;
  const pendingAssessments = allAssessments.filter((a) => !a.supervisorApproved);
  const deliveredAssessments = allAssessments.filter((a) => a.reportDelivered);

  // Dominant Dosha Cohort Distribution
  const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
  patients.forEach((p) => {
    const baseline = (p.baselinePrakriti || "").toLowerCase();
    if (baseline.includes("vata")) doshaCounts.vata += 1;
    else if (baseline.includes("pitta")) doshaCounts.pitta += 1;
    else if (baseline.includes("kapha")) doshaCounts.kapha += 1;
  });

  const recentAssessments = [...allAssessments]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Clinician Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
              Senior Vaidya Workspace
            </span>
            <span className="text-emerald-300 text-xs">•</span>
            <span className="text-xs text-emerald-200">SDM College of Ayurveda, Udupi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-heading text-amber-100">
            Ayurvedic Clinical Overview
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Monitor institutional patient records, verify student constitutional assessments, and supervise constitutional Dinacharya recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="gold"
            size="md"
            icon={Sparkles}
            onClick={() => onNavigate("assessment")}
          >
            Start Assessment
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={UserPlus}
            onClick={onOpenNewPatientModal}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Add Patient
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Registered Patients"
          value={totalPatients}
          subtitle="Active OPD Directory"
          icon={Users}
          color="emerald"
          onClick={() => onNavigate("patients")}
        />
        <StatCard
          title="Assessments Conducted"
          value={totalAssessments}
          subtitle={`${deliveredAssessments.length} delivered to patient`}
          icon={FileCheck2}
          color="sky"
          onClick={() => onNavigate("reports")}
        />
        <StatCard
          title="Review Queue"
          value={pendingAssessments.length}
          subtitle={
            pendingAssessments.length > 0
              ? "Requires supervisor sign-off"
              : "All student drafts verified"
          }
          icon={AlertCircle}
          color={pendingAssessments.length > 0 ? "amber" : "emerald"}
          onClick={() => onNavigate("reviewQueue")}
        />
        <StatCard
          title="Cohort Tridosha"
          value={`${Math.round((doshaCounts.pitta / (totalPatients || 1)) * 100)}%`}
          subtitle="Pitta dominant in coastal zone"
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Review Queue (Priority Action) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif-heading flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Student Assessments Awaiting Sign-Off</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Academic evaluations conducted by BAMS scholars needing senior clinical validation.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("reviewQueue")}
                iconRight={ArrowRight}
                className="text-xs text-emerald-800"
              >
                View All ({pendingAssessments.length})
              </Button>
            </div>

            {pendingAssessments.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-stone-800">
                  Review Queue Is Up to Date
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  All student clinical assessments have been officially verified and signed off.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssessments.slice(0, 3).map((asm) => (
                  <div
                    key={asm.id}
                    className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/40 hover:bg-amber-50/80 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">
                            {asm.patientName}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500">
                            ({asm.patientId})
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5">
                          Evaluated by:{" "}
                          <strong className="text-stone-800">
                            {asm.conductedBy?.name || "BAMS Scholar"}
                          </strong>
                        </div>
                      </div>

                      <Badge variant="pitta" size="sm">
                        {asm.scores?.dominantPrakriti || "Prakriti Draft"}
                      </Badge>
                    </div>

                    <DoshaProportionBar scores={asm.scores} className="h-1.5" />

                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
                      <span className="text-stone-500 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {asm.date}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const patient = patients.find((p) => p.id === asm.patientId);
                            if (patient) onQuickViewReport(patient, asm);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg shadow-2xs hover:bg-stone-50"
                        >
                          Inspect Dossier
                        </button>
                        <Button
                          variant="gold"
                          size="sm"
                          icon={ShieldCheck}
                          onClick={() => onSupervisorApprove(asm.patientId, asm.id)}
                          className="py-1 text-xs"
                        >
                          Sign Off
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity & Quick Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Clinical Actions */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-serif-heading">
              Quick Clinical Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate("patients")}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-600/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <Users className="w-5 h-5 text-emerald-800 group-hover:scale-105 transition-transform" />
                <div className="font-bold text-xs text-stone-800 mt-2">Patient Directory</div>
                <div className="text-[10px] text-stone-500">Search {totalPatients} profiles</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-600/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <FileText className="w-5 h-5 text-sky-800 group-hover:scale-105 transition-transform" />
                <div className="font-bold text-xs text-stone-800 mt-2">Reports Archive</div>
                <div className="text-[10px] text-stone-500">Delivered dossiers</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("builder")}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-600/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <Layers className="w-5 h-5 text-amber-700 group-hover:scale-105 transition-transform" />
                <div className="font-bold text-xs text-stone-800 mt-2">Questionnaire Builder</div>
                <div className="text-[10px] text-stone-500">Custom protocols</div>
              </button>

              <button
                type="button"
                onClick={onExportBackup}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-600/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <Download className="w-5 h-5 text-stone-700 group-hover:scale-105 transition-transform" />
                <div className="font-bold text-xs text-stone-800 mt-2">Backup Database</div>
                <div className="text-[10px] text-stone-500">Export JSON archive</div>
              </button>
            </div>
          </div>

          {/* Recent Evaluations Feed */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 font-serif-heading">
                Recent Evaluations
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recentAssessments.map((asm) => (
                <div
                  key={asm.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-stone-900">
                      {asm.patientName}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {asm.scores?.dominantPrakriti} • {asm.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {asm.supervisorApproved ? (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending
                      </Badge>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const pat = patients.find((p) => p.id === asm.patientId);
                        if (pat) onQuickViewReport(pat, asm);
                      }}
                      className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
                      title="View Dossier"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
