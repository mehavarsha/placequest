import React, { useState } from 'react';
import { Companion } from '../types';
import { speakText } from '../utils/speech';
import { Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';

interface CompanionAvatarProps {
  companion: Companion;
  customTip?: string;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({ companion, customTip }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeMessage = customTip || companion.welcomeMessage;

  const handleSpeak = () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakText(activeMessage, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="relative group flex items-start sm:items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-800 shadow-xl backdrop-blur-md">
      {/* Avatar Image with interactive soundwave ring */}
      <div className="relative shrink-0">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all ${
          isSpeaking ? 'border-indigo-400 ring-4 ring-indigo-500/30 scale-105' : 'border-slate-700'
        }`}>
          <img
            src={companion.avatar}
            alt={companion.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
          </span>
        )}
      </div>

      {/* Companion Message Dialogue */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              {companion.name}
            </span>
            <span className="text-xs text-indigo-400 hidden sm:inline">
              · {companion.role}
            </span>
          </div>

          <button
            onClick={handleSpeak}
            title={isSpeaking ? 'Stop speaking' : 'Read aloud with voice'}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-900/60 text-slate-300 hover:text-indigo-300 border border-slate-700/60 transition cursor-pointer text-xs flex items-center gap-1"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] text-rose-300 hidden sm:inline">Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] hidden sm:inline">Listen</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
          "{activeMessage}"
        </p>
      </div>
    </div>
  );
};
