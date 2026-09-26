import React, { useState, useEffect } from 'react';
import { Companion, CharacterLevel } from '../types';
import { CHARACTER_LEVELS, getCharacterLevel } from '../data/characterProgression';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Zap, 
  Award, 
  Sparkles, 
  Crown, 
  Lock, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Flame, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface CharacterProgressionCardProps {
  sparks: number;
  companion: Companion;
  onAddSparks: (amount: number) => void;
}

export const CharacterProgressionCard: React.FC<CharacterProgressionCardProps> = ({
  sparks,
  companion,
  onAddSparks
}) => {
  const levelInfo = getCharacterLevel(sparks);
  const [showAllLevels, setShowAllLevels] = useState(false);

  // Live Running Study Sprint Stopwatch
  const [isStudying, setIsStudying] = useState(false);
  const [studySeconds, setStudySeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isStudying) {
      interval = setInterval(() => {
        setStudySeconds((prev) => {
          const next = prev + 1;
          // Every 60 seconds of focused study awards 5 sparks!
          if (next % 60 === 0) {
            onAddSparks(5);
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.9 }
            });
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStudying, onAddSparks]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/60 border border-slate-800 shadow-2xl space-y-6">
      {/* Top Header: Character Title & Level Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          {/* Animated Avatar with Level Aura */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-xl bg-slate-800 p-0.5 ${
              levelInfo.currentLevel.level >= 4
                ? 'border-amber-400 ring-4 ring-amber-500/20'
                : 'border-indigo-400 ring-4 ring-indigo-500/20'
            }`}>
              <img
                src={companion.avatar}
                alt={companion.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-indigo-600 border border-indigo-400 text-white font-extrabold text-[10px] flex items-center gap-0.5 shadow-md">
              <span>LVL {levelInfo.currentLevel.level}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Character Level Progression
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-semibold">
                Gear: {levelInfo.currentLevel.gearName}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 mt-0.5">
              <span>{levelInfo.currentLevel.title}</span>
              {levelInfo.currentLevel.level === 5 && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
            </h2>

            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Badge: <strong className="text-slate-200">{levelInfo.currentLevel.badgeName}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-300 font-medium">
                {levelInfo.nextLevel ? `${levelInfo.sparksNeededForNext} XP to Level ${levelInfo.nextLevel.level}` : 'Max Tier Legend!'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Running Focus Stopwatch */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Live Study Sprint</span>
            </div>
            <div className="text-lg font-mono font-bold text-white tabular-nums">
              {formatTimer(studySeconds)}
            </div>
            <div className="text-[9px] text-emerald-400 font-medium">
              +5 XP every 60s
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStudying(!isStudying)}
              className={`p-2.5 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center gap-1 shadow-md ${
                isStudying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={isStudying ? 'Pause Focus Session' : 'Start Focus Session'}
            >
              {isStudying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            {studySeconds > 0 && !isStudying && (
              <button
                onClick={() => setStudySeconds(0)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Level XP Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
          <span>Level {levelInfo.currentLevel.level} Progress</span>
          <span className="font-mono text-indigo-300">
            {sparks} Total Sparks · {levelInfo.progressPercent}% to {levelInfo.nextLevel ? levelInfo.nextLevel.title : 'Max Tier'}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 shadow-sm"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* 5-Level Unlocking Roadmap Trail */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Unlocking Tiers & Perks
          </span>
          <button
            onClick={() => setShowAllLevels(!showAllLevels)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
          >
            {showAllLevels ? 'Show Current' : 'View All 5 Levels'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {CHARACTER_LEVELS.map((lvl) => {
            const isUnlocked = sparks >= lvl.minSparks;
            const isCurrent = levelInfo.currentLevel.level === lvl.level;

            if (!showAllLevels && !isCurrent && lvl.level !== (levelInfo.nextLevel?.level || 5)) {
              return null;
            }

            return (
              <div
                key={lvl.level}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/80 border-indigo-400 shadow-xl ring-2 ring-indigo-500/30'
                    : isUnlocked
                    ? 'bg-slate-950/80 border-emerald-800/40 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 opacity-60 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold font-mono">
                      LVL {lvl.level}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>

                  <div className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {lvl.title}
                  </div>

                  <div className="text-[10px] text-slate-400 mb-2">
                    Needs {lvl.minSparks} ⚡ Sparks
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
                  {lvl.perks.map((p, i) => (
                    <div key={i} className="text-slate-300 truncate">
                      · {p}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
