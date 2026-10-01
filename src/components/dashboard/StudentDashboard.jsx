import React from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Award,
  Layers,
  Activity,
  Calendar,
  LogOut
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { DoshaProportionBar } from "../report/DoshaRadarChart";
import { TRANSLATIONS } from "../../data/translations";

export function StudentDashboard({
  patients,
  onNavigate,
  onStartAssessment,
  onQuickViewReport,
  onOpenMethodology,
  onSignOut,
  activeLang = "en"
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  // Extract all student assessments
  const allAssessments = patients.flatMap((p) =>
    (p.assessments || []).map((a) => ({
      ...a,
      patientName: p.name,
      patientId: p.id
    }))
  );

  const totalConducted = allAssessments.length;
  const verifiedCount = allAssessments.filter((a) => a.supervisorApproved).length;
  const pendingCount = allAssessments.filter((a) => !a.supervisorApproved).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F2D6B] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-400 text-stone-950 uppercase tracking-wider">
              {t.academicStudentWorkflow || "BAMS Academic & Clinical Training Portal"}
            </span>
            <span className="text-blue-200 text-xs">•</span>
            <span className="text-xs text-blue-200">SDMCA Udupi / SMVITM Bantakal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-heading text-sky-100">
            {t.studentRoleBadge || "Ayurvedic Scholar Workspace"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
            {t.loginStudentDesc || "Conduct supervised Prakriti evaluations under clinical mentorship. Your submissions will be routed to senior Vaidyas for verification."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="gold"
            size="md"
            icon={Sparkles}
            onClick={() => onNavigate("assessment")}
          >
            {t.navNewAssessment || "New Assessment"}
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={BookOpen}
            onClick={onOpenMethodology}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            {t.navSamhitaReferences || "Study Samhita Shlokas"}
          </Button>
          {onSignOut && (
            <Button
              variant="outline"
              size="md"
              icon={LogOut}
              onClick={onSignOut}
              className="bg-rose-950/40 text-rose-200 border-rose-700/60 hover:bg-rose-900/60"
            >
              {t.logoutBtn || "Log Out"}
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          title={t.evaluationsConducted || "Evaluations Conducted"}
          value={totalConducted}
          subtitle="Clinical training sessions"
          icon={GraduationCap}
          color="sky"
          onClick={() => onNavigate("reports")}
        />
        <StatCard
          title={t.approvedStatus || "Supervisor Approved"}
          value={verifiedCount}
          subtitle={t.approvedBySupervisor || "Verified by Senior Vaidya"}
          icon={CheckCircle2}
          color="emerald"
          onClick={() => onNavigate("reports")}
        />
        <StatCard
          title={t.pendingStatus || "Awaiting Review"}
          value={pendingCount}
          subtitle={t.pendingSupervisorReview || "In supervisor queue"}
          icon={AlertCircle}
          color={pendingCount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Two Column Layout: Submissions vs Study Aid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Submissions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif-heading">
                  {t.evaluationsConducted || "My Recent Clinical Submissions"}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track the status of your patient evaluations and supervisor comments.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("reports")}
                iconRight={ArrowRight}
                className="text-xs text-sky-800"
              >
                {t.navReports || "All Reports"}
              </Button>
            </div>

            {allAssessments.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="text-xs font-bold text-stone-800">No Assessments Conducted Yet</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Select a patient from the directory to begin your first constitutional evaluation session.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate("patients")}
                  >
                    {t.navPatients || "Open Patient Directory"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {allAssessments.slice(0, 4).map((asm) => (
                  <div
                    key={asm.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-sky-300 transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-stone-900">
                          {asm.patientName}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{asm.date}</span>
                          <span>•</span>
                          <span className="font-mono text-stone-600">ID: {asm.id}</span>
                        </div>
                      </div>

                      {asm.supervisorApproved ? (
                        <Badge variant="success" size="sm" dot>
                          {t.approvedBySupervisor || "Approved by Vaidya"}
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm" dot>
                          {t.pendingApproval || "Pending Review"}
                        </Badge>
                      )}
                    </div>

                    <DoshaProportionBar scores={asm.scores} className="h-1.5" />

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                      <span className="text-stone-600 font-semibold">
                        {t.dominantDosha || "Dominant"}: {asm.scores?.dominantPrakriti}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const patient = patients.find((p) => p.id === asm.patientId);
                          if (patient) onQuickViewReport(patient, asm);
                        }}
                        className="text-xs font-semibold text-sky-800 hover:text-sky-900 hover:underline flex items-center gap-1"
                      >
                        <span>{t.inspectDossier || "View Dossier"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Samhita Study Reference Widget */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-stone-900 font-serif-heading">
                {t.classicalCitations || "Classical Pariksha Reference Aids"}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wide">
                  Charaka Samhita • Vimanasthana 8:95
                </div>
                <p className="italic text-stone-700 leading-relaxed text-[11px]">
                  "तत्र प्रकृतिरुच್ಯते स्वभावः..." — Constitution is the inborn physiological nature determined by maternal and paternal Sukra-Shonita at the instant of conception.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wide">
                  Ashtanga Hridaya • Sharirasthana 3:83
                </div>
                <p className="italic text-stone-700 leading-relaxed text-[11px]">
                  "तथा प्रकृतिरुत्पत्तौ..." — The dominant Dosha at fertilization governs the congenital constitution throughout life without altering unless vitiated pathologically.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenMethodology}
                icon={BookOpen}
                className="w-full text-xs text-stone-700"
              >
                {t.navSamhitaReferences || "Open Full Samhita Compendium"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
