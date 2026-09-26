import React, { useState, useEffect } from 'react';
import { Flashcard, Companion } from '../types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCw, 
  Upload, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Lightbulb, 
  BookOpen, 
  Award, 
  Layers,
  ArrowRight,
  Zap,
  Filter
} from 'lucide-react';

interface StudyFlashcardsProps {
  companion: Companion;
  onAddSparks?: (amount: number) => void;
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'When can you replace O(N²) nested loops with Two Pointers in O(N)?',
    back: 'The array must be sorted or monotonically ordered. The two pointers converge from opposite ends: moving left inward strictly increases sum, moving right inward decreases it.',
    hint: 'Rule of thumb: "Sorted array + find pair condition" = Two Pointers inward convergence.',
    category: 'DSA Foundations',
    difficulty: 'Easy',
    keyRule: 'Always verify if the array is already sorted before choosing Two Pointers over Hashing.',
    isMastered: false
  },
  {
    id: 'fc-2',
    front: 'Why does 0/1 Knapsack require reverse loop iteration in 1D array space compression?',
    back: 'Iterating capacity W backwards ensures each item is used at most once. Looping forward would overwrite values needed from the previous item step, causing accidental multi-use.',
    hint: 'Backwards iteration = 0/1 (single item). Forward iteration = Unbounded (infinite copies).',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    keyRule: 'dp[w] relies on dp[w - weight] from the prior item iteration.',
    isMastered: false
  },
  {
    id: 'fc-3',
    front: 'How do you detect and locate the start of a cycle in a Linked List with O(1) space?',
    back: 'Floyd\'s Tortoise & Hare: Fast moves 2x, Slow moves 1x until meeting inside the cycle. Then move Slow back to head and advance both at 1x speed; they meet at the cycle entrance.',
    hint: '2x and 1x speed to detect. Reset Slow to head at 1x to find entrance node.',
    category: 'Linear DSA',
    difficulty: 'Medium',
    keyRule: 'Mathematical proof: distance from head to entrance equals distance from meeting point to entrance modulo cycle length.',
    isMastered: false
  },
  {
    id: 'fc-4',
    front: 'What is the "Cache Stampede" in system design and how do you prevent it?',
    back: 'When a popular cached key expires, thousands of concurrent requests miss cache and hit the database simultaneously. Prevent using Mutex Locks on cache miss or probabilistic background refresh.',
    hint: 'Stampede = everyone rushing through an open door at once. Lock the door so only one queries SQL.',
    category: 'System Design',
    difficulty: 'Medium',
    keyRule: 'Never let expired hot keys cascade directly to relational databases without a mutex.',
    isMastered: false
  },
  {
    id: 'fc-5',
    front: 'What is the STAR framework formula for behavioral and Amazon leadership rounds?',
    back: 'Situation (15s context) → Task (15s problem challenge) → Action (60s specific technical implementation decisions you led) → Result (30s quantified impact, e.g., 40% latency drop).',
    hint: 'Spend 60% of your time on Action (what YOU did, not "we"). Quantify the Result with metrics.',
    category: 'HR & Behavioral',
    difficulty: 'Easy',
    keyRule: 'Never tell a story without a numerical metric in the Result phase.',
    isMastered: false
  },
  {
    id: 'fc-6',
    front: 'How do you validate if a Binary Tree is a valid Binary Search Tree (BST)?',
    back: 'Pass recursive (min, max) bounds to every node. Checking only node.left < node locally is a rookie mistake because the left subtree must be less than all ancestors.',
    hint: 'Propagate (min, max) boundaries downward, or check if in-order traversal is strictly sorted.',
    category: 'Trees & BST',
    difficulty: 'Medium',
    keyRule: 'Subtree invariants must hold for all ancestor roots, not just immediate parents.',
    isMastered: false
  }
];

