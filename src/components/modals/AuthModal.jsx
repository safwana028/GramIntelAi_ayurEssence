import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Stethoscope,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { api, CLINICAL_ACCOUNTS } from "../../services/apiService";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  activeRole = "doctor",
  onLoginSuccess,
  onUpdateUser,
  onUpdatePatient
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Doctor fields
  const [doctorName, setDoctorName] = useState(currentUser?.name || "Dr. K. Raghavendra Rao");
  const [doctorEmail, setDoctorEmail] = useState(currentUser?.email || "dr.rao@sdm.ac.in");
  const [doctorTitle, setDoctorTitle] = useState(currentUser?.title || "Senior Vaidya & Professor");
  const [doctorRegNo, setDoctorRegNo] = useState(currentUser?.regNo || "AYUR-KA-2026-9812");
  const [doctorInstitution, setDoctorInstitution] = useState(currentUser?.institution || "SDM College of Ayurveda, Udupi");

  // Student fields
  const [studentName, setStudentName] = useState(currentUser?.name || "Arjun Shenoy");
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || "arjun.scholar@sdm.ac.in");
  const [studentInstitution, setStudentInstitution] = useState(currentUser?.institution || "SDM College of Ayurveda, Udupi");
  const [studentYear, setStudentYear] = useState(currentUser?.year || "Final Year BAMS Resident");

  // Patient fields
  const [patientName, setPatientName] = useState(currentUser?.name || "Sneha Bhat");
  const [patientAge, setPatientAge] = useState(currentUser?.age || "28");
  const [patientGender, setPatientGender] = useState(currentUser?.gender || "Female");
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || "patient@ayuressence.in");
  const [patientCity, setPatientCity] = useState(currentUser?.city || "Udupi, Karnataka");
  const [patientDiet, setPatientDiet] = useState(currentUser?.diet || "Vegetarian");
  const [patientComplaint, setPatientComplaint] = useState(currentUser?.primaryComplaint || "Constitutional Health & Sleep Optimization");

  useEffect(() => {
    if (currentUser) {
      if (activeRole === "doctor") {
        setDoctorName(currentUser.name || "Dr. K. Raghavendra Rao");
        setDoctorEmail(currentUser.email || "dr.rao@sdm.ac.in");
        setDoctorTitle(currentUser.title || "Senior Vaidya & Professor");
        setDoctorRegNo(currentUser.regNo || "AYUR-KA-2026-9812");
        setDoctorInstitution(currentUser.institution || "SDM College of Ayurveda, Udupi");
      } else if (activeRole === "student") {
        setStudentName(currentUser.name || "Arjun Shenoy");
        setStudentEmail(currentUser.email || "arjun.scholar@sdm.ac.in");
        setStudentInstitution(currentUser.institution || "SDM College of Ayurveda, Udupi");
        setStudentYear(currentUser.year || "Final Year BAMS Resident");
      } else if (activeRole === "patient") {
        setPatientName(currentUser.name || "Sneha Bhat");
        setPatientAge(currentUser.age || "28");
        setPatientGender(currentUser.gender || "Female");
        setPatientPhone(currentUser.phone || "+91 98765 43210");
        setPatientEmail(currentUser.email || "patient@ayuressence.in");
        setPatientCity(currentUser.city || "Udupi, Karnataka");
        setPatientDiet(currentUser.diet || "Vegetarian");
        setPatientComplaint(currentUser.primaryComplaint || "Constitutional Health & Sleep Optimization");
      }
    }
  }, [currentUser, activeRole]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    if (activeRole === "patient") {
      const updatedPatient = {
        id: currentUser?.patientId || currentUser?.id,
        name: patientName.trim(),
        age: parseInt(patientAge, 10) || 28,
        gender: patientGender,
        phone: patientPhone.trim(),
        email: patientEmail.trim(),
        city: patientCity.trim(),
        diet: patientDiet,
        primaryComplaint: patientComplaint.trim()
      };
      if (onUpdatePatient) {
        onUpdatePatient(updatedPatient);
      }
      onClose();
      setLoading(false);
      return;
    }

    if (activeRole === "doctor") {
      const updatedDoctor = {
        ...currentUser,
        role: "doctor",
        name: doctorName.trim(),
        email: doctorEmail.trim(),
        title: doctorTitle.trim(),
        regNo: doctorRegNo.trim(),
        institution: doctorInstitution.trim()
      };
      if (onUpdateUser) {
        onUpdateUser(updatedDoctor);
      }
      onClose();
      setLoading(false);
      return;
    }

    if (activeRole === "student") {
      const updatedStudent = {
        ...currentUser,
        role: "student",
        name: studentName.trim(),
        email: studentEmail.trim(),
        institution: studentInstitution.trim(),
        year: studentYear.trim()
      };
      if (onUpdateUser) {
        onUpdateUser(updatedStudent);
      }
      onClose();
      setLoading(false);
      return;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header with Logo */}
        <div className={`p-6 text-white relative ${
          activeRole === "doctor"
            ? "bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B]"
            : activeRole === "student"
            ? "bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F2D6B]"
            : "bg-gradient-to-r from-[#143B30] via-[#1E4D3E] to-[#0A241C]"
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {activeRole === "doctor" && <Stethoscope className="w-5 h-5 text-amber-300" />}
              {activeRole === "student" && <GraduationCap className="w-5 h-5 text-sky-300" />}
              {activeRole === "patient" && <HeartHandshake className="w-5 h-5 text-emerald-300" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                {activeRole === "doctor" && "Doctor Domain Session"}
                {activeRole === "student" && "Scholar Domain Session"}
                {activeRole === "patient" && "Patient Swastha Profile"}
              </span>
              <h2 id="auth-modal-title" className="text-xl font-bold font-serif-heading">
                {activeRole === "doctor" && "Doctor Clinical Credentials"}
                {activeRole === "student" && "Ayurveda Scholar Profile"}
                {activeRole === "patient" && "Patient Swastha Account Details"}
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-200/90 mt-1">
            SDM College of Ayurveda, Udupi & SMVITM Bantakal
          </p>
        </div>

        {/* DOMAIN ISOLATED FORM */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {error && (
            <Alert variant="danger" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* DOCTOR FIELDS */}
          {activeRole === "doctor" && (
            <>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Doctor Full Name & Title <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. K. Raghavendra Rao"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Clinical Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    placeholder="dr.rao@sdm.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={doctorTitle}
                    onChange={(e) => setDoctorTitle(e.target.value)}
                    placeholder="Senior Vaidya & Professor"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Registration / Seal No
                  </label>
                  <input
                    type="text"
                    value={doctorRegNo}
                    onChange={(e) => setDoctorRegNo(e.target.value)}
                    placeholder="AYUR-KA-2026-9812"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={doctorInstitution}
                  onChange={(e) => setDoctorInstitution(e.target.value)}
                  placeholder="SDM College of Ayurveda, Udupi"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                />
              </div>
            </>
          )}

          {/* SCHOLAR / STUDENT FIELDS */}
          {activeRole === "student" && (
            <>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Scholar Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Arjun Shenoy"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Academic Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="arjun.scholar@sdm.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    BAMS Academic Year
                  </label>
                  <input
                    type="text"
                    value={studentYear}
                    onChange={(e) => setStudentYear(e.target.value)}
                    placeholder="Final Year BAMS Resident"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={studentInstitution}
                    onChange={(e) => setStudentInstitution(e.target.value)}
                    placeholder="SDM College of Ayurveda, Udupi"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                  />
                </div>
              </div>
            </>
          )}

          {/* PATIENT FIELDS */}
          {activeRole === "patient" && (
            <>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Patient Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Sneha Bhat"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Age (Years) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="28"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Gender <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-stone-800"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Registered Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="sneha.bhat@example.com"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={patientCity}
                    onChange={(e) => setPatientCity(e.target.value)}
                    placeholder="Udupi, Karnataka"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Dietary Habits (Ahara)
                  </label>
                  <select
                    value={patientDiet}
                    onChange={(e) => setPatientDiet(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-stone-800"
                  >
                    <option value="Vegetarian">Pure Vegetarian</option>
                    <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Primary Health Concern
                </label>
                <input
                  type="text"
                  value={patientComplaint}
                  onChange={(e) => setPatientComplaint(e.target.value)}
                  placeholder="e.g. Constitutional Prakriti Evaluation, sleep balance"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                />
              </div>
            </>
          )}

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              iconRight={ArrowRight}
            >
              {activeRole === "patient" && "Save Patient Details & Update Account"}
              {activeRole === "doctor" && "Save Doctor Credentials"}
              {activeRole === "student" && "Save Scholar Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
