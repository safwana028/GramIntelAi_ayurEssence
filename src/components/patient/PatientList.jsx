import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Sparkles,
  History,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users
} from "lucide-react";
import { TRANSLATIONS } from "../../data/translations";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

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
      (pat.baselinePrakriti &&
        pat.baselinePrakriti.toLowerCase().includes(filterPrakriti.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Search Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50/50"
          />
        </div>

        {/* Filter & Add Patient */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={filterPrakriti}
            onChange={(e) => setFilterPrakriti(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white text-stone-700"
          >
            <option value="all">All Constitutions (ಎಲ್ಲಾ ಪ್ರಕೃತಿ)</option>
            <option value="vata">Vata Predominant</option>
            <option value="pitta">Pitta Predominant</option>
            <option value="kapha">Kapha Predominant</option>
          </select>

          {activeRole !== "patient" && (
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={onOpenNewPatientModal}
              className="whitespace-nowrap"
            >
              {t.newPatientBtn}
            </Button>
          )}
        </div>
      </div>

      {/* Patient Directory Grid */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Found"
          description="No registered profiles match your search criteria. Try a different query or add a new patient."
          actionLabel={activeRole !== "patient" ? "Register New Patient" : undefined}
          onAction={activeRole !== "patient" ? onOpenNewPatientModal : undefined}
          actionIcon={UserPlus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => {
            const assessments = patient.assessments || [];
            const latestAssessment = assessments[assessments.length - 1];
            const hasPending = assessments.some((a) => !a.supervisorApproved);

            // Determine badge variant
            const baseline = (patient.baselinePrakriti || "").toLowerCase();
            const badgeVariant = baseline.includes("vata")
              ? "vata"
              : baseline.includes("pitta")
              ? "pitta"
              : baseline.includes("kapha")
              ? "kapha"
              : "neutral";

            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 tracking-tight font-serif-heading">
                        {patient.name}
                      </h3>
                      <div className="text-[11px] font-mono text-stone-500">
                        {patient.id}
                      </div>
                    </div>

                    <Badge variant={badgeVariant} size="sm">
                      {patient.baselinePrakriti || "Unassessed"}
                    </Badge>
                  </div>

                  {/* Demographics */}
                  <div className="space-y-1.5 my-3 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">{t.age} / {t.gender}:</span>
                      <span className="font-medium text-stone-700">
                        {patient.age} yrs • {patient.gender}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">{t.location}:</span>
                      <span className="font-medium text-stone-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {patient.city || "Udupi, Karnataka"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">Diet (Ahara):</span>
                      <span className="font-medium text-stone-700">
                        {patient.dietType || "Vegetarian"}
                      </span>
                    </div>
                  </div>

                  {/* Supervisor Review Status Pill */}
                  {hasPending && (
                    <div className="mb-2 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-[11px] text-amber-900">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{t.pendingApproval}</span>
                    </div>
                  )}
                </div>

                {/* Assessment Status & Footer Actions */}
                <div className="pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {latestAssessment
                        ? `Latest: ${latestAssessment.date}`
                        : "No assessment yet"}
                    </span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {assessments.length} {t.assessmentsCount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Sparkles}
                      onClick={() => onSelectPatientForAssessment(patient)}
                      className="w-full text-xs"
                    >
                      {t.startAssessmentFor}
                    </Button>

                    {latestAssessment ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={FileText}
                        onClick={() => onQuickViewReport(patient, latestAssessment)}
                        className="w-full text-xs"
                      >
                        View Dossier
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={History}
                        onClick={() => onViewPatientHistory(patient)}
                        className="w-full text-xs"
                      >
                        {t.viewHistory}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PatientList;
