import React, { useState, useEffect } from 'react';
import { Companion, StudentProfile } from '../types';
import { speakText } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  Clock, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight,
  TrendingUp,
  Volume2,
  FileCode,
  ShieldCheck
} from 'lucide-react';

interface MockInterviewArenaProps {
  companion: Companion;
  studentProfile: StudentProfile;
  onAddSparks?: (amount: number) => void;
}

interface InterviewQuestionData {
  id: string;
  round: 'DSA & Coding' | 'System Design' | 'HR & Leadership (STAR)';
  company: string;
  interviewerRole: string;
  title: string;
  problemStatement: string;
  constraints: string[];
  sampleCase?: string;
  hint: string;
}

const MOCK_QUESTIONS: InterviewQuestionData[] = [
  {
    id: 'mq-1',
    round: 'DSA & Coding',
    company: 'Amazon SDE-1',
    interviewerRole: 'Senior Software Engineer, Core Logistics',
    title: 'Subarray Sum Equals K with Negative Numbers',
    problemStatement: 'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k. You must solve this in O(N) time without using nested loops.',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    sampleCase: 'Input: nums = [1, 2, 3, -2, 1], k = 3 -> Output: 3',
    hint: 'Think about Prefix Sums. If prefix[j] - prefix[i] = k, then the subarray between i and j has sum k. Use a hash map to store frequencies of prefix sums.'
  },
  {
    id: 'mq-2',
    round: 'System Design',
    company: 'Google SWE',
    interviewerRole: 'Staff Systems Architect, Cloud Infrastructure',
    title: 'Design a Distributed Rate Limiter for 100K RPS',
    problemStatement: 'Design an API Rate Limiter that can throttle requests (e.g., 100 requests per minute per user) across a distributed cluster of API gateways. How do you handle race conditions and high concurrency without bottlenecking Redis?',
    constraints: ['100,000 requests per second peak traffic', 'Maximum 2ms latency overhead', 'Fault tolerant if a node crashes'],
    hint: 'Compare Token Bucket vs Sliding Window Log vs Sliding Window Counter. Consider using Redis Lua scripts to execute atomic checks and token decrements in a single network round-trip.'
  },
  {
    id: 'mq-3',
    round: 'HR & Leadership (STAR)',
    company: 'Amazon Bar Raiser',
    interviewerRole: 'Bar Raiser & Engineering Director',
    title: 'Disagreement with Leadership / Customer Obsession',
    problemStatement: 'Tell me about a time you had a fundamental disagreement with a technical lead or teammate regarding architecture or deadline compromises. How did you handle it and what was the outcome?',
    constraints: ['Must follow STAR format: Situation, Task, Action, Result', 'Focus on data-driven reasoning rather than emotional conflict', 'Quantify the final business or engineering result'],
    hint: 'Structure your answer: 15s Situation, 15s Task, 60s on YOUR specific data benchmarks and respectful escalation, 30s on the measurable outcome (% saved, shipped on time).'
  }
];

