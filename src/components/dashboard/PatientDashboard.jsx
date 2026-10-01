import React from "react";
import {
  Sparkles,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  HeartHandshake,
  Activity,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { DoshaProportionBar } from "../report/DoshaRadarChart";
import { TRANSLATIONS } from "../../data/translations";

export function PatientDashboard({
  patient,
  onNavigate,
  onStartAssessment,
  onQuickViewReport,
  onSignOut,
  activeLang = "en"
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const assessments = patient?.assessments || [];
  const latestAssessment = assessments[assessments.length - 1];
  const isPendingReview = latestAssessment && !latestAssessment.supervisorApproved;
  const isFinalized = latestAssessment && latestAssessment.supervisorApproved;

  return (
    <div className="space-y-8 pb-12">
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-[#143B30] via-[#1E4D3E] to-[#0A241C] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-stone-950 uppercase tracking-wider">
              {t.rolePatient || "Patient (Swastha Portal)"}
            </span>
            <span className="text-emerald-300 text-xs">•</span>
            <span className="text-xs text-emerald-200">SDM College of Ayurveda & Hospital, Udupi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-heading text-emerald-100">
            {t.namaste || "Namaste"}, {patient?.name || "Patient"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            {t.patientDashboardSubtitle || "Complete your Prakriti evaluation, view doctor-verified recommendations, and balance your daily regimen (Dinacharya)."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="gold"
            size="md"
            icon={Sparkles}
            onClick={() => onStartAssessment(patient)}
          >
            {t.startSelfAssessment || "Start Self-Assessment"}
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

      {/* Assessment Status Notice Card */}
      {isPendingReview && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900">
                  {t.submittedByPatient || "Self-Assessment Submitted"} — {t.pendingApproval || "Under Doctor Review"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-stone-950">
                  {t.pendingApproval || "Pending Review"}
                </span>
              </div>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                {t.ethicalDisclaimerDetailed || "Your 24-question Prakriti assessment has been recorded and submitted to the Institutional Doctor Review Queue. Dr. K. Raghavendra Rao will verify your clinical observations and endorse your Dinacharya lifestyle guide."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => onQuickViewReport(patient, latestAssessment)}
            className="whitespace-nowrap shrink-0"
          >
            {t.viewPatientSummary || "View Submitted Draft"}
          </Button>
        </div>
      )}

      {isFinalized && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900">
                  {t.verifiedByDoctor || "Official Prakriti Report Verified & Available"}
                </h3>
                <Badge variant="success" size="sm" dot>
                  {t.finalized || "Doctor Finalized"}
                </Badge>
              </div>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                {t.yourConstitution || "Your constitution has been confirmed as"}: <strong className="text-emerald-900">{latestAssessment.scores?.dominantPrakriti}</strong>. {t.approvedBySupervisor || "Verified by Supervising Vaidya with classical diet (Ahara) and seasonal regimen (Ritucharya)." }
              </p>
            </div>
          </div>
          <Button
            variant="gold"
            size="sm"
            icon={ArrowRight}
            onClick={() => onQuickViewReport(patient, latestAssessment)}
            className="whitespace-nowrap shrink-0"
          >
            {t.viewPatientSummary || "View Official Report"}
          </Button>
        </div>
      )}

      {/* Main Grid: Patient Profile & Assessment History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Profile Summary */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 font-serif-heading">
                {t.patientDemographicsTitle || "Patient Dossier"}
              </h2>
              <span className="text-xs font-mono text-stone-500">
                {patient?.id}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.name || "Full Name"}</span>
                <span className="font-semibold text-stone-900">{patient?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.age || "Age"} & {t.gender || "Gender"}</span>
                <span className="font-semibold text-stone-900">{patient?.age} yrs • {patient?.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.contact || "Registered Email"}</span>
                <span className="font-semibold text-stone-900">{patient?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.location || "Location"}</span>
                <span className="font-semibold text-stone-900">{patient?.city}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.constitution || "Baseline Prakriti"}</span>
                <span className="font-bold text-emerald-800">{patient?.baselinePrakriti || (t.pendingApproval || "Pending Assessment")}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">{t.primaryComplaint || "Primary Complaint"}</span>
                <span className="font-medium text-stone-800 text-right max-w-[180px] truncate">{patient?.primaryComplaint}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                onClick={() => onStartAssessment(patient)}
                className="w-full justify-center"
              >
                {t.startSelfAssessment || "Begin First Assessment"}
              </Button>
            </div>
          </div>

          {/* Classical Reference Card */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-sm border border-emerald-900 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.charakaCitation || "Charaka Samhita Reference"}</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed italic">
              "तत्र प्रकृत्या वातलाः, पित्तलाः, श्लेष्मलाः... समधातवश्च भवन्ति।"
            </p>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              {t.ethicalDisclaimerDetailed || "Every individual possesses a unique inherent constitutional balance determined at conception. Understanding your Prakriti allows optimal lifestyle adaptation without suppressing innate biological rhythms."}
            </p>
          </div>
        </div>

        {/* Right Column: Assessment History & Detailed Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                  {t.navHistory || "My Constitutional History"}
                </h3>
                <p className="text-xs text-stone-500">
                  {t.patientDashboardSubtitle || "Track your constitutional assessments and doctor approvals"}
                </p>
              </div>
              <Badge variant="neutral" size="sm">
                {t.totalDossiers || "Total Sessions"}: {assessments.length}
              </Badge>
            </div>

            {assessments.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
                <Activity className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800 font-serif-heading">
                  No Assessments Completed Yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Click the button below to answer the 24 classical questions and discover your unique Vata, Pitta, and Kapha constitutional balance.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  icon={Sparkles}
                  onClick={() => onStartAssessment(patient)}
                >
                  {t.startSelfAssessment || "Start Self-Assessment"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((asm, idx) => (
                  <div
                    key={asm.id || idx}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">
                          {asm.scores?.dominantPrakriti || "Assessment Session"}
                        </span>
                        <span className="text-xs font-mono text-stone-500">({asm.id})</span>
                        {asm.supervisorApproved ? (
                          <Badge variant="success" size="sm" dot>
                            {t.verifiedByDoctor || "Doctor Verified"}
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm" dot>
                            {t.pendingApproval || "Under Review"}
                          </Badge>
                        )}
                      </div>

                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {asm.date}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                        <span>{t.scoreBreakdown || "Constitutional Proportion (Vata • Pitta • Kapha)"}</span>
                        <span>{asm.scores?.constitutionType || "Bi-Doshic"}</span>
                      </div>
                      <DoshaProportionBar scores={asm.scores} className="h-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/60 text-xs">
                      <div className="text-stone-600 text-[11px]">
                        {t.conductedByLabel || "Conducted by"}:{" "}
                        <span className="font-semibold text-stone-800">
                          {asm.conductedBy?.name || (t.submittedByPatient || "Patient Self-Assessment")}
                        </span>
                        {asm.conductedBy?.role === "patient" && (
                          <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            {t.submittedByPatient || "Self-Assessment"}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={FileText}
                        onClick={() => onQuickViewReport(patient, asm)}
                      >
                        {t.viewPatientSummary || "View Report & Dinacharya"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
