import React, { useState } from "react";
import {
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { DoshaProportionBar } from "../report/DoshaRadarChart";
import { TRANSLATIONS } from "../../data/translations";

export function ReviewQueue({
  patients,
  onSupervisorApprove,
  onQuickViewReport,
  onNavigate,
  activeLang = "en"
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending"); // "all" | "pending" | "approved"
  const [selectedForApproval, setSelectedForApproval] = useState(null); // { patientId, assessmentId, patientName }
  const [approvalNotes, setApprovalNotes] = useState(
    "Official clinical verification confirmed by Supervising Vaidya."
  );

  // Collate all assessments with patient context, ensuring deduplication by ID
  const seenIds = new Set();
  const allQueueItems = patients.flatMap((p) =>
    (p.assessments || []).map((a) => ({
      ...a,
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      patientGender: p.gender,
      patientCity: p.city
    }))
  ).filter((item) => {
    const key = item.id || `${item.patientId}_${item.date}`;
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  const filteredItems = allQueueItems.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.conductedBy?.name &&
        item.conductedBy.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.scores?.dominantPrakriti &&
        item.scores.dominantPrakriti.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && !item.supervisorApproved) ||
      (filterStatus === "approved" && item.supervisorApproved);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = allQueueItems.filter((i) => !i.supervisorApproved).length;

  const handleOpenApproveModal = (patientId, assessmentId, patientName) => {
    setSelectedForApproval({ patientId, assessmentId, patientName });
    setApprovalNotes("Official clinical verification confirmed by Supervising Vaidya.");
  };

  const handleConfirmApproval = () => {
    if (!selectedForApproval) return;
    onSupervisorApprove(
      selectedForApproval.patientId,
      selectedForApproval.assessmentId,
      approvalNotes
    );
    setSelectedForApproval(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" size="sm" dot>
              {t.supervisorAuthorization || "Supervisor Authorization"}
            </Badge>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-500 font-medium">{t.sponsorHeader || "SDM College of Ayurveda, Udupi"}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-stone-900">
            {t.reviewQueueTitle || "Clinical Review & Sign-Off Queue"}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            {t.reviewQueueSubtitle || "Evaluate, verify, and digitally endorse constitutional assessments conducted by resident scholars and patient self-evaluations."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="block text-xl font-extrabold text-amber-900 font-serif-heading">
              {pendingCount}
            </span>
            <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
              {t.pendingApproval || "Pending Sign-Off"}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder || "Search patient, student, or constitution..."}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === "pending"
                  ? "bg-white text-amber-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t.pendingStatus || "Pending"} ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === "approved"
                  ? "bg-white text-emerald-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t.approvedStatus || "Approved"}
            </button>
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === "all"
                  ? "bg-white text-stone-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t.allStatuses || "All Items"}
            </button>
          </div>
        </div>
      </div>

      {/* Review Queue Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 font-serif-heading">
            No Assessments Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {filterStatus === "pending"
              ? "All student assessments have been reviewed and approved!"
              : "No assessments match your current search criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isPending = !item.supervisorApproved;
            const patient = patients.find((p) => p.id === item.patientId);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs transition-all space-y-4 ${
                  isPending
                    ? "border-amber-300/80 bg-amber-50/15"
                    : "border-stone-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                        {item.patientName}
                      </h3>
                      <span className="text-xs font-mono text-stone-500">
                        ({item.patientId})
                      </span>
                      {isPending ? (
                        <Badge variant="warning" size="sm" dot>
                          {t.pendingStatus || "Pending Sign-Off"}
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm" dot>
                          {t.approvedStatus || "Official Sign-Off Granted"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                      <span>{item.patientAge} yrs • {item.patientGender}</span>
                      <span>•</span>
                      <span>{item.patientCity || "Udupi"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-700">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="md">
                      {t.dominantDosha || "Dominant"}: <strong className="ml-1 text-stone-900">{item.scores?.dominantPrakriti}</strong>
                    </Badge>
                  </div>
                </div>

                {/* Score Bar and Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-stone-50/80 p-3.5 rounded-xl border border-stone-200">
                  <div className="md:col-span-8 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                      <span>{t.scoreBreakdown || "Constitutional Proportion (Vata • Pitta • Kapha)"}</span>
                      <span>{item.scores?.constitutionType || "Bi-Doshic"}</span>
                    </div>
                    <DoshaProportionBar scores={item.scores} className="h-2" />
                  </div>

                  <div className="md:col-span-4 flex items-center justify-around text-center text-xs">
                    <div>
                      <span className="text-[10px] text-sky-800 font-bold block">{t.vata || "Vata"}</span>
                      <span className="font-bold text-stone-800">{item.scores?.vata}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block">{t.pitta || "Pitta"}</span>
                      <span className="font-bold text-stone-800">{item.scores?.pitta}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold block">{t.kapha || "Kapha"}</span>
                      <span className="font-bold text-stone-800">{item.scores?.kapha}%</span>
                    </div>
                  </div>
                </div>

                {/* Submitter / Evaluator and Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-stone-100">
                  <div className="text-stone-600 flex flex-wrap items-center gap-2">
                    {item.conductedBy?.role === "patient" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full text-[11px] border border-purple-200">
                        👤 {t.submittedByPatient || "Patient Self-Assessment"}
                      </span>
                    ) : item.conductedBy?.role === "student" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full text-[11px] border border-sky-200">
                        🎓 {t.academicScholar || "Ayurveda Scholar (Student)"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                        👨‍⚕️ {t.seniorVaidya || "Clinician"}
                      </span>
                    )}
                    <span>
                      {item.conductedBy?.role === "patient" ? "Submitter:" : (t.conductedByLabel || "Evaluator:")}{" "}
                      <strong className="text-stone-900">
                        {item.conductedBy?.name || (item.conductedBy?.role === "patient" ? item.patientName : "BAMS Scholar")}
                      </strong>
                    </span>
                    {item.observations?.freeText && (
                      <span className="text-stone-500 italic ml-2 truncate max-w-xs inline-block align-bottom">
                        "{item.observations.freeText}"
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileText}
                      onClick={() => {
                        if (patient) onQuickViewReport(patient, item);
                      }}
                    >
                      {t.viewDoctorDossier || "Inspect Dossier"}
                    </Button>

                    {isPending && (
                      <Button
                        variant="gold"
                        size="sm"
                        icon={ShieldCheck}
                        onClick={() =>
                          handleOpenApproveModal(item.patientId, item.id, item.patientName)
                        }
                      >
                        {t.reviewAndSignOff || "Sign Off & Approve"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation & Clinical Endorsement Modal */}
      <Modal
        isOpen={Boolean(selectedForApproval)}
        onClose={() => setSelectedForApproval(null)}
        title={t.btnSignOff || "Official Clinical Sign-Off"}
        subtitle={`Patient: ${selectedForApproval?.patientName}`}
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedForApproval(null)}
            >
              {t.cancelBtn || "Cancel"}
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={ShieldCheck}
              onClick={handleConfirmApproval}
            >
              {t.btnSignOff || "Confirm Official Sign-Off"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Supervising Vaidya Clinical Attestation</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              By confirming, you attest that you have evaluated the student's clinical findings, verified the constitutional assessment, and officially endorse the report for publication in the patient Swastha portal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Supervisor Verification Remarks:
            </label>
            <textarea
              rows={3}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ReviewQueue;
