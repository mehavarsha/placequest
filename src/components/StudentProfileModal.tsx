import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { X, CheckCircle2, Building, GraduationCap, Award, Briefcase, Sparkles } from 'lucide-react';

interface StudentProfileModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [dreamCompanyInput, setDreamCompanyInput] = useState('');

  if (!isOpen) return null;

  const handleAddCompany = () => {
    if (dreamCompanyInput.trim() && !formData.dreamCompanies.includes(dreamCompanyInput.trim())) {
      setFormData({
        ...formData,
        dreamCompanies: [...formData.dreamCompanies, dreamCompanyInput.trim()]
      });
      setDreamCompanyInput('');
    }
  };

  const handleRemoveCompany = (comp: string) => {
    setFormData({
      ...formData,
      dreamCompanies: formData.dreamCompanies.filter(c => c !== comp)
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student & College Profile</h2>
              <div className="text-xs text-slate-400">Personalize your campus placement passport</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Roll / Reg Number</label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">College / University</label>
            <input
              type="text"
              required
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Degree & Branch</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Graduation Batch</label>
              <select
                value={formData.graduationBatch}
                onChange={(e) => setFormData({ ...formData, graduationBatch: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="2025">2025 Graduating</option>
                <option value="2026">2026 Graduating</option>
                <option value="2027">2027 Graduating</option>
                <option value="2028">2028 Graduating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Current CGPA</label>
              <input
                type="text"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.4"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Target Role</label>
              <input
                type="text"
                required
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. SDE-1 / Product Engineer"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Target Package</label>
              <input
                type="text"
                value={formData.targetPackage}
                onChange={(e) => setFormData({ ...formData, targetPackage: e.target.value })}
                placeholder="e.g. 18 - 35 LPA"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Current Status</label>
              <select
                value={formData.placementStatus}
                onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Actively Preparing">Actively Preparing</option>
                <option value="Appearing for Drives">Appearing for Drives</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Placed">Placed 🎉</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Dream Companies Wishlist</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={dreamCompanyInput}
                onChange={(e) => setDreamCompanyInput(e.target.value)}
                placeholder="Add company (e.g. Google, Atlassian)"
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCompany}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.dreamCompanies.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 flex items-center gap-1.5"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(c)}
                    className="hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
