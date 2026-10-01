import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Send,
  Printer,
  Eye,
  ShieldCheck,
  User,
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { DoshaProportionBar } from "../report/DoshaRadarChart";
import { TRANSLATIONS } from "../../data/translations";

export function ReportsView({
  patients,
  activeRole,
  onQuickViewReport,
  onDoctorDeliverReport,
  activeLang = "en"
}) {
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterConstitution, setFilterConstitution] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Aggregate all assessments with strict deduplication by ID
  const seenIds = new Set();
  const allReports = patients.flatMap((p) =>
    (p.assessments || []).map((a) => ({
      ...a,
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      patientGender: p.gender,
      patientCity: p.city
    }))
  ).filter((rep) => {
    const key = rep.id || `${rep.patientId}_${rep.date}`;
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  const filteredReports = allReports.filter((rep) => {
    const matchesSearch =
      rep.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.scores?.dominantPrakriti &&
        rep.scores.dominantPrakriti.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rep.conductedBy?.name &&
        rep.conductedBy.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDosha =
      filterConstitution === "all" ||
      (rep.scores?.dominantPrakriti &&
        rep.scores.dominantPrakriti.toLowerCase().includes(filterConstitution.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "delivered" && rep.reportDelivered) ||
      (filterStatus === "pending" && !rep.supervisorApproved) ||
      (filterStatus === "approved" && rep.supervisorApproved && !rep.reportDelivered);

    return matchesSearch && matchesDosha && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" size="sm">
              {t.clinicalArchive || "Clinical Archive"}
            </Badge>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-500 font-medium">{t.sponsorHeader || "SDM College of Ayurveda"}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-stone-900">
            {t.clinicalReportTitle || "Ayurvedic Clinical Reports Repository"}
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            {t.clinicalReportSubtitle || "Central repository of constitutional assessments, multi-axial calculations, and patient-delivered Dinacharya guides."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-semibold">
            Total Dossiers: <strong className="text-stone-900">{allReports.length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient, ID, or evaluator..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <select
            value={filterConstitution}
            onChange={(e) => setFilterConstitution(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white text-stone-700"
          >
            <option value="all">All Constitutions</option>
            <option value="vata">Vata Dominant</option>
            <option value="pitta">Pitta Dominant</option>
            <option value="kapha">Kapha Dominant</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered to Patient</option>
            <option value="approved">Supervisor Approved</option>
            <option value="pending">Pending Sign-Off</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <FileText className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 font-serif-heading">
            No Reports Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search criteria or filter options to locate the patient dossier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const patient = patients.find((p) => p.id === report.patientId);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-600/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                        {report.patientName}
                      </h3>
                      <div className="text-[11px] font-mono text-stone-500">
                        {report.patientId} • ID: {report.id}
                      </div>
                    </div>

                    {report.reportDelivered ? (
                      <Badge variant="success" size="sm" dot>
                        Delivered
                      </Badge>
                    ) : report.supervisorApproved ? (
                      <Badge variant="info" size="sm" dot>
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm" dot>
                        Draft / Review
                      </Badge>
                    )}
                  </div>

                  <div className="my-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[11px]">Dominant Prakriti:</span>
                      <strong className="text-stone-900 font-serif-heading">
                        {report.scores?.dominantPrakriti}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[11px]">Evaluation Date:</span>
                      <span className="font-medium text-stone-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {report.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[11px]">
                        {report.conductedBy?.role === "patient" ? "Submitted By:" : "Conducted By:"}
                      </span>
                      <span className="font-medium text-stone-700 truncate max-w-[170px] flex items-center gap-1">
                        {report.conductedBy?.role === "patient" ? (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            👤 Patient
                          </span>
                        ) : report.conductedBy?.role === "student" ? (
                          <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                            🎓 Scholar
                          </span>
                        ) : null}
                        <span>{report.conductedBy?.name || "Clinician"}</span>
                      </span>
                    </div>
                  </div>

                  <DoshaProportionBar scores={report.scores} className="h-2 my-2" />

                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-1">
                    <span>V: {report.scores?.vata}%</span>
                    <span>P: {report.scores?.pitta}%</span>
                    <span>K: {report.scores?.kapha}%</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      if (patient) onQuickViewReport(patient, report);
                    }}
                    className="flex-1"
                  >
                    View Dossier
                  </Button>

                  {activeRole === "doctor" && !report.reportDelivered && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Send}
                      onClick={() => onDoctorDeliverReport(report.patientId, report.id)}
                      className="px-2.5"
                      title="Deliver to Patient Swastha Portal"
                    >
                      Deliver
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReportsView;
