import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import { Button } from "../ui/Button";

export function PatientModal({ isOpen, onClose, onSave, patientToEdit = null }) {
  const [formData, setFormData] = useState(
    patientToEdit || {
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      city: "Udupi, Karnataka",
      occupation: "",
      dietType: "Vegetarian",
      primaryComplaint: "Constitutional evaluation (Swastha Pariksha)",
      baselinePrakriti: "Pending Assessment"
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    const savedPatient = {
      ...formData,
      id: formData.id || `PAT-UDU-${Date.now().toString().slice(-6)}`,
      age: Number(formData.age) || 30,
      registeredDate: formData.registeredDate || new Date().toISOString().slice(0, 10),
      assessments: formData.assessments || []
    };

    onSave(savedPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1B4D3E] via-[#245D4B] to-[#12382B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TridoshaLabLogo variant="icon" size="xs" light={true} />
            <h3 className="text-base sm:text-lg font-bold font-serif-heading tracking-wide">
              {patientToEdit ? "Edit Patient Profile" : "Register New Patient"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Bhat"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 35"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Male">Male (ಪುರುಷ)</option>
                <option value="Female">Female (ಮಹಿಳೆ)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Phone Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                required
                autoComplete="off"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 XXXXX"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Email ID (Optional)
              </label>
              <input
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Udupi, Karnataka"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Teacher / Farmer / IT"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Dietary Habit (Ahara)
              </label>
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Vegetarian">Vegetarian (ಸಸ್ಯಾಹಾರಿ)</option>
                <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian (ಮಿಶ್ರ ಆಹಾರ)</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Primary Clinical Purpose
              </label>
              <input
                type="text"
                value={formData.primaryComplaint}
                onChange={(e) => setFormData({ ...formData, primaryComplaint: e.target.value })}
                placeholder="e.g. Wellness check, Student case study"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
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
              icon={Save}
            >
              Save Patient Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