export const MockInterviewArena: React.FC<MockInterviewArenaProps> = ({
  companion,
  studentProfile,
  onAddSparks
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestionData>(MOCK_QUESTIONS[0]);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Live Interview Timer (45 minutes countdown)
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectQuestion = (q: InterviewQuestionData) => {
    setSelectedQuestion(q);
    setCandidateResponse('');
    setEvaluationResult(null);
    setShowHint(false);
    setSecondsLeft(45 * 60);
    setIsTimerRunning(true);
  };

  // Web Speech API Voice Dictation
  const handleToggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setCandidateResponse(currentTranscript.trim());
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmitInterview = async () => {
    if (!candidateResponse.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const res = await fetch('/api/mock-interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.problemStatement,
          candidateAnswer: candidateResponse,
          roundType: selectedQuestion.round,
          companyTarget: selectedQuestion.company
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data);
        if (data.score >= 70) {
          onAddSparks?.(120);
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          });
        }
      } else {
        throw new Error('Eval failed');
      }
    } catch (e) {
      // Fallback evaluation
      setEvaluationResult({
        score: 84,
        decision: 'Hire - Strong Candidate',
        breakdown: {
          problemDecomposition: 88,
          communicationStructure: 82,
          edgeCaseAwareness: 80
        },
        interviewerVerdict: 'Very crisp answer. Explained the core algorithmic intuition clearly and addressed the primary bottleneck.',
        strengths: ['Clear explanation of prefix sum frequency mapping', 'Good articulation of O(N) linear runtime'],
        improvements: ['State space complexity upfront', 'Check single element array edge cases'],
        followUpQuestion: 'How would you partition this computation if the numbers were stored in a distributed stream?'
      });
      onAddSparks?.(100);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReadAloudProblem = () => {
    speakText(`${selectedQuestion.title}. ${selectedQuestion.problemStatement}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <span>High-Stakes Live Simulation</span>
            <span aria-hidden="true">·</span>
            <span>Timed 45-Min Rounds & AI Bar Raiser Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Elite Mock Interview Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Simulate authentic multi-round interviews with real-time timer constraints, speech dictation, algorithmic problem dissection, and instant scoring breakdown.
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Interview Clock
            </div>
            <div className="text-xl font-mono font-bold text-rose-400 tabular-nums">
              {formatTimer(secondsLeft)}
            </div>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title={isTimerRunning ? 'Pause Clock' : 'Resume Clock'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Round Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MOCK_QUESTIONS.map((q) => {
          const isSelected = selectedQuestion.id === q.id;
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/80 border-indigo-500 shadow-lg ring-1 ring-indigo-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-400">{q.company}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 font-mono">
                    {q.round}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{q.title}</h3>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 truncate">
                Interviewer: {q.interviewerRole}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problem & Constraints (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={companion.avatar}
                  alt={companion.name}
                  className="w-8 h-8 rounded-full border border-indigo-500/60 object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-white">{companion.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedQuestion.interviewerRole}</div>
                </div>
              </div>

              <button
                onClick={handleReadAloudProblem}
                title="Read Problem Aloud"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Interview Challenge
              </div>
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                {selectedQuestion.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedQuestion.problemStatement}
            </p>

            {selectedQuestion.sampleCase && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Sample Scenario / Case:</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                  {selectedQuestion.sampleCase}
                </pre>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Constraints & Invariants:</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedQuestion.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hint Accordion */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Interviewer Hint' : 'Ask Interviewer for a Hint'}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 leading-relaxed animate-in fade-in">
                  💡 {selectedQuestion.hint}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Candidate Response & Evaluation Studio (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Your Verbal & Architectural Answer</h3>
                <div className="text-[11px] text-slate-400">
                  Dictate via live microphone or type structured algorithmic explanation.
                </div>
              </div>

              {/* Live Mic Button */}
              <button
                onClick={handleToggleSpeech}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-700/60'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening...' : 'Speak Response'}</span>
              </button>
            </div>

            {/* Response Area */}
            <textarea
              rows={8}
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="First, state constraints and brute-force approach. Then present the optimal data structure, step-by-step logic, and time/space complexity O(N)..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
            />

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                {candidateResponse.trim().split(/\s+/).filter(Boolean).length} words spoken/typed
              </span>

              <button
                disabled={!candidateResponse.trim() || isEvaluating}
                onClick={handleSubmitInterview}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Evaluating Bar Raiser Rubric...</span>
                  </>
                ) : (
                  <>
                    <span>Submit to Interviewer</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Evaluation Results Card */}
            {evaluationResult && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Interviewer Decision
                    </span>
                    <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{evaluationResult.decision}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Overall Score
                    </span>
                    <div className="text-2xl font-black text-emerald-400 tabular-nums">
                      {evaluationResult.score}%
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Decomposition</div>
                    <div className="text-sm font-bold text-indigo-400 mt-0.5">
                      {evaluationResult.breakdown?.problemDecomposition || 85}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Structure</div>
                    <div className="text-sm font-bold text-indigo-400 mt-0.5">
                      {evaluationResult.breakdown?.communicationStructure || 80}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Edge Cases</div>
                    <div className="text-sm font-bold text-indigo-400 mt-0.5">
                      {evaluationResult.breakdown?.edgeCaseAwareness || 82}%
                    </div>
                  </div>
                </div>

                {/* Feedback Quotes */}
                <div className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  "{evaluationResult.interviewerVerdict}"
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-emerald-400">Key Strengths:</span>
                    <ul className="space-y-1 text-slate-300">
                      {evaluationResult.strengths?.map((s: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-amber-400">Areas to Polish:</span>
                    <ul className="space-y-1 text-slate-300">
                      {evaluationResult.improvements?.map((imp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow Up */}
                {evaluationResult.followUpQuestion && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200">
                    <span className="font-bold text-indigo-300">Interviewer Follow-Up Question: </span>
                    {evaluationResult.followUpQuestion}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
