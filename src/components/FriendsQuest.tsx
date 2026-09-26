import React, { useState } from 'react';
import { FriendUser, SquadQuest } from '../types';
import { INITIAL_FRIENDS, INITIAL_SQUAD_QUESTS } from '../data/curriculum';
import { 
  Users, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Award, 
  Send, 
  UserPlus, 
  Bell, 
  Trophy, 
  Sparkles,
  Share2,
  Swords
} from 'lucide-react';

export const FriendsQuest: React.FC = () => {
  const [friends, setFriends] = useState<FriendUser[]>(INITIAL_FRIENDS);
  const [quests, setQuests] = useState<SquadQuest[]>(INITIAL_SQUAD_QUESTS);
  const [squadCode, setSquadCode] = useState('CODE-QUEST-2026');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'squad' | 'leaderboard' | 'duel'>('squad');
  const [duelSent, setDuelSent] = useState<string | null>(null);

  const handleNudge = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isNudged: true } : f))
    );
  };

  const handleSendDuel = (name: string) => {
    setDuelSent(name);
    setTimeout(() => {
      setDuelSent(null);
    }, 4000);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(squadCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span>Social Accountability</span>
            <span aria-hidden="true">·</span>
            <span>Co-op Milestones & Streak Defense</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Fraunces']">
            Placement Squad Quests
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Never prepare alone. Form a study squad with campus friends, complete collaborative daily goals, protect team streaks, and push each other towards day-1 placements.
          </p>
        </div>

        {/* Squad Invite Code */}
        <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Your Squad Room Code:</span>
            <span className="font-mono font-bold text-indigo-300">{squadCode}</span>
          </div>
          <button
            onClick={copyCode}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-700/60 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('squad')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'squad'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Squad Quests & Friends</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Campus Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('duel')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'duel'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Friend Speed Duels</span>
        </button>
      </div>

      {/* Duel Confirmation Toast */}
      {duelSent && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Speed Duel challenge dispatched to <strong>{duelSent}</strong>! They have 2 hours to beat your 3-question quiz benchmark.</span>
        </div>
      )}

      {/* 1. SQUAD QUESTS & FRIENDS TAB */}
      {activeTab === 'squad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Co-op Goals (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center justify-between">
              <span>Active Squad Co-op Quests</span>
              <span className="text-xs text-indigo-400 font-normal">Resets in 11 hours</span>
            </h2>

            <div className="space-y-3">
              {quests.map((q) => {
                const percent = Math.min(100, Math.round((q.current / q.goal) * 100));

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">{q.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-800/60 text-indigo-300 text-xs font-bold flex items-center gap-1 shrink-0">
                        <Zap className="w-3.5 h-3.5 fill-indigo-400" />
                        <span>+{q.rewardSparks} Sparks</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Squad Progress</span>
                        <span className="font-mono text-indigo-400">{q.current} / {q.goal} {q.unit} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Squad Members & Live Status (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Squad Members (4)
              </h2>
              <span className="text-xs text-slate-400">Streak Defense</span>
            </div>

            <div className="space-y-2.5">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {f.college} · {f.currentTopic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 tabular-nums">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{f.streak}d</span>
                    </div>

                    <button
                      disabled={f.isNudged}
                      onClick={() => handleNudge(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                        f.isNudged
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                      <span>{f.isNudged ? 'Nudged' : 'Nudge'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CAMPUS LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Campus Weekly Placement Sparks Leaderboard
            </h2>
            <span className="text-xs text-slate-400">Weekly Refresh</span>
          </div>

          <div className="space-y-2">
            {[...friends, { id: 'me', name: 'You (Champion)', college: 'Your College', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=You', streak: 4, sparks: 520, completedTopicsCount: 3, currentTopic: 'In Progress', status: 'Studying' as const }]
              .sort((a, b) => b.sparks - a.sparks)
              .map((u, rank) => (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    u.id === 'me'
                      ? 'bg-indigo-950/70 border-indigo-600 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold text-xs ${
                      rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-slate-300' : rank === 2 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{rank + 1}
                    </span>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {u.college}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-amber-400 tabular-nums">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{u.streak}d streak</span>
                    </div>

                    <div className="font-bold text-indigo-400 font-mono tabular-nums">
                      {u.sparks} Sparks
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. FRIEND DUELS TAB */}
      {activeTab === 'duel' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Challenge a Friend to a 3-Question Topic Blitz Duel
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Both of you receive the same 3 technical placement questions. Whoever finishes with higher accuracy and fastest time wins +60 Sparks!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-10 h-10 rounded-full bg-slate-800 object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{f.name}</div>
                    <div className="text-[11px] text-slate-400">Focus: {f.currentTopic}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleSendDuel(f.name)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Challenge Duel</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
