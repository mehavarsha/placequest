import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  Compass, 
  Zap, 
  Building 
} from 'lucide-react';

export const SelfAnalysisRadar: React.FC = () => {
  const [pillars, setPillars] = useState({
    dsa: 75,
    aptitude: 65,
    coreCs: 80,
    projects: 70,
    communication: 60
  });

  const overallReadiness = Math.round(
    (pillars.dsa * 0.3) +
    (pillars.aptitude * 0.15) +
    (pillars.coreCs * 0.2) +
    (pillars.projects * 0.2) +
    (pillars.communication * 0.15)
  );

  // Identify lowest pillar
  const pillarEntries = Object.entries(pillars) as [keyof typeof pillars, number][];
  const lowestPillar = [...pillarEntries].sort((a, b) => a[1] - b[1])[0];

  const pillarNames: Record<keyof typeof pillars, string> = {
    dsa: 'Data Structures & Algorithms',
    aptitude: 'Quantitative & Logical Aptitude',
    coreCs: 'Core CS (OS, DBMS, Networks)',
    projects: 'Production-Grade Projects',
    communication: 'HR & Spoken Communication'
  };

  // 7-Day Sprint Recommendations based on the weakest area
  const sprintPlans: Record<keyof typeof pillars, { day: string; task: string }[]> = {
    communication: [
      { day: 'Day 1', task: 'Record 90-second "Tell me about yourself" using the Past-Present-Future structure.' },
      { day: 'Day 2', task: 'Draft 3 bulletproof STAR stories covering conflict, unexpected bugs, and leadership.' },
      { day: 'Day 3', task: 'Practice with AI Speaking Coach to eliminate "um" and "like" filler words.' },
      { day: 'Day 4', task: 'Prepare 2 insightful reverse-questions for technical hiring managers.' },
      { day: 'Day 5', task: 'Simulate answering "What is your biggest weakness?" with authentic growth framing.' },
      { day: 'Day 6', task: 'Record a 5-minute video walk-through of your best GitHub project architecture.' },
      { day: 'Day 7', task: 'Conduct a peer mock interview and self-audit with our Articulation rubric.' }
    ],
    dsa: [
      { day: 'Day 1', task: 'Master Two Pointers & Sliding Window with 5 curated LeetCode Mediums.' },
      { day: 'Day 2', task: 'Step through Binary Search Tree visualizer and implement LCA.' },
      { day: 'Day 3', task: 'Solve 3 Monotonic Stack problems (Daily Temperatures, Next Greater Element).' },
      { day: 'Day 4', task: 'Trace Graph BFS/DFS traversal and implement Dijkstra on paper.' },
      { day: 'Day 5', task: 'Understand 0/1 Knapsack backward capacity space compression.' },
      { day: 'Day 6', task: 'Time-boxed 60-minute mock coding test with 2 unseen problems.' },
      { day: 'Day 7', task: 'Review edge testcases: empty array, negative numbers, overflow boundaries.' }
    ],
    aptitude: [
      { day: 'Day 1', task: 'Master Time & Work LCM method and efficiency ratios.' },
      { day: 'Day 2', task: 'Solve 15 Probability questions using conditional Bayes urn logic.' },
      { day: 'Day 3', task: 'Speed-drill Permutations & Combinations without formulas.' },
      { day: 'Day 4', task: 'Practice Speed, Time, Distance (Trains, Boats & Streams).' },
      { day: 'Day 5', task: 'Syllogisms and Venn diagram deduction puzzles.' },
      { day: 'Day 6', task: 'Data Interpretation: Bar graphs, Pie charts, and % change calculations.' },
      { day: 'Day 7', task: 'Complete a timed 30-minute TCS / AMCAT style aptitude mock exam.' }
    ],
    coreCs: [
      { day: 'Day 1', task: 'Operating Systems: Process vs Thread, Context Switching, Deadlock 4 conditions.' },
      { day: 'Day 2', task: 'DBMS: Normalization (1NF to BCNF) with real student table examples.' },
      { day: 'Day 3', task: 'DBMS: SQL Joins, Indexing (B+ Trees), ACID properties and transactions.' },
      { day: 'Day 4', task: 'Computer Networks: 3-Way Handshake, TCP vs UDP, DNS resolution steps.' },
      { day: 'Day 5', task: 'Computer Networks: HTTP/1.1 vs HTTP/2 vs HTTP/3, Cookies vs JWT.' },
      { day: 'Day 6', task: 'OOP: Polymorphism, Inheritance vs Composition, Virtual functions.' },
      { day: 'Day 7', task: 'Rapid-fire CS viva with 50 most asked placement questions.' }
    ],
    projects: [
      { day: 'Day 1', task: 'Deploy your primary project live on Vercel / Render with custom domain.' },
      { day: 'Day 2', task: 'Add Redis caching layer to your heaviest API endpoint and measure latency.' },
      { day: 'Day 3', task: 'Write unit & integration tests for authentication and data routes.' },
      { day: 'Day 4', task: 'Create a clean, well-documented README with architecture diagram.' },
      { day: 'Day 5', task: 'Containerize backend and database using Docker & Docker Compose.' },
      { day: 'Day 6', task: 'Audit codebase with ESLint, Lighthouse accessibility, and clean up secrets.' },
      { day: 'Day 7', task: 'Update resume bullets using the X-Y-Z formula in Resume Architect.' }
    ]
  };

  const currentSprint = sprintPlans[lowestPillar[0]] || sprintPlans.communication;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <span>Self-Evaluation Diagnostics</span>
            <span aria-hidden="true">·</span>
            <span>Placement Readiness Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Placement Readiness Index
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Evaluate where you stand across the 5 core placement dimensions. Spot your weakest bottleneck and execute a personalized 7-day sprint plan.
          </p>
        </div>

        {/* Big Overall Index Meter */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Readiness Index
            </div>
            <div className="text-3xl font-black text-rose-400 tabular-nums">
              {overallReadiness}%
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">
              {overallReadiness >= 80 ? 'Interview Ready' : overallReadiness >= 65 ? 'Competitive Contender' : 'Foundation Phase'}
            </span>
            <div className="text-[11px] text-slate-400">Based on 5-Pillar Weighting</div>
          </div>
        </div>
      </div>

      {/* Grid: 5 Pillar Interactive Sliders & Company Tier Matcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Pillar Sliders */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Calibrate Your 5 Pillars (0 – 100)
            </h2>
            <span className="text-xs text-slate-400">Drag sliders to calibrate</span>
          </div>

          <div className="space-y-5">
            {pillarEntries.map(([key, val]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{pillarNames[key]}</span>
                  <span className="font-mono font-bold text-indigo-400 tabular-nums">{val}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={val}
                  onChange={(e) => setPillars({ ...pillars, [key]: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Primary Bottleneck Detected: </span>
              Your lowest pillar is <strong className="text-white">{pillarNames[lowestPillar[0]]} ({lowestPillar[1]}%)</strong>. Directing 60% of your prep hours here this week will yield the highest return in campus shortlists!
            </div>
          </div>
        </div>

        {/* Right Column: Company Tier Readiness Odds */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] border-b border-slate-800 pb-3">
            Company Tier Compatibility
          </h2>

          <div className="space-y-3">
            {/* Tier 1 Product */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Tier 1: FAANG & Global Product (Google, Uber)</span>
                <span className={`font-bold tabular-nums ${pillars.dsa >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pillars.dsa >= 85 ? 'Strong Match' : 'Gap in DSA / Hard DP'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Requires: 85%+ DSA mastery, 80%+ System Design intuition.
              </div>
            </div>

            {/* High Growth Startups */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">High-Growth Startups (Razorpay, Swiggy)</span>
                <span className={`font-bold tabular-nums ${pillars.projects >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pillars.projects >= 75 ? 'High Shortlist Odds' : 'Boost Projects with Cache'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Requires: 75%+ Production projects, fast prototyping, Clean APIs.
              </div>
            </div>

            {/* Mass Recruiters */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Mass Tech Recruiters (TCS Digital, Cognizant)</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  92% Clearance Probability
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Requires: 65%+ Aptitude, Core CS fundamentals, clear HR presence.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailored 7-Day Sprint Action Plan */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Tailored 7-Day Sprint Plan: Overcoming "{pillarNames[lowestPillar[0]]}"
            </h2>
          </div>
          <span className="text-xs text-indigo-300 font-semibold px-2.5 py-1 bg-indigo-950/50 border border-indigo-700/50 rounded-lg">
            High-Impact Daily Roadmap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {currentSprint.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-700/50 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono">{s.day}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.task}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
