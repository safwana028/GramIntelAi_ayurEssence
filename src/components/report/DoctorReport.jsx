import React, { useState } from "react";
import { ShieldCheck, AlertCircle, Award, BookOpen, Printer, CheckCircle2, Eye, Send, Sparkles, Phone, Mail, FileText, Check } from "lucide-react";
import { DoshaRadarChart, DoshaProportionBar } from "./DoshaRadarChart";
import { ChosenAnswerMatrix } from "./ChosenAnswerMatrix";
import { LifestyleImpactSimulator } from "./LifestyleImpactSimulator";
import { DOSHA_PROFILES } from "../../data/samhitaReferences";
import { TRANSLATIONS } from "../../data/translations";
import { api } from "../../services/apiService";

export function DoctorReport({
  patient,
  assessment,
  activeRole,
  activeLang = "en"
}) {
  const [deliveryStatus, setDeliveryStatus] = useState(null); // { type: 'email'|'sms', text: string }
  const [isDispatching, setIsDispatching] = useState(false);

  if (!patient || !assessment) return null;

  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const { scores, observations, conductedBy, date, supervisorApproved, season } = assessment;

  const handleDirectEmailDispatch = async () => {
    if (!patient.email) {
      alert("No email address registered for this patient.");
      return;
    }
    setIsDispatching(true);
    try {
      const subject = encodeURIComponent(`Ayurvedic Prakriti Report - ${patient.name} (${assessment.id})`);
      const body = encodeURIComponent(
        `Namaste ${patient.name},\n\nYour official Deha Prakriti Assessment Report from SDM College of Ayurveda & Hospital, Udupi has been finalized.\n\nEvaluated Constitution: ${scores.dominantPrakriti} (${scores.constitutionType})\n- Vata: ${scores.vata}%\n- Pitta: ${scores.pitta}%\n- Kapha: ${scores.kapha}%\n\nAttending Vaidya Recommendations:\n"${assessment.patientMessage || 'Follow balanced Ahara and Dinacharya routines.'}"\n\nThank you,\nSDM College of Ayurveda & Hospital, Udupi`
      );

      // Open email composer prefilled with patient email
      window.location.href = `mailto:${patient.email}?subject=${subject}&body=${body}`;

      try {
        if (assessment.id) {
          await api.deliverReport(assessment.id);
        }
      } catch {}

      setDeliveryStatus({
        type: "email",
        text: `📧 Email client launched for ${patient.email}. Report dispatched to patient.`
      });
    } catch (err) {
      console.warn("Email dispatch notice:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleDirectSmsDispatch = async () => {
    if (!patient.phone) {
      alert("Please ensure patient phone number is provided.");
      return;
    }
    setIsDispatching(true);
    try {
      const phoneNum = (patient.phone || "").replace(/[^0-9]/g, "");
      const text = encodeURIComponent(
        `Namaste ${patient.name}, your Ayurvedic Prakriti Report: Dominant ${scores.dominantPrakriti} (V:${scores.vata}% P:${scores.pitta}% K:${scores.kapha}%). Doctor Note: ${assessment.patientMessage || 'Follow balanced Ahara/Dinacharya'}. SDMCA Hospital Udupi`
      );
      if (phoneNum) {
        window.open(`https://wa.me/${phoneNum}?text=${text}`, "_blank");
      }

      try {
        if (assessment.id) {
          await api.deliverReport(assessment.id);
        }
      } catch {}

      setDeliveryStatus({
        type: "sms",
        text: `📲 WhatsApp/SMS gateway opened for ${patient.phone}. Report dispatched to patient.`
      });
    } catch (err) {
      console.warn("SMS dispatch notice:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-md max-w-4xl mx-auto overflow-hidden print:shadow-none print:border-none print:m-0">
      {/* Printable Clinical Header */}
      <div className="bg-[#1E4D3E] text-white p-6 sm:p-8 border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <TridoshaLabLogo variant="icon" size="lg" light={true} className="shrink-0 mt-1" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
                  {t.sponsorHeader || "SDM College of Ayurveda & Hospital, Udupi"}
                </span>
                <span className="text-emerald-400">•</span>
                <span className="text-[10px] text-emerald-200 font-mono">{t.appTitle}</span>
              </div>
              <h1 className="text-2xl font-bold font-serif-heading tracking-tight text-white">
                {t.reportDossierTitle || "Deha Prakriti Pariksha Dossier"}
              </h1>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t.reportDossierSubtitle || "Comprehensive Constitutional Assessment & Clinical Evidence Report"}
              </p>
            </div>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="bg-[#13352A] px-3 py-1.5 rounded-lg border border-emerald-700/60 inline-block">
              <span className="text-emerald-300 font-mono">{t.dossierId || "Dossier ID"}: </span>
              <strong className="text-white font-mono">{assessment.id || "ASM-2026-UDU"}</strong>
            </div>
            <div className="text-emerald-200/80 text-[11px]">
              {t.date || "Date"}: <strong className="text-white">{date}</strong> • {t.season || "Season"}: {season || "Sharad"}
            </div>
          </div>
        </div>
      </div>

      {/* Report Body */}
      <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-800">
        {/* Patient Demographics Banner */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2">
            {t.patientDemographicsTitle || "Patient Demographics & Clinical Profile"}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-stone-400 block text-[11px]">{t.name || "Full Name"}:</span>
              <span className="font-bold text-stone-900 text-sm">{patient.name}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{t.dossierId || "Patient ID"}:</span>
              <span className="font-mono text-stone-700">{patient.id}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{t.age || "Age"} & {t.gender || "Gender"}:</span>
              <span className="font-semibold text-stone-800">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{t.location || "Region"}:</span>
              <span className="font-semibold text-stone-800">{patient.city || "Udupi, Karnataka"}</span>
            </div>
          </div>
        </div>

        {/* Primary Constitution Result Card */}
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border-2 border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              {t.dominantDosha || "Evaluated Constitutional State (Prakriti)"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-heading">
              {scores.dominantPrakriti}
            </h2>
            <div className="text-xs text-stone-600 mt-1">
              {t.constitution || "Constitutional Category"}: <strong className="text-stone-800">{scores.constitutionType}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-center px-4 py-3 bg-sky-100/90 rounded-2xl border border-sky-300 shadow-2xs">
              <span className="block text-xs font-bold text-sky-800 uppercase tracking-wider">{t.vata || "Vata"}</span>
              <span className="text-5xl sm:text-6xl font-extrabold text-sky-950 tracking-tight">{scores.vata}%</span>
            </div>
            <div className="text-center px-4 py-3 bg-amber-100/90 rounded-2xl border border-amber-300 shadow-2xs">
              <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">{t.pitta || "Pitta"}</span>
              <span className="text-5xl sm:text-6xl font-extrabold text-amber-950 tracking-tight">{scores.pitta}%</span>
            </div>
            <div className="text-center px-4 py-3 bg-emerald-100/90 rounded-2xl border border-emerald-300 shadow-2xs">
              <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">{t.kapha || "Kapha"}</span>
              <span className="text-5xl sm:text-6xl font-extrabold text-emerald-950 tracking-tight">{scores.kapha}%</span>
            </div>
          </div>
        </div>

        {/* Visual Radar and Dimensional Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-stone-50/60 p-4 rounded-xl border border-stone-200 flex flex-col items-center">
            <DoshaRadarChart scores={scores} size={250} />
            <div className="text-[10px] text-stone-500 mt-2 text-center">
              Tri-Dosha Radial Coordinate Mapping (Charaka Vimana 8)
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t.scoreBreakdown || "Constitutional Dimensions Breakdown"}
            </h3>

            {scores.subScores && (
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                    <span>{t.physicalTraits || "Physical Traits (Sharirika)"}</span>
                    <span>V: {scores.subScores.physical?.vata}% | P: {scores.subScores.physical?.pitta}% | K: {scores.subScores.physical?.kapha}%</span>
                  </div>
                  <DoshaProportionBar scores={scores.subScores.physical || scores} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                    <span>{t.physiologicalTraits || "Physiological Traits (Kriyatmaka)"}</span>
                    <span>V: {scores.subScores.physiological?.vata}% | P: {scores.subScores.physiological?.pitta}% | K: {scores.subScores.physiological?.kapha}%</span>
                  </div>
                  <DoshaProportionBar scores={scores.subScores.physiological || scores} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                    <span>{t.psychologicalTraits || "Psychological Traits (Manasika)"}</span>
                    <span>V: {scores.subScores.psychological?.vata}% | P: {scores.subScores.psychological?.pitta}% | K: {scores.subScores.psychological?.kapha}%</span>
                  </div>
                  <DoshaProportionBar scores={scores.subScores.psychological || scores} className="h-2" />
                </div>
              </div>
            )}

            <div className="bg-stone-100 p-3 rounded-lg text-[11px] text-stone-600 leading-relaxed mt-2">
              <strong className="text-stone-800">{t.scoringRationale || "Scoring Rationale"}: </strong>
              {scores.rationale}
            </div>
          </div>
        </div>

        {/* Chosen Answer Trait Comparison Matrix */}
        <ChosenAnswerMatrix answers={assessment.answers} scores={scores} activeLang={activeLang} />

        {/* Working Innovation: Interactive Dinacharya & Ahara Simulator */}
        <LifestyleImpactSimulator baseScores={scores} />

        {/* Practitioner Clinical Observations & Ashtavidha */}
        {observations && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t.clinicalObservations || "Practitioner Clinical Observations (Darshana & Sparshana)"}
            </h3>

            {observations.freeText && (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <p className="italic text-stone-700 leading-relaxed text-xs">
                  "{observations.freeText}"
                </p>

                {observations.nlpIndicators && observations.nlpIndicators.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">
                      {t.detectedCues || "Detected Cues"}:
                    </span>
                    {observations.nlpIndicators.map((ind, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-stone-300 text-stone-700"
                      >
                        {ind.matchedPhrase} ({ind.dosha})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {observations.ashtavidha && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Nadi (Pulse):</span>
                  <span className="font-semibold text-stone-800">{observations.ashtavidha.nadi}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Jihva (Tongue):</span>
                  <span className="font-semibold text-stone-800">{observations.ashtavidha.jihva}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Sparsha (Touch):</span>
                  <span className="font-semibold text-stone-800">{observations.ashtavidha.sparsha}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Drik (Gaze):</span>
                  <span className="font-semibold text-stone-800">{observations.ashtavidha.drik}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editable Doctor Recommendations & Real Delivery Dispatch Section */}
        <div className="bg-emerald-50/80 p-5 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-3 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Doctor Prescribed Clinical Recommendations & Delivery Dispatch</span>
            </h3>
            <span className="text-[10px] text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Patient Contact: {patient.phone || "Phone compulsory"} • {patient.email || "Email optional"}
            </span>
          </div>

          <p className="text-stone-800 text-xs italic bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed">
            "{assessment.patientMessage || "Maintain warm cooked meals, regular sleep schedules, and avoid cold drafts as per your baseline constitution."}"
          </p>

          {deliveryStatus && (
            <div className="bg-emerald-900 text-white p-3.5 rounded-xl border border-emerald-700 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{deliveryStatus.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryStatus(null)}
                className="text-emerald-300 hover:text-white text-[11px] underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-emerald-900 font-medium">
              📲 SMS/WhatsApp Target: <strong>{patient.phone || "Phone Compulsory"}</strong> | ✉️ Email Target: <strong>{patient.email || "Email Optional"}</strong>
            </div>

            <div className="flex items-center gap-2">
              {patient.email && (
                <button
                  type="button"
                  disabled={isDispatching}
                  onClick={handleDirectEmailDispatch}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isDispatching ? "Dispatching..." : `Send via Email (${patient.email})`}</span>
                </button>
              )}

              <button
                type="button"
                disabled={isDispatching}
                onClick={handleDirectSmsDispatch}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isDispatching ? "Dispatching..." : `Send via WhatsApp/SMS (${patient.phone || 'Phone Required'})`}</span>
              </button>
            </div>
          </div>
        </div>


        {/* Per-Question Clinical Observation Notes (if recorded) */}
        {assessment.questionNotes && Object.keys(assessment.questionNotes).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t.perQuestionNotes || "Per-Question Clinical Notes"} ({Object.keys(assessment.questionNotes).length} Recorded)
            </h3>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {Object.entries(assessment.questionNotes).map(([qId, note]) => (
                <div key={qId} className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold block">{qId}:</span>
                  <span className="text-stone-700 italic">"{note}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Separate Patient-Facing Message (Delivered to Swastha Portal) */}
        {assessment.patientMessage && (
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {t.patientFacingMsg || "Delivered Patient-Facing Instructions"}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {t.patientFriendlyReportTitle || "Visible in Patient Swastha Portal"}
              </span>
            </div>
            <p className="text-xs text-stone-800 italic bg-white p-3 rounded-lg border border-emerald-200">
              "{assessment.patientMessage}"
            </p>
          </div>
        )}

        {/* Classical Samhita References Box */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{t.classicalCitations || "Classical Ayurvedic Citations & Methodological Basis"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-600">
            <div>
              <strong className="text-stone-800 block">Charaka Samhita</strong>
              <span>Vimanasthana Ch. 8, Verses 95-100 (Physical & mental attributes of Vata, Pitta, Kapha).</span>
            </div>
            <div>
              <strong className="text-stone-800 block">Sushruta Samhita</strong>
              <span>Sharirasthana Ch. 4, Verses 62-76 (Congenital determination of Janma Prakriti).</span>
            </div>
            <div>
              <strong className="text-stone-800 block">Ashtanga Hridaya</strong>
              <span>Sharirasthana Ch. 3, Verses 83-104 (Dwandwaja bi-constitutional predominance).</span>
            </div>
          </div>
        </div>

        {/* Clinician Sign-off & Verification Seal */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-500">
              {conductedBy?.role === "patient"
                ? "Self-Assessment Submitter:"
                : conductedBy?.role === "student"
                ? "Ayurveda Scholar Evaluator:"
                : (t.conductedByLabel || "Conducted By") + ":"}
            </div>
            <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <span>{conductedBy?.name}</span>
              {conductedBy?.role === "patient" ? (
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  👤 Patient Self-Assessment
                </span>
              ) : conductedBy?.role === "student" ? (
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                  🎓 BAMS Scholar
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  👨‍⚕️ Senior Vaidya
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400 capitalize">
              Role: {conductedBy?.role === "patient" ? "Registered Patient (Swastha Pariksha)" : conductedBy?.role} • {t.sponsorHeader || "SDM College of Ayurveda, Udupi"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {supervisorApproved ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div className="text-left">
                  <div className="text-[11px] font-bold">{t.approvedBySupervisor || "Approved by Supervising Vaidya"}</div>
                  <div className="text-[10px] text-emerald-700">{t.officialClinicalConfirmation || "Official Clinical Confirmation"}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <div className="text-left">
                  <div className="text-[11px] font-bold">{t.pendingSupervisorReview || "Pending Doctor Sign-Off"}</div>
                  <div className="text-[10px] text-amber-700">
                    {conductedBy?.role === "patient"
                      ? "Patient Self-Assessment Draft"
                      : (t.academicStudentWorkflow || "Academic Student Workflow")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ethical Non-Diagnostic Disclaimer */}
        <div className="p-3 bg-stone-100 rounded-lg text-[10px] text-stone-500 text-center leading-relaxed">
          <strong>{t.officialAyurvedicDisclaimer || "Official Ayurvedic Disclaimer"}:</strong> {t.disclaimerText || t.ethicalDisclaimerDetailed}
        </div>
      </div>
    </div>
  );
}
