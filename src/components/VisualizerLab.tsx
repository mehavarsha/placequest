import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Search, 
  Activity, 
  Layers, 
  Cpu, 
  PieChart, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  highlighted?: boolean;
}

export const VisualizerLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bst' | 'two-pointer' | 'sorting' | 'system-design' | 'probability'>('bst');

  // ================= 1. BST STATE =================
  const [treeValues, setTreeValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [inputVal, setInputVal] = useState<string>('35');
  const [searchVal, setSearchVal] = useState<string>('40');
  const [bstLogs, setBstLogs] = useState<string[]>(['BST initialized with 7 nodes. Try inserting or searching a number!']);
  const [highlightedVal, setHighlightedVal] = useState<number | null>(null);

  const insertBst = () => {
    const num = parseInt(inputVal);
    if (isNaN(num)) return;
    if (treeValues.includes(num)) {
      setBstLogs(prev => [`Value ${num} already exists in BST!`, ...prev.slice(0, 4)]);
      return;
    }
    setTreeValues([...treeValues, num]);
    setHighlightedVal(num);
    setBstLogs(prev => [`Inserted ${num} into BST. Invariant: left < root < right.`, ...prev.slice(0, 4)]);
    setInputVal('');
  };

  const searchBst = () => {
    const num = parseInt(searchVal);
    if (isNaN(num)) return;
    setHighlightedVal(num);
    if (treeValues.includes(num)) {
      setBstLogs(prev => [`Found ${num} in BST! Path: root compared at O(log N) depth.`, ...prev.slice(0, 4)]);
    } else {
      setBstLogs(prev => [`Key ${num} not found. Hit null pointer child in O(log N).`, ...prev.slice(0, 4)]);
    }
  };

  const resetBst = () => {
    setTreeValues([50, 30, 70, 20, 40, 60, 80]);
    setHighlightedVal(null);
    setBstLogs(['Reset BST to balanced default state.']);
  };

  // ================= 2. TWO-POINTER STATE =================
  const [tpArray] = useState<number[]>([2, 3, 5, 8, 11, 15, 20, 24]);
  const [tpTarget] = useState<number>(19);
  const [leftPtr, setLeftPtr] = useState<number>(0);
  const [rightPtr, setRightPtr] = useState<number>(tpArray.length - 1);
  const [tpFound, setTpFound] = useState<boolean>(false);
  const [tpStepMessage, setTpStepMessage] = useState<string>('Pointers at ends. Click "Next Step" to trace.');

  const stepTwoPointer = () => {
    if (leftPtr >= rightPtr || tpFound) {
      return;
    }
    const sum = tpArray[leftPtr] + tpArray[rightPtr];
    if (sum === tpTarget) {
      setTpFound(true);
      setTpStepMessage(`Target found! arr[${leftPtr}] (${tpArray[leftPtr]}) + arr[${rightPtr}] (${tpArray[rightPtr]}) = ${tpTarget}`);
    } else if (sum < tpTarget) {
      setLeftPtr(leftPtr + 1);
      setTpStepMessage(`Sum is ${sum} < ${tpTarget}. Array is sorted, so increment left pointer to increase sum.`);
    } else {
      setRightPtr(rightPtr - 1);
      setTpStepMessage(`Sum is ${sum} > ${tpTarget}. Decrement right pointer to reduce sum.`);
    }
  };

  const resetTwoPointer = () => {
    setLeftPtr(0);
    setRightPtr(tpArray.length - 1);
    setTpFound(false);
    setTpStepMessage('Pointers reset. Left at index 0, Right at last index.');
  };

  // ================= 3. SORTING RACE =================
  const [sortArr, setSortArr] = useState<number[]>([45, 12, 85, 32, 89, 24, 68, 19]);
  const [sortingStep, setSortingStep] = useState<number>(0);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const resetSorting = () => {
    setSortArr([45, 12, 85, 32, 89, 24, 68, 19]);
    setSortingStep(0);
    setIsSorting(false);
  };

  const stepBubbleSort = () => {
    const arr = [...sortArr];
    let swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        const tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        swapped = true;
        break;
      }
    }
    setSortArr(arr);
    setSortingStep(prev => prev + 1);
    if (!swapped) {
      setIsSorting(false);
    }
  };

  // ================= 4. SYSTEM DESIGN FLOW =================
  const [packetStage, setPacketStage] = useState<number>(0);
  const [cacheHit, setCacheHit] = useState<boolean>(true);

  const stages = [
    { name: 'Client Browser', desc: 'Sends HTTP GET /api/v1/profile (Request dispatched)', latency: '0ms' },
    { name: 'Cloudflare Edge CDN', desc: 'SSL Termination + DDoS mitigation filter passed', latency: '12ms' },
    { name: 'API Gateway / Rate Limiter', desc: 'Token bucket check passed (120 req/min allowance)', latency: '24ms' },
    { name: 'Redis Cache Layer', desc: cacheHit ? 'CACHE HIT! Fetched profile in RAM in 1.4ms' : 'CACHE MISS! Forwarding query to primary cluster', latency: cacheHit ? '28ms' : '45ms' },
    { name: 'PostgreSQL Read Replica', desc: cacheHit ? 'Bypassed (DB relieved of load)' : 'Executed indexed SQL query on B-Tree index', latency: cacheHit ? 'N/A' : '82ms' },
  ];

  const advancePacket = () => {
    setPacketStage((prev) => (prev + 1) % stages.length);
  };

  // ================= 5. APTITUDE PROBABILITY =================
  const [redBalls, setRedBalls] = useState<number>(4);
  const [blueBalls, setBlueBalls] = useState<number>(6);
  const totalBalls = redBalls + blueBalls;
  const pRed = totalBalls > 0 ? (redBalls / totalBalls) : 0;
  const pBothRed = totalBalls > 1 ? (redBalls / totalBalls) * ((redBalls - 1) / (totalBalls - 1)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span>Interactive Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Visual Concept Simulators</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Algorithm & Architecture Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Retain technical concepts 4x faster with hands-on visual manipulation. Zero dry syntax. Play, step through, and understand the core invariant.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('bst')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'bst' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Binary Tree (BST)
          </button>
          <button
            onClick={() => setActiveTab('two-pointer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'two-pointer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Two Pointers
          </button>
          <button
            onClick={() => setActiveTab('sorting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'sorting' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sorting Race
          </button>
          <button
            onClick={() => setActiveTab('system-design')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'system-design' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Design Flow
          </button>
          <button
            onClick={() => setActiveTab('probability')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'probability' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aptitude Bayes
          </button>
        </div>
      </div>

      {/* 1. BINARY SEARCH TREE VISUALIZER */}
      {activeTab === 'bst' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                <span className="text-xs font-semibold text-slate-300">
                  Interactive BST Node Canvas
                </span>
                <span className="text-xs font-mono text-indigo-400">
                  Total Nodes: {treeValues.length} · In-order sorted: [{[...treeValues].sort((a,b)=>a-b).join(', ')}]
                </span>
              </div>

              {/* Visual Nodes Grid Layout */}
              <div className="py-6 flex flex-wrap items-center justify-center gap-4">
                {treeValues.map((val) => {
                  const isMatch = highlightedVal === val;
                  return (
                    <div
                      key={val}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base border-2 shadow-xl transition-all duration-300 ${
                        isMatch
                          ? 'bg-indigo-600 border-indigo-400 text-white scale-110 ring-4 ring-indigo-500/40 animate-pulse'
                          : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-indigo-500'
                      }`}
                    >
                      <span>{val}</span>
                      <span className="absolute -bottom-2 text-[10px] text-slate-400 font-mono">
                        {val < 50 ? 'L' : val > 50 ? 'R' : 'ROOT'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
              <div className="text-slate-500 font-semibold mb-1">Live Execution Trace:</div>
              {bstLogs.slice(0, 3).map((log, i) => (
                <div key={i} className={i === 0 ? 'text-indigo-300 font-medium' : 'text-slate-500'}>
                  › {log}
                </div>
              ))}
            </div>
          </div>

          {/* Controls Deck */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              BST Operations & Testing
            </h3>

            {/* Insert Control */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Insert New Integer Key</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. 25"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={insertBst}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>
              </div>
            </div>

            {/* Search Control */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Search Key (Trace Comparison)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="e.g. 70"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={searchBst}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Trace</span>
                </button>
              </div>
            </div>

            <button
              onClick={resetBst}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Standard Tree</span>
            </button>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-indigo-300">💡 Interview Golden Invariant</div>
              <p>For any node X, all left descendants &lt; X and all right descendants &gt; X. An in-order traversal (Left, Root, Right) always prints the values in non-decreasing order.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. TWO-POINTER ARRAY VISUALIZER */}
      {activeTab === 'two-pointer' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-semibold text-indigo-400">Two Sum in Sorted Array Simulation</span>
              <h3 className="text-lg font-bold text-white">Target Sum: {tpTarget}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetTwoPointer}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={stepTwoPointer}
                disabled={tpFound || leftPtr >= rightPtr}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Next Step</span>
              </button>
            </div>
          </div>

          {/* Interactive Bars & Pointer Glyphs */}
          <div className="py-8 flex items-end justify-center gap-3 sm:gap-4 overflow-x-auto">
            {tpArray.map((val, idx) => {
              const isLeft = idx === leftPtr;
              const isRight = idx === rightPtr;
              const isEither = isLeft || isRight;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Pointer tag */}
                  <div className="h-6">
                    {isLeft && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase shadow">
                        Left (L)
                      </span>
                    )}
                    {isRight && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-bold text-[10px] uppercase shadow">
                        Right (R)
                      </span>
                    )}
                  </div>

                  {/* Elevation bar */}
                  <div
                    style={{ height: `${val * 8 + 30}px` }}
                    className={`w-12 sm:w-14 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all ${
                      tpFound && isEither
                        ? 'bg-emerald-600 border-emerald-400 text-white scale-105'
                        : isEither
                        ? 'bg-indigo-600/80 border-indigo-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{val}</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-center justify-between">
            <span className="font-mono text-indigo-300">› {tpStepMessage}</span>
            {tpFound && (
              <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-md font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Solved in O(N) Time & O(1) Space!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. SORTING RACE */}
      {activeTab === 'sorting' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-semibold text-indigo-400">Bubble vs Linear Invariant</span>
              <h3 className="text-lg font-bold text-white">Array Swaps Tracker</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetSorting}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition cursor-pointer"
              >
                Reset Array
              </button>
              <button
                onClick={stepBubbleSort}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Single Swap Step ({sortingStep} steps)</span>
              </button>
            </div>
          </div>

          <div className="py-8 flex items-end justify-center gap-2 sm:gap-3">
            {sortArr.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  style={{ height: `${val * 2 + 20}px` }}
                  className="w-10 sm:w-12 rounded-lg bg-gradient-to-t from-indigo-900 to-indigo-600 border border-indigo-400/80 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            Bubble sort continuously compares adjacent elements (arr[i] &gt; arr[i+1]) and bubbles the largest element to the rightmost unsorted index. Worst case: O(N^2), Best case (already sorted with early break flag): O(N).
          </div>
        </div>
      )}

      {/* 4. SYSTEM DESIGN FLOW */}
      {activeTab === 'system-design' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-semibold text-cyan-400">Microservice Architecture Simulator</span>
              <h3 className="text-lg font-bold text-white">End-to-End High-Scale Request Pipeline</h3>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheHit}
                  onChange={(e) => setCacheHit(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Simulate Cache Hit</span>
              </label>
              <button
                onClick={advancePacket}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <span>Dispatch Request Packet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequential Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {stages.map((stg, idx) => {
              const isCurrent = packetStage === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/70 border-cyan-400 text-white ring-2 ring-cyan-500/40 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 mb-1">Node 0{idx + 1}</div>
                    <div className="text-xs font-bold text-white mb-2">{stg.name}</div>
                    <p className="text-[11px] leading-relaxed text-slate-300">{stg.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Latency</span>
                    <span className="text-cyan-300 font-semibold">{stg.latency}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Top placements tip: In System Design interviews, always mention adding a Redis cache-aside layer before the relational database to prevent thread exhaustion during traffic spikes!
            </span>
          </div>
        </div>
      )}

      {/* 5. APTITUDE PROBABILITY & BAYES */}
      {activeTab === 'probability' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800/80 pb-3">
              <span className="text-xs font-semibold text-amber-400">Quantitative Aptitude Simulator</span>
              <h3 className="text-lg font-bold text-white">Urn Sampling & Conditional Probability</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Red Balls (R): {redBalls}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={redBalls}
                  onChange={(e) => setRedBalls(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Blue Balls (B): {blueBalls}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={blueBalls}
                  onChange={(e) => setBlueBalls(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Visual Urn */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-center gap-2.5 min-h-[140px]">
              {Array.from({ length: redBalls }).map((_, i) => (
                <div key={`r-${i}`} className="w-8 h-8 rounded-full bg-rose-500 shadow-md shadow-rose-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                  R
                </div>
              ))}
              {Array.from({ length: blueBalls }).map((_, i) => (
                <div key={`b-${i}`} className="w-8 h-8 rounded-full bg-blue-500 shadow-md shadow-blue-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                  B
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-base font-bold text-white mb-4">Live Statistical Formulas</h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <div className="font-semibold text-white">P(Drawing 1 Red Ball)</div>
                    <div className="font-mono text-slate-500 text-[11px]">R / (R + B) = {redBalls}/{totalBalls}</div>
                  </div>
                  <div className="text-lg font-bold text-rose-400 tabular-nums">
                    {(pRed * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <div className="font-semibold text-white">P(Drawing 2 Red Balls without replacement)</div>
                    <div className="font-mono text-slate-500 text-[11px]">P(R1) × P(R2|R1)</div>
                  </div>
                  <div className="text-lg font-bold text-amber-400 tabular-nums">
                    {(pBothRed * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-slate-300">
              💡 Aptitude Trick: When two items are drawn "simultaneously", it is mathematically identical to drawing them one-by-one WITHOUT replacement.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
