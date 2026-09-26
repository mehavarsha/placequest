import React, { useState, useEffect } from 'react';
import { PageView, Companion, UserStats, StudentProfile } from '../types';
import { ASSETS } from '../data/assets';
import { StudentProfileModal } from './StudentProfileModal';
import { CharacterProgressionCard } from './CharacterProgressionCard';
import confetti from 'canvas-confetti';
import { 
  Network, 
  Activity, 
  Mic, 
  FileText, 
  Briefcase, 
  Compass, 
  HelpCircle, 
  Flame, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users,
  BookOpen,
  Trophy,
  GraduationCap,
  Building,
  Edit3,
  Clock,
  Radio,
  ChevronRight,
  Award,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
  companion: Companion;
  stats: UserStats;
  studentProfile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onAddSparks: (amount: number) => void;
  onIncrementStreak: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  companion,
  stats,
  studentProfile,
  onUpdateProfile,
  onAddSparks,
  onIncrementStreak
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Live Running Placement Activity Ticker
  const liveActivities = [
    'Rahul V. (NIT) scored 92% on Frequency Hashing assessment (+100 ⚡)',
    'Google SWE Intern shortlisting slot verification is currently active',
    'Priya P. protected Squad Streak 🔥 8 Days',
    'Amazon SDE-1 OA pattern updated: 2 LeetCode Mediums + LP round',
    'Ananya S. completed 5 mock interviews in AI Voice Coach room',
    'Vikrant I. initiated Speed Duel in Binary Search Trees'
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveActivities.length]);

  // Live Running Countdown Timer for Upcoming Drives (Simulated dynamic seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 86400 + 14 * 3600 + 22 * 60 + 40);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 86400 * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const dailyQuestion = {
    prompt: 'Quick Reflex: What is the space complexity to invert a Binary Tree of N nodes recursively?',
    options: ['O(H) recursion stack', 'O(1) always', 'O(N log N)', 'O(N^2)'],
    correct: 0,
    explanation: 'Traverses each node once, using call stack space bounded by tree height H (log N for balanced, N for skewed).'
  };

  const handleDailySubmit = (index: number) => {
    if (dailyAnswered) return;
    setSelectedOption(index);
    setDailyAnswered(true);
    if (index === dailyQuestion.correct) {
      setIsCorrect(true);
      onAddSparks(30);
      onIncrementStreak();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 }
      });
    } else {
      setIsCorrect(false);
    }
  };

  const portals = [
    {
      id: 'roadmap' as PageView,
      title: 'Order-by-Order Roadmap',
      subtitle: `Step 0${stats.assessmentsPassed + 1} Active · 8 Total`,
      icon: Network,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400'
    },
    {
      id: 'flashcards' as PageView,
      title: 'Study Flashcards',
      subtitle: 'AI Notes & File Converter',
      icon: Layers,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400'
    },
    {
      id: 'mock-interview' as PageView,
      title: 'Mock Interview Arena',
      subtitle: 'Bar Raiser 45-Min Trials',
      icon: ShieldCheck,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400'
    },
    {
      id: 'friends' as PageView,
      title: 'Quest with Friends',
      subtitle: 'Squad Co-op & Duels',
      icon: Users,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      id: 'visualizers' as PageView,
      title: 'Visualizer Lab',
      subtitle: '5 Interactive Simulators',
      icon: Activity,
      color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-400'
    },
    {
      id: 'speaking-coach' as PageView,
      title: 'AI Speaking Coach',
      subtitle: 'Live Mic & STAR Review',
      icon: Mic,
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400'
    },
    {
      id: 'resume-studio' as PageView,
      title: 'Resume ATS Radar',
      subtitle: `Score: ${stats.resumeAtsScore}/100`,
      icon: FileText,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'opportunities' as PageView,
      title: 'Drive Radar',
      subtitle: 'Curated 2025-27 Openings',
      icon: Briefcase,
      color: 'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400'
    },
    {
      id: 'self-analysis' as PageView,
      title: 'Readiness Radar',
      subtitle: '5-Pillar Diagnostics',
      icon: Compass,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400'
    },
    {
      id: 'doubts' as PageView,
      title: 'Doubt Sanctum',
      subtitle: 'Zero Judgment AI Answers',
      icon: HelpCircle,
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400'
    }
  ];

  return (
    <div className="min-w-0 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
      {/* 1. LIVE RUNNING TICKER BANNER */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[10px] tracking-wider uppercase">Live Activity</span>
          </div>

          <div className="text-slate-300 font-medium truncate animate-in fade-in duration-300">
            {liveActivities[tickerIndex]}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 shrink-0 font-mono">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Real-time Sync</span>
        </div>
      </div>

      {/* 2. STUDENT IDENTITY & PLACEMENT PASSPORT CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/50 border border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & College Details */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/60 shadow-xl bg-slate-800">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${studentProfile.avatarSeed}`}
                  alt={studentProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-emerald-600 border border-emerald-400 text-white font-bold text-[9px] flex items-center gap-0.5 shadow">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Verified</span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] truncate">
                  {studentProfile.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-semibold font-mono">
                  {studentProfile.rollNumber}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-semibold">
                  {studentProfile.placementStatus}
                </span>
              </div>

              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-white flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {studentProfile.college}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {studentProfile.degree} ({studentProfile.graduationBatch} Batch)
                </span>
              </div>

              {/* Target Role & Dream Companies */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                <span>Target: <strong className="text-slate-200">{studentProfile.targetRole}</strong> ({studentProfile.targetPackage})</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Dream:</span>
                  {studentProfile.dreamCompanies.slice(0, 3).map((comp, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 text-[11px] font-medium">
                      {comp}
                    </span>
                  ))}
                  {studentProfile.dreamCompanies.length > 3 && (
                    <span className="text-[10px] text-slate-500">+{studentProfile.dreamCompanies.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Live CGPA Eligibility Meter */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">CGPA Meter</div>
              <div className="text-2xl font-black text-emerald-400 tabular-nums font-mono mt-0.5">
                {studentProfile.cgpa}
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                Eligible: 98% Drives
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md"
              title="Edit Profile & College Details"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CHARACTER RPG LEVEL PROGRESSION & LIVE RUNNING FOCUS STOPWATCH */}
      <CharacterProgressionCard
        sparks={stats.sparks}
        companion={companion}
        onAddSparks={onAddSparks}
      />

      {/* 4. LIVE METRIC STRIP (Compact & Visual) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak Flame */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Consistency</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.streakDays}d Streak</div>
          </div>
        </div>

        {/* Sparks Currency */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Zap className="w-5 h-5 fill-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Sparks XP</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.sparks} ⚡</div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Roadmap</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.assessmentsPassed} / 8 Steps</div>
          </div>
        </div>

        {/* Resume ATS */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">ATS Match</div>
            <div className="text-lg font-bold text-white tabular-nums">{stats.resumeAtsScore}/100</div>
          </div>
        </div>
      </div>

      {/* 4. UPCOMING DRIVE COUNTDOWN & QUICK RESUME BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Step Resume Button */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-0.5">
              <span>Active Curriculum Step</span>
              <span aria-hidden="true">·</span>
              <span>Step 01 / 08</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Two Pointers & Sliding Window
            </h3>
            <div className="text-xs text-slate-300 mt-0.5">
              Pass test assessment (70%+) to unlock Step 02 (Frequency Hashing).
            </div>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0"
          >
            <span>Resume Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Drive Countdown */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Google SWE Intern</span>
            <span className="text-[10px] text-rose-400 font-bold uppercase">Drive Closes In</span>
          </div>

          <div className="my-2 text-lg sm:text-xl font-black text-rose-400 font-mono tabular-nums flex items-center gap-2">
            <Clock className="w-4 h-4 animate-spin text-rose-400" />
            <span>{formatCountdown(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => onNavigate('opportunities')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-between pt-1 border-t border-slate-800 cursor-pointer"
          >
            <span>View Blueprint & Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. DAILY MICRO SPRINT (Compact Reflex) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Daily Reflex Sprint (+30 Sparks)</span>
          </div>
          <span className="text-[11px] text-slate-400">Protects Consistency Streak</span>
        </div>

        <p className="text-xs text-slate-200">
          {dailyQuestion.prompt}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dailyQuestion.options.map((opt, i) => {
            let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
            if (dailyAnswered) {
              if (i === dailyQuestion.correct) {
                style = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold';
              } else if (selectedOption === i) {
                style = 'bg-rose-950 border-rose-600 text-rose-200';
              } else {
                style = 'opacity-40 border-slate-900';
              }
            }

            return (
              <button
                key={i}
                disabled={dailyAnswered}
                onClick={() => handleDailySubmit(i)}
                className={`p-2.5 rounded-xl border text-xs text-center transition cursor-pointer ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {dailyAnswered && (
          <div className="text-[11px] text-slate-300 pt-1">
            <span className="font-semibold text-emerald-400">{isCorrect ? '✅ Spot on!' : '💡 Explanation:'}</span> {dailyQuestion.explanation}
          </div>
        )}
      </div>

      {/* 6. CLEAN HIGH-IMPACT PORTALS (Visual, Less Text) */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Workspaces
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${p.color} bg-slate-900/90 border text-left hover:border-indigo-500/80 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between min-h-[105px] shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5" />
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Edit Modal */}
      <StudentProfileModal
        profile={studentProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={onUpdateProfile}
      />
    </div>
  );
};
