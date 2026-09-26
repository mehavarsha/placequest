import React, { useState } from 'react';
import { JobOpportunity } from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Bookmark, 
  Calendar, 
  GraduationCap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const OpportunitiesRadar: React.FC = () => {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<JobOpportunity | null>(null);

  const filtered = opportunities.filter((op) => {
    if (filterDifficulty !== 'all' && op.difficulty !== filterDifficulty) return false;
    if (filterBatch !== 'all' && !op.eligibilityBatch.includes(filterBatch)) return false;
    return true;
  });

  const updateStatus = (id: string, newStatus: JobOpportunity['applicationStatus']) => {
    setOpportunities((prev) =>
      prev.map((op) => (op.id === id ? { ...op, applicationStatus: newStatus } : op))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>Opportunity Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Prep Blueprints & Eligibility Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Internship & Off-Campus Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Never miss an opening. Access verified hiring round patterns, eligibility cutoffs, and past asked questions for Tier 1 and high-growth tech companies.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            {['all', 'Dream', 'Elevated', 'Standard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg transition capitalize cursor-pointer ${
                  filterDifficulty === diff ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All Tiers' : diff}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Batches</option>
            <option value="2025">2025 Graduating</option>
            <option value="2026">2026 Graduating</option>
            <option value="2027">2027 Graduating</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((op) => {
          const statusColors: Record<string, string> = {
            Explore: 'text-slate-400',
            Bookmarked: 'text-amber-400 font-semibold',
            Applied: 'text-indigo-400 font-semibold',
            Interviewing: 'text-cyan-400 font-semibold',
            Selected: 'text-emerald-400 font-semibold'
          };

          return (
            <div
              key={op.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-400">{op.company}</span>
                    <h3 className="text-base font-bold text-white line-clamp-1">{op.role}</h3>
                  </div>

                  <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold ${
                    op.difficulty === 'Dream'
                      ? 'bg-rose-950/60 border-rose-800/60 text-rose-300'
                      : op.difficulty === 'Elevated'
                      ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
                      : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                  }`}>
                    {op.difficulty} Tier
                  </span>
                </div>

                {/* Metadata Items */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{op.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{op.stipendOrCtc}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Eligible: {op.eligibilityBatch.join(', ')} Batch · Min {op.minCgpa} CGPA</span>
                  </div>
                </div>

                {/* Key Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {op.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Status Selector */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <select
                  value={op.applicationStatus}
                  onChange={(e) => updateStatus(op.id, e.target.value as any)}
                  className={`bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs cursor-pointer focus:outline-none ${statusColors[op.applicationStatus]}`}
                >
                  <option value="Explore">Status: Explore</option>
                  <option value="Bookmarked">Status: Bookmarked</option>
                  <option value="Applied">Status: Applied</option>
                  <option value="Interviewing">Status: Interviewing</option>
                  <option value="Selected">Status: Selected 🎉</option>
                </select>

                <button
                  onClick={() => setSelectedOpportunity(op)}
                  className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-700/50 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1"
                >
                  <span>Prep Blueprint</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Company Hiring Blueprint
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedOpportunity.company} — {selectedOpportunity.role}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  CTC / Stipend: <span className="text-emerald-400 font-semibold">{selectedOpportunity.stipendOrCtc}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rounds Flow */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Exact Selection Rounds Pattern
              </h3>
              <div className="space-y-2">
                {selectedOpportunity.hiringRounds.map((round, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{round}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Problems */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                High-Frequency Real Interview Questions
              </h3>
              <div className="space-y-2">
                {selectedOpportunity.frequentlyAsked.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-cyan-800/40 text-xs text-cyan-200">
                    › {faq}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Deadline: <span className="text-slate-200 font-medium">{selectedOpportunity.deadline}</span>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Got It, Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
