import React, { useState } from 'react';
import { SkillNode, Companion } from '../types';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Zap, 
  Play, 
  Award, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  HelpCircle,
  FileCode,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface OrderedRoadmapProps {
  nodes: SkillNode[];
  companion: Companion;
  onMarkLearned: (nodeId: string) => void;
  onPassAssessment: (nodeId: string, score: number, sparksEarned: number) => void;
  onNavigateVisualizer: () => void;
}

export const OrderedRoadmap: React.FC<OrderedRoadmapProps> = ({
  nodes,
  companion,
  onMarkLearned,
  onPassAssessment,
  onNavigateVisualizer
}) => {
  // Find current active node (first unlocked node that is not completed, or default to first node)
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    const active = nodes.find(n => n.isUnlocked && !n.isCompleted);
    return active ? active.id : nodes[0].id;
  });

  const [activeTab, setActiveTab] = useState<'learn' | 'test'>('learn');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [testResult, setTestResult] = useState<{ score: number; passed: boolean } | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const completedCount = nodes.filter(n => n.isCompleted).length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

  const handleSelectNode = (node: SkillNode) => {
    if (!node.isUnlocked) return;
    setSelectedNodeId(node.id);
    setActiveTab(node.isLearned ? 'test' : 'learn');
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowAnswerFeedback(false);
    setTestResult(null);
  };

  const handleFinishLearning = () => {
    onMarkLearned(selectedNode.id);
    setActiveTab('test');
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowAnswerFeedback(false);
    setTestResult(null);
  };

  const handleAnswerOption = (optIdx: number) => {
    if (showAnswerFeedback) return;
    setUserAnswers({ ...userAnswers, [currentQuestionIdx]: optIdx });
    setShowAnswerFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < selectedNode.assessmentQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowAnswerFeedback(false);
    } else {
      // Calculate final score
      let correct = 0;
      selectedNode.assessmentQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) correct++;
      });
      const score = Math.round((correct / selectedNode.assessmentQuestions.length) * 100);
      const passed = score >= 70;
      setTestResult({ score, passed });

      if (passed) {
        onPassAssessment(selectedNode.id, score, 100);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleNextStepInRoadmap = () => {
    const nextNode = nodes.find(n => n.stepNumber === selectedNode.stepNumber + 1);
    if (nextNode) {
      setSelectedNodeId(nextNode.id);
      setActiveTab('learn');
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setShowAnswerFeedback(false);
      setTestResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Calm, Clean Progress Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <span>Step-by-Step Learning Order</span>
              <span aria-hidden="true">·</span>
              <span>Learn First, Test Assessment, Unlock Next</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
              Placement Roadmap Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Clean, zero-clutter order. Complete each topic study, pass the test assessment to prove thoroughness, and earn scores to unlock the next milestone.
            </p>
          </div>

          {/* Progress Tracker Pill */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Overall Roadmap</span>
              <span className="font-mono text-indigo-400">{completedCount} of {nodes.length} Complete ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Ordered Step List; Right is Focused Active Topic Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ordered Steps (Steps 1 to 8) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Ordered Curriculum</span>
            <span>Step by Step</span>
          </div>

          <div className="space-y-2.5">
            {nodes.map((node) => {
              const isSelected = selectedNode.id === node.id;

              return (
                <button
                  key={node.id}
                  disabled={!node.isUnlocked}
                  onClick={() => handleSelectNode(node)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : node.isCompleted
                      ? 'bg-slate-900/90 border-emerald-800/40 hover:border-emerald-700'
                      : node.isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/50 border-slate-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Step Number Circle */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      node.isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : node.isUnlocked
                        ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {node.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span>0{node.stepNumber}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {node.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{node.category}</span>
                        {node.isCompleted ? (
                          <span className="text-emerald-400 font-medium">· Score: {node.masteryScore}%</span>
                        ) : node.isUnlocked ? (
                          <span className="text-indigo-400 font-medium">· {node.isLearned ? 'Ready for Test' : 'Study First'}</span>
                        ) : (
                          <span className="text-slate-500">· Locked</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {node.isCompleted ? (
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : node.isUnlocked ? (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Focused Interactive Learning & Assessment Studio */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card Header for Current Step */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <span>Step 0{selectedNode.stepNumber} of 0{nodes.length}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedNode.category}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedNode.title}
                </h2>
              </div>

              {/* 2 Ordered Tabs: 1. Study Lesson -> 2. Test Assessment */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'learn'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Study & Learn</span>
                </button>

                <button
                  disabled={!selectedNode.isLearned && !selectedNode.isCompleted}
                  onClick={() => setActiveTab('test')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'test'
                      ? 'bg-indigo-600 text-white shadow'
                      : selectedNode.isLearned || selectedNode.isCompleted
                      ? 'text-slate-400 hover:text-white cursor-pointer'
                      : 'text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  title={!selectedNode.isLearned ? 'Complete the study guide to unlock the test' : ''}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>2. Test Assessment</span>
                  {!selectedNode.isLearned && !selectedNode.isCompleted && (
                    <Lock className="w-3 h-3 ml-0.5 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* TAB 1: STUDY & LEARN CONTENT */}
            {activeTab === 'learn' && (
              <div className="space-y-6 pt-2">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedNode.lesson.overview}
                </p>

                {/* Lesson Sections */}
                <div className="space-y-4">
                  {selectedNode.lesson.sections.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-white">
                        {sec.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {sec.body}
                      </p>

                      {sec.codeSnippet && (
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-500 font-mono">Example Implementation:</div>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                            {sec.codeSnippet}
                          </pre>
                        </div>
                      )}

                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{sec.keyRule}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Cheat Sheet */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Interview Flash Rules (Cheat Sheet)
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedNode.lesson.cheatSheet.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visualizer Link Action */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-300">
                  <span>Want to see this algorithm in action with interactive pointers & tree nodes?</span>
                  <button
                    onClick={onNavigateVisualizer}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Open Visualizer Lab</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Action button to finish study & unlock test */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleFinishLearning}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>I have studied this topic. Proceed to Test Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: TEST ASSESSMENT CONTENT */}
            {activeTab === 'test' && (
              <div className="space-y-6 pt-2">
                {!testResult ? (
                  <>
                    {/* Active Question */}
                    {(() => {
                      const q = selectedNode.assessmentQuestions[currentQuestionIdx];
                      const selected = userAnswers[currentQuestionIdx];

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                            <span>Question {currentQuestionIdx + 1} of {selectedNode.assessmentQuestions.length}</span>
                            <span className="text-indigo-400 font-semibold">Pass mark: 70%+ to unlock next topic</span>
                          </div>

                          <h3 className="text-base font-semibold text-white leading-relaxed">
                            {q.question}
                          </h3>

                          {q.codeSnippet && (
                            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                              {q.codeSnippet}
                            </pre>
                          )}

                          <div className="space-y-2.5">
                            {q.options.map((opt, optIdx) => {
                              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';
                              if (showAnswerFeedback) {
                                if (optIdx === q.correctIndex) {
                                  style = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-semibold';
                                } else if (selected === optIdx) {
                                  style = 'bg-rose-950/80 border-rose-600 text-rose-200';
                                } else {
                                  style = 'opacity-40 border-slate-900';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={showAnswerFeedback}
                                  onClick={() => handleAnswerOption(optIdx)}
                                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                                >
                                  <span>{opt}</span>
                                  {showAnswerFeedback && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showAnswerFeedback && (
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed animate-in fade-in">
                              <div className="font-semibold text-slate-200">
                                {selected === q.correctIndex ? '✅ Correct!' : '❌ Incorrect'}
                              </div>
                              <p className="text-slate-300">{q.explanation}</p>
                              <div className="text-indigo-400 font-medium">💡 Interview Tip: {q.tip}</div>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              disabled={!showAnswerFeedback}
                              onClick={handleNextQuestion}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{currentQuestionIdx + 1 === selectedNode.assessmentQuestions.length ? 'Submit Assessment' : 'Next Question'}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  /* Assessment Finished Score Screen */
                  <div className="text-center py-8 space-y-5">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 ${
                      testResult.passed
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    }`}>
                      {testResult.passed ? <Sparkles className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                        Assessment Result
                      </div>
                      <div className="text-3xl font-black text-white mt-1 tabular-nums">
                        {testResult.score}% Score
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      {testResult.passed ? companion.cheerMessage : 'You scored under 70%. Review the study guide once more and retake to unlock the next topic!'}
                    </p>

                    {testResult.passed ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 max-w-xs mx-auto text-center">
                          <span className="text-xs text-indigo-300 font-semibold">Reward Added</span>
                          <div className="text-xl font-black text-indigo-300 mt-1 flex items-center justify-center gap-1.5">
                            <Zap className="w-5 h-5 fill-indigo-400" />
                            <span>+100 Sparks Earned</span>
                          </div>
                        </div>

                        {selectedNode.stepNumber < nodes.length ? (
                          <button
                            onClick={handleNextStepInRoadmap}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 mx-auto cursor-pointer"
                          >
                            <span>Unlock & Study Next Topic (Step 0{selectedNode.stepNumber + 1})</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="text-xs text-emerald-400 font-semibold">
                            🏆 You have mastered the entire placement roadmap!
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTab('learn');
                          setTestResult(null);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Review Study Notes Again
                      </button>
                    )}
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
