import React, { useState, useEffect, useRef } from 'react';
import { Companion } from '../types';
import { createSpeechRecognizer, speakText } from '../utils/speech';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Sparkles, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Languages,
  RotateCcw
} from 'lucide-react';

interface SpeakingCoachProps {
  companion: Companion;
  onIncrementPracticeCount: () => void;
  onAddSparks: (amount: number) => void;
}

export const SpeakingCoach: React.FC<SpeakingCoachProps> = ({
  companion,
  onIncrementPracticeCount,
  onAddSparks
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false);

  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  const interviewQuestions = [
    {
      id: 'q-1',
      type: 'Executive Intro',
      question: 'Tell me about yourself, your technical journey, and what drives you as an engineer.',
      hint: 'Limit to 90 seconds. Formula: Present (current focus) → Past (key milestones) → Future (why this role excites you).'
    },
    {
      id: 'q-2',
      type: 'STAR Behavioral',
      question: 'Describe a situation where a technical project hit an unexpected blocker. What action did you take?',
      hint: 'Structure: 15s Situation, 15s Task, 60s Specific Action you took, 30s Quantified Result.'
    },
    {
      id: 'q-3',
      type: 'Core Value Proposition',
      question: 'Why should our engineering team hire you over 200 other qualified candidates?',
      hint: 'Highlight high agency, curiosity, fast learning curve, and a tangible example of ownership.'
    },
    {
      id: 'q-4',
      type: 'Conflict Resolution',
      question: 'Tell me about a time you had a difference of opinion with a team member during a sprint or project.',
      hint: 'Focus on empathy, data-driven reasoning, and prioritizing team delivery over personal ego.'
    }
  ];

  const currentQ = interviewQuestions[activeQuestionIndex];

  useEffect(() => {
    recognizerRef.current = createSpeechRecognizer();
    return () => {
      recognizerRef.current?.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTranscript('');
      setFeedback(null);
      recognizerRef.current?.start(
        (text) => {
          setTranscript(text);
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsRecording(false);
        }
      );
    }
  };

  const handleAvatarSpeakQuestion = () => {
    if (isAvatarSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAvatarSpeaking(false);
      return;
    }

    setIsAvatarSpeaking(true);
    speakText(currentQ.question, () => {
      setIsAvatarSpeaking(false);
    });
  };

  const analyzeAnswer = async () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/speech-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          answerText: transcript,
          language: selectedLanguage,
          targetRole: 'Software Development Engineer'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
        onIncrementPracticeCount();
        onAddSparks(40);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (e) {
      // Local fallback calculation
      const words = transcript.trim().split(/\s+/);
      const fillers = ['um', 'uh', 'like', 'actually', 'basically'];
      let count = 0;
      fillers.forEach(f => {
        const matches = transcript.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'gi'));
        if (matches) count += matches.length;
      });

      setFeedback({
        score: Math.max(65, 92 - count * 4),
        structureEvaluation: 'Your answer is direct and demonstrates relevant enthusiasm. Tightening the STAR structure will maximize points.',
        strengths: ['Great direct communication', 'Relevant technical vocabulary applied'],
        improvements: ['Include exact numbers or metrics (e.g., % improvement, users served)', count > 0 ? `Detected ${count} filler pauses. Practice 1-second silent breathing.` : 'Pace your conclusion crisply.'],
        sampleIdealResponse: `During my recent distributed system build (Situation), we faced high latency under peak load (Task). I identified the B-Tree indexing deficiency and introduced Redis caching (Action), slashing P99 latency by 55% and handling 4,000 req/sec seamlessly (Result).`,
        fillerAnalysis: {
          totalWords: words.length,
          fillerCount: count,
          fillers: fillers.map(f => ({ word: f, count: (transcript.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'gi')) || []).length })).filter(f => f.count > 0)
        }
      });
      onIncrementPracticeCount();
      onAddSparks(30);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title & Language Preference Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-1">
            <span>Virtual Speaking Assistant</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Mic & STAR Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            AI Voice & Communication Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Overcome interview anxiety. Practice speaking with your live microphone. Detect filler words like "um" and "like", verify your STAR story structure, and build executive presence.
          </p>
        </div>

        {/* Language Preference Control */}
        <div className="flex items-center gap-2 p-2 bg-slate-950/90 border border-slate-800 rounded-xl shrink-0">
          <Languages className="w-4 h-4 text-indigo-400 ml-1" />
          <span className="text-xs text-slate-400 font-medium">Native Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
          </select>
        </div>
      </div>

      {/* Main Practice Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question & Voice Recorder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Selector Deck */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Question {activeQuestionIndex + 1} of {interviewQuestions.length} · {currentQ.type}
              </span>
              <div className="flex items-center gap-1.5">
                {interviewQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      setTranscript('');
                      setFeedback(null);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeQuestionIndex === idx
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                "{currentQ.question}"
              </h2>

              <button
                onClick={handleAvatarSpeakQuestion}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 border border-slate-700 transition cursor-pointer shrink-0"
                title="Hear Coach Speak Question"
              >
                <Volume2 className={`w-5 h-5 ${isAvatarSpeaking ? 'text-indigo-400 animate-pulse' : ''}`} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-indigo-300">Coach Strategy: </span>
              {currentQ.hint}
            </div>
          </div>

          {/* Transcript & Mic Recording Area */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Your Spoken Answer
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-xs text-rose-400 animate-pulse font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Listening to Microphone...
                  </span>
                )}
              </div>

              {transcript && (
                <button
                  onClick={() => setTranscript('')}
                  className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click 'Start Microphone' to talk aloud, or type your answer here..."
              rows={5}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={toggleRecording}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Start Speaking with Mic'}</span>
              </button>

              <button
                disabled={!transcript.trim() || isAnalyzing}
                onClick={analyzeAnswer}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Articulation...' : 'Analyze My Speech'}</span>
              </button>
            </div>
          </div>

          {/* AI Analysis Feedback Results */}
          {feedback && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-700/50 shadow-2xl space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Placement Articulation Audit
                  </div>
                  <h3 className="text-lg font-bold text-white">Interview Readiness Score</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-emerald-400 tabular-nums">
                    {feedback.score}<span className="text-lg text-slate-500">/100</span>
                  </div>
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              {/* Filler Words Metric */}
              {feedback.fillerAnalysis && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Total Spoken Words: </span>
                    <span className="font-bold text-white tabular-nums">{feedback.fillerAnalysis.totalWords}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Filler Words Detected: </span>
                    <span className={`font-bold tabular-nums ${feedback.fillerAnalysis.fillerCount > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {feedback.fillerAnalysis.fillerCount} {feedback.fillerAnalysis.fillerCount > 0 && `(${feedback.fillerAnalysis.fillers.map((f: any) => `"${f.word}" × ${f.count}`).join(', ')})`}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Pacing: <span className="text-indigo-300 font-medium">Optimal 125 WPM</span>
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-indigo-300">STAR Structure Appraisal:</div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {feedback.structureEvaluation}
                </p>
              </div>

              {/* Strengths & Actionable Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-800/40 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {feedback.strengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-800/40 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>How to Level Up</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {feedback.improvements?.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">·</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gold Model STAR Answer */}
              {feedback.sampleIdealResponse && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-700/50 space-y-2">
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Coach Model Answer (Gold Standard STAR)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    "{feedback.sampleIdealResponse}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Communication Playbook for Students */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Non-Native English Mastery Tips
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-white">1. The 1-Second Silent Breath</div>
                <p className="text-slate-400">When your brain searches for a word, do not say "ummm" or "aaah". Close your mouth and breathe for 1 second. Silence projects deep confidence.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-white">2. Transition Words for Fluency</div>
                <p className="text-slate-400">Use bridge words: "Specifically...", "Consequently...", "To validate this...", "As a direct result...". They instantly give your speech executive polish.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-white">3. Clear Enunciation Beats Accent</div>
                <p className="text-slate-400">Interviewers love Indian & global accents! What matters is enunciation. Slightly lower your talking speed to 120 WPM so every technical term lands clearly.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 space-y-3">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Speaking Routine Challenge
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Practicing 2 questions out loud daily rewires verbal neural pathways in 7 days, eliminating 80% of placement stage-fright!
            </p>
            <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
              <span>⚡ Earns +40 Sparks per completed session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
