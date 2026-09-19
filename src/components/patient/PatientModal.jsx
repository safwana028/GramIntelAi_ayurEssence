import React, { useState } from "react";
import { X, UserPlus, Save } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#1E4D3E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-serif-heading tracking-wide">
              {patientToEdit ? "Edit Patient Profile" : "Register New Patient"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 transition-colors"
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
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 XXXXX"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Patient Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
