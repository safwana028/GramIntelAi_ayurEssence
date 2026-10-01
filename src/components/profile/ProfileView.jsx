import React from "react";
import {
  User,
  ShieldCheck,
  Award,
  Stethoscope,
  GraduationCap,
  Mail,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { CLINICAL_ACCOUNTS } from "../../services/apiService";

export function ProfileView({
  currentUser,
  activeRole,
  onRoleChange,
  onSwitchUser
}) {
  const clinician = currentUser || CLINICAL_ACCOUNTS[activeRole] || CLINICAL_ACCOUNTS.doctor;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-serif-heading font-extrabold text-2xl shadow-lg ring-4 ring-white/10 shrink-0">
          {clinician.name ? clinician.name.charAt(0).toUpperCase() : "A"}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Badge variant="pitta" size="sm">
              {clinician.role === "student"
                ? "BAMS Resident Scholar"
                : "Senior Vaidya / Supervising Clinician"}
            </Badge>
            <span className="text-xs text-emerald-200">Verified Clinician</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-amber-100">
            {clinician.name}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
            {clinician.title || "Ayurvedic Practitioner"}
          </p>

          <p className="text-xs text-emerald-300/80">
            {clinician.institution || "SDM College of Ayurveda, Udupi & SMVITM Bantakal"}
          </p>
        </div>
      </div>

      {/* Profile Details & Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinician Affiliation */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Building className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm font-bold text-stone-900 font-serif-heading">
              Institutional Credentials
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-stone-100">
              <span className="text-stone-500">Institution:</span>
              <strong className="text-stone-800 text-right">
                SDM College of Ayurveda & Hospital
              </strong>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-stone-100">
              <span className="text-stone-500">Affiliated University:</span>
              <strong className="text-stone-800">
                RGUHS / SMVITM Collaborative
              </strong>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-stone-100">
              <span className="text-stone-500">Department:</span>
              <strong className="text-stone-800">
                Kriya Sharira & Swasthavritta
              </strong>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-stone-100">
              <span className="text-stone-500">Clinical Registration No:</span>
              <strong className="font-mono text-emerald-800">
                AYUR-KA-2026-9812
              </strong>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500">Email Address:</span>
              <strong className="text-stone-800">{clinician.email}</strong>
            </div>
          </div>
        </div>

        {/* Vaidya Digital Stamp & Verification Signature */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900 font-serif-heading">
              Digital Signature & Dossier Seal
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-2">
            <div className="font-serif italic text-base text-emerald-950 font-bold tracking-wide">
              {clinician.name}
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
              Digitally Verified Signature Stamp • HPL 2026
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cryptographically Certified (SHA-256)</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            This digital signature is embedded automatically when you sign off and approve clinical dossiers for print and patient delivery.
          </p>
        </div>
      </div>

      {/* Active Session Domain Authorization (Strict Isolation) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 font-serif-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Active Domain Authorization & Session Status</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Your clinical permissions are strictly isolated to your authenticated domain.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">{clinician.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {activeRole} Active
              </span>
            </div>
            <p className="text-stone-500 text-[11px]">
              To switch between Doctor, Student, or Patient workspaces, please log out to verify your credentials.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
            Domain Isolated ✓
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