export const StudyFlashcards: React.FC<StudyFlashcardsProps> = ({ companion, onAddSparks }) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_user_flashcards');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return DEFAULT_FLASHCARDS;
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // File Upload / Notes State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [rawNotesInput, setRawNotesInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('pq_user_flashcards', JSON.stringify(cards));
  }, [cards]);

  const categories = ['All', ...Array.from(new Set(cards.map((c) => c.category)))];

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[activeIdx] || filteredCards[0] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setActiveIdx((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setActiveIdx((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleToggleMastered = (id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = !c.isMastered;
          if (updated) {
            onAddSparks?.(15);
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
          return { ...c, isMastered: updated };
        }
        return c;
      })
    );
  };

  // Handle local file upload (.txt, .md, code, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawNotesInput(content);
      }
    };
    reader.readAsText(file);
  };

  // Generate flashcards from notes or uploaded file via backend
  const handleGenerateCards = async () => {
    if (!rawNotesInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setUploadSuccessMsg('');

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: rawNotesInput,
          fileName: fileName || 'Uploaded Notes'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.flashcards && data.flashcards.length > 0) {
          setCards((prev) => [...data.flashcards, ...prev]);
          setActiveIdx(0);
          setIsFlipped(false);
          setShowHint(false);
          setUploadSuccessMsg(`🎉 Successfully generated ${data.flashcards.length} high-impact flashcards with mnemonics!`);
          onAddSparks?.(40);
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 }
          });
          setTimeout(() => {
            setIsUploadModalOpen(false);
            setUploadSuccessMsg('');
            setRawNotesInput('');
            setFileName('');
          }, 2000);
        }
      } else {
        throw new Error('Generation failed');
      }
    } catch (err) {
      // Local fallback parser
      const lines = rawNotesInput.split('\n').filter((l) => l.trim().length > 10);
      const fallbackCards: Flashcard[] = lines.slice(0, 4).map((line, i) => ({
        id: `fc-user-${Date.now()}-${i}`,
        front: `Key Concept ${i + 1} from ${fileName || 'Notes'}`,
        back: line,
        hint: 'Review this takeaway to reinforce core intuition.',
        category: 'Uploaded Notes',
        difficulty: 'Medium',
        keyRule: 'Test your understanding by explaining this concept aloud.',
        isMastered: false
      }));

      setCards((prev) => [...fallbackCards, ...prev]);
      setUploadSuccessMsg(`Generated ${fallbackCards.length} flashcards from notes!`);
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccessMsg('');
      }, 1800);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = cards.filter((c) => c.isMastered).length;
  const progressPercent = Math.round((masteredCount / Math.max(1, cards.length)) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <span>Active Recall & Spaced Repetition</span>
            <span aria-hidden="true">·</span>
            <span>Mnemonic Hints for Easy Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Placement Flashcard Sanctum
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Test your reflex recall on core algorithms, invariants, and behavioral formulas. Upload your own notes or lecture files to auto-convert them into hint-powered flashcards!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Upload Notes Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes / File</span>
          </button>
        </div>
      </div>

      {/* Progress & Category Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIdx(0);
                setIsFlipped(false);
                setShowHint(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mastered Counter */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <span className="text-slate-400">Mastery Progress:</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-emerald-400">{masteredCount} / {cards.length}</span>
          </div>
        </div>
      </div>

      {/* Flashcard Main Flip Arena */}
      {currentCard ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[320px] sm:min-h-[360px] p-6 sm:p-10 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative shadow-2xl ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 border-indigo-500/70 ring-1 ring-indigo-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Card Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-bold text-indigo-300">
                  {currentCard.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentCard.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                    : currentCard.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                }`}>
                  {currentCard.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Card {activeIdx + 1} of {filteredCards.length}</span>
                <span className="text-[10px] text-indigo-400 font-semibold">(Click to {isFlipped ? 'hide' : 'flip'})</span>
              </div>
            </div>

            {/* Main Center Content */}
            <div className="my-auto py-6 text-center space-y-4 max-w-2xl mx-auto">
              {!isFlipped ? (
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                    Question / Core Intuition
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] leading-relaxed">
                    {currentCard.front}
                  </h2>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-1">
                    Answer & Architectural Insight
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                    {currentCard.back}
                  </p>

                  {currentCard.keyRule && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-xs text-indigo-300 max-w-lg mx-auto flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{currentCard.keyRule}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Actions: Hint & Mastered status */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
              {/* Hint button to make learning super easy */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 font-semibold flex items-center gap-1.5 hover:bg-amber-950/70 transition cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>

                {showHint && (
                  <div className="absolute left-0 bottom-10 z-20 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-950 border border-amber-500/50 shadow-2xl text-xs text-amber-200 leading-relaxed animate-in fade-in">
                    <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                      <span>💡 Memory Anchor:</span>
                    </div>
                    {currentCard.hint}
                  </div>
                )}
              </div>

              {/* Mastered Check */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMastered(currentCard.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  currentCard.isMastered
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${currentCard.isMastered ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{currentCard.isMastered ? 'Mastered 🎯' : 'Mark as Mastered'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          No flashcards found in this category.
        </div>
      )}

      {/* Upload File / Paste Notes Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Generate Flashcards from Notes & Files</h2>
                  <div className="text-xs text-slate-400">Auto-extracts easy-to-learn cards with memory hints</div>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* File Drop Area */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Option A: Upload a Document or Code File</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-950/60 relative">
                  <input
                    type="file"
                    accept=".txt,.md,.js,.ts,.py,.java,.cpp,.json,.csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <FileText className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                  <div className="font-semibold text-slate-200">
                    {fileName ? `Selected: ${fileName}` : 'Click to browse or drag file here'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Supports .txt, .md, lecture notes, or code cheat sheets
                  </div>
                </div>
              </div>

              {/* Paste Text / Notes Area */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Option B: Paste Rough Notes or Key Points</label>
                <textarea
                  rows={5}
                  value={rawNotesInput}
                  onChange={(e) => setRawNotesInput(e.target.value)}
                  placeholder="Paste algorithm explanations, professor formulas, or interview questions here..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!rawNotesInput.trim() || isGenerating}
                  onClick={handleGenerateCards}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating Flashcards & Hints...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Easy-to-Learn Cards</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
