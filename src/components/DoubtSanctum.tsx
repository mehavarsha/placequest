import React, { useState } from 'react';
import { PlacementDoubt } from '../types';
import { CURATED_DOUBTS } from '../data/doubts';
import { 
  HelpCircle, 
  Sparkles, 
  Send, 
  Smile, 
  Briefcase, 
  Baby, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const DoubtSanctum: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'interview_ready' | 'simple_eli5' | 'humor_meme'>('interview_ready');
  const [isSolving, setIsSolving] = useState(false);
  const [activeDoubt, setActiveDoubt] = useState<PlacementDoubt | null>(CURATED_DOUBTS[0]);
  const [solvedResponse, setSolvedResponse] = useState<any | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCurated = CURATED_DOUBTS.filter(d => 
    d.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAskDoubt = async () => {
    if (!userQuery.trim()) return;
    setIsSolving(true);
    setActiveDoubt(null);

    try {
      const res = await fetch('/api/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuery, mode: selectedMode })
      });

      if (res.ok) {
        const data = await res.json();
        setSolvedResponse(data);
      } else {
        throw new Error('Doubt solver call failed');
      }
    } catch (e) {
      setSolvedResponse({
        title: 'Placement Insight',
        explanation: `In technical placements, interviewers look for foundational thinking, calm reasoning under ambiguity, and genuine enthusiasm. Break the problem into inputs, testcases, and constraints.`,
        keyTakeaways: [
          'Master O(1) space optimizations over memorizing long templates.',
          'Always clarify constraints with the interviewer before writing code.',
          'Consistency in solving 1 problem daily beats last-minute weekend panic.'
        ],
        actionStep: 'Solve 1 question in the Skill Tree today to cement your confidence!'
      });
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-yellow-400 mb-1">
            <span>Zero-Judgment AI Sanctum</span>
            <span aria-hidden="true">·</span>
            <span>Solve Necessary & Unnecessary Doubts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Sanctum of Placement Doubts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            No query is too basic or too embarrassing. Ask about low CGPA, career gaps, blank minds, or tricky system architecture. Choose your preferred explanation flavor.
          </p>
        </div>

        {/* Style Mode Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setSelectedMode('interview_ready')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'interview_ready' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Interview Pro</span>
          </button>
          <button
            onClick={() => setSelectedMode('simple_eli5')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'simple_eli5' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>ELI5 / Simple</span>
          </button>
          <button
            onClick={() => setSelectedMode('humor_meme')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              selectedMode === 'humor_meme' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Humor & Meme</span>
          </button>
        </div>
      </div>

      {/* Ask Any Doubt Input Field */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <label className="text-xs font-bold text-white uppercase tracking-wider">
          Ask Your Placement Doubt (Technical or Mindset)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskDoubt()}
            placeholder="e.g. Will a 6.9 CGPA stop me from getting 20 LPA? or Why does DP beat recursion?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAskDoubt}
            disabled={isSolving || !userQuery.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSolving ? 'Resolving...' : 'Solve Doubt'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Curated Library on Left, Answer Stage on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curated Dilemma Library */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
              Common Placement Dilemmas
            </h2>
            <span className="text-xs text-slate-400">Click to inspect</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter doubts..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCurated.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDoubt(d);
                  setSolvedResponse(null);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeDoubt?.id === d.id && !solvedResponse
                    ? 'bg-indigo-950/60 border-indigo-700/80 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                  {d.category}
                </div>
                <div className="text-xs font-bold leading-relaxed line-clamp-2">
                  {d.question}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Answer Stage */}
        <div className="lg:col-span-7">
          {/* If Custom Solved Response */}
          {solvedResponse && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-700/60 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  AI Solution ({selectedMode.replace('_', ' ')})
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {solvedResponse.title}
                </h3>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {solvedResponse.explanation}
              </div>

              {solvedResponse.keyTakeaways && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Golden Placement Rules:</div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {solvedResponse.keyTakeaways.map((takeaway: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {solvedResponse.actionStep && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
                  <span className="font-bold">🎯 Immediate 5-Minute Action: </span>
                  <span>{solvedResponse.actionStep}</span>
                </div>
              )}
            </div>
          )}

          {/* If Curated Active Doubt */}
          {activeDoubt && !solvedResponse && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {activeDoubt.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  "{activeDoubt.question}"
                </h2>
              </div>

              {/* Mode-specific answer display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  {selectedMode === 'interview_ready' && <Briefcase className="w-4 h-4 text-indigo-400" />}
                  {selectedMode === 'simple_eli5' && <Baby className="w-4 h-4 text-emerald-400" />}
                  {selectedMode === 'humor_meme' && <Smile className="w-4 h-4 text-amber-400" />}
                  <span className="capitalize">{selectedMode.replace('_', ' ')} Answer:</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedMode === 'interview_ready' && activeDoubt.interviewReadyAnswer}
                  {selectedMode === 'simple_eli5' && activeDoubt.eli5Answer}
                  {selectedMode === 'humor_meme' && activeDoubt.memeAnswer}
                </p>
              </div>

              {/* Executive Summary */}
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Core Reality: </span>
                {activeDoubt.answerSummary}
              </div>

              {/* Action Item */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2">
                <span className="font-bold">🚀 Next Step: </span>
                <span>{activeDoubt.actionItem}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
