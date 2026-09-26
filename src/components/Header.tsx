import React, { useState } from 'react';
import { PageView, CompanionId } from '../types';
import { COMPANIONS } from '../data/curriculum';
import { studyAudio } from '../utils/audio';
import { BackgroundTheme } from './LiveBackground';
import { Flame, Zap, Volume2, VolumeX, Sparkles, ChevronDown, Compass, Terminal, Sun, Moon, Palette } from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  sparks: number;
  streakDays: number;
  activeCompanionId: CompanionId;
  onSelectCompanion: (id: CompanionId) => void;
  backgroundTheme: BackgroundTheme;
  onChangeBackgroundTheme: (theme: BackgroundTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  sparks,
  streakDays,
  activeCompanionId,
  onSelectCompanion,
  backgroundTheme,
  onChangeBackgroundTheme
}) => {
  const [audioMode, setAudioMode] = useState<'off' | 'rain' | 'lofi' | 'cafe'>('off');
  const [showAudioDropdown, setShowAudioDropdown] = useState(false);
  const [showCompanionDropdown, setShowCompanionDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const activeCompanion = COMPANIONS[activeCompanionId] || COMPANIONS.dexter;

  const handleAudioSelect = (mode: 'off' | 'rain' | 'lofi' | 'cafe') => {
    setAudioMode(mode);
    setShowAudioDropdown(false);
    if (mode === 'off') {
      studyAudio.stop();
    } else {
      studyAudio.play(mode);
    }
  };

  const navItems: { id: PageView; label: string }[] = [
    { id: 'dashboard', label: 'Quest HQ' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'mock-interview', label: 'Mock Trials' },
    { id: 'friends', label: 'Squad Quests' },
    { id: 'visualizers', label: 'Visualizers' },
    { id: 'speaking-coach', label: 'Voice Coach' },
    { id: 'resume-studio', label: 'Resume ATS' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'self-analysis', label: 'Readiness' },
    { id: 'doubts', label: 'Doubts' },
  ];

  const themeOptions: { id: BackgroundTheme; label: string; icon: any }[] = [
    { id: 'study-library', label: 'Campus Library', icon: Compass },
    { id: 'cyber-work', label: 'Silicon Valley Code', icon: Terminal },
    { id: 'motivational-sunrise', label: 'Golden Ambition', icon: Sun },
    { id: 'midnight-rain', label: 'Midnight Focus Rain', icon: Moon }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans'] group-hover:text-indigo-400 transition-colors">
            PlaceQuest
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Status Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Live Background Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              title="Live Background & Ambient Theme"
              className="p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline font-medium">Theme</span>
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in">
                <div className="px-2 py-1 text-slate-400 font-semibold border-b border-slate-800/80 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Live Ambient Themes</span>
                </div>
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = backgroundTheme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onChangeBackgroundTheme(opt.id);
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition ${
                        isSelected ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <span className="text-[10px] text-indigo-400 font-bold">● Active</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ambient Study Audio Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAudioDropdown(!showAudioDropdown)}
              title="Study Focus Soundscape"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                audioMode !== 'off'
                  ? 'bg-indigo-950/60 border-indigo-700/80 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {audioMode !== 'off' ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-indigo-400" />
                  <span className="hidden sm:inline capitalize font-medium">{audioMode}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Focus Audio</span>
                </>
              )}
            </button>

            {showAudioDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <div className="px-2 py-1 text-slate-400 font-medium border-b border-slate-800/80 mb-1">
                  Ambient Study Beats
                </div>
                <button
                  onClick={() => handleAudioSelect('rain')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                    audioMode === 'rain' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Gentle Raindrop</span>
                  {audioMode === 'rain' && <span className="text-[10px] text-indigo-400">● On</span>}
                </button>
                <button
                  onClick={() => handleAudioSelect('lofi')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                    audioMode === 'lofi' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Lofi Drone Pulse</span>
                  {audioMode === 'lofi' && <span className="text-[10px] text-indigo-400">● On</span>}
                </button>
                <button
                  onClick={() => handleAudioSelect('cafe')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                    audioMode === 'cafe' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Campus Cafe Hum</span>
                  {audioMode === 'cafe' && <span className="text-[10px] text-indigo-400">● On</span>}
                </button>
                <button
                  onClick={() => handleAudioSelect('off')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg mt-1 border-t border-slate-800/60 cursor-pointer ${
                    audioMode === 'off' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Mute Sound
                </button>
              </div>
            )}
          </div>

          {/* Daily Streak Flame */}
          <div
            title="Daily Consistency Streak"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-semibold tabular-nums"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Sparks (XP) Currency for Unlocking Topics */}
          <div
            title="Sparks Earned from Assessments"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs font-semibold tabular-nums"
          >
            <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>{sparks} Sparks</span>
          </div>

          {/* Companion Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowCompanionDropdown(!showCompanionDropdown)}
              className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <img
                src={activeCompanion.avatar}
                alt={activeCompanion.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {showCompanionDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1 text-slate-400 text-xs font-medium border-b border-slate-800/80 mb-1">
                  Choose Study Companion
                </div>
                {Object.values(COMPANIONS).map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onSelectCompanion(comp.id as CompanionId);
                      setShowCompanionDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition cursor-pointer ${
                      activeCompanionId === comp.id
                        ? 'bg-indigo-950/60 border border-indigo-700/50 text-white'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <img
                      src={comp.avatar}
                      alt={comp.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold">{comp.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{comp.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-2 px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
              currentPage === item.id
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
