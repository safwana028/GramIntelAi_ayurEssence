import React, { useState } from "react";
import { Search, UserPlus, Sparkles, History, Calendar, MapPin, AlertCircle, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { TRANSLATIONS } from "../../data/translations";

export function PatientList({
  patients,
  activeRole,
  activeLang,
  onSelectPatientForAssessment,
  onViewPatientHistory,
  onOpenNewPatientModal,
  onQuickViewReport
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPrakriti, setFilterPrakriti] = useState("all");

  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  const filteredPatients = patients.filter((pat) => {
    const matchesSearch =
      pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pat.city && pat.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pat.phone && pat.phone.includes(searchTerm));

    const matchesFilter =
      filterPrakriti === "all" ||
      (pat.baselinePrakriti && pat.baselinePrakriti.toLowerCase().includes(filterPrakriti.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
          />
        </div>

        {/* Filter & Add Patient */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={filterPrakriti}
            onChange={(e) => setFilterPrakriti(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-stone-700"
          >
            <option value="all">All Constitutions (ಎಲ್ಲಾ ಪ್ರಕೃತಿ)</option>
            <option value="vata">Vata Predominant</option>
            <option value="pitta">Pitta Predominant</option>
            <option value="kapha">Kapha Predominant</option>
          </select>

          {activeRole !== "patient" && (
            <button
              onClick={onOpenNewPatientModal}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.newPatientBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          const assessments = patient.assessments || [];
          const latestAssessment = assessments[assessments.length - 1];
          const hasPending = assessments.some((a) => !a.supervisorApproved);

          return (
            <div
              key={patient.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 tracking-tight">
                      {patient.name}
                    </h3>
                    <div className="text-[11px] font-mono text-stone-500">
                      {patient.id}
                    </div>
                  </div>

                  {/* Constitutional Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      patient.baselinePrakriti?.toLowerCase().includes("vata")
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : patient.baselinePrakriti?.toLowerCase().includes("pitta")
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {patient.baselinePrakriti || "Unassessed"}
                  </span>
                </div>

                {/* Demographics */}
                <div className="space-y-1.5 my-3 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{t.age} / {t.gender}:</span>
                    <span className="font-medium text-stone-700">{patient.age} yrs • {patient.gender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">{t.location}:</span>
                    <span className="font-medium text-stone-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {patient.city || "Udupi, Karnataka"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Diet (Ahara):</span>
                    <span className="font-medium text-stone-700">{patient.dietType || "Vegetarian"}</span>
                  </div>
                </div>

                {/* Supervisor Review Status Pill */}
                {hasPending && (
                  <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-[11px] text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{t.pendingApproval}</span>
                  </div>
                )}
              </div>

              {/* Assessment Status & Footer Actions */}
              <div className="pt-3 border-t border-stone-100 mt-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {latestAssessment ? `Latest: ${latestAssessment.date}` : "No assessment yet"}
                  </span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {assessments.length} {t.assessmentsCount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectPatientForAssessment(patient)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.startAssessmentFor}</span>
                  </button>

                  {latestAssessment ? (
                    <button
                      onClick={() => onQuickViewReport(patient, latestAssessment)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>View Dossier</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewPatientHistory(patient)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-stone-500" />
                      <span>{t.viewHistory}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
