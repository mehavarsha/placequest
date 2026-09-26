import React, { useState, useRef, useEffect } from 'react';
import { Companion, StudentProfile, ChatMessage } from '../types';
import { speakText } from '../utils/speech';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Copy,
  Check
} from 'lucide-react';

interface PlacementChatbotProps {
  companion: Companion;
  studentProfile: StudentProfile;
  currentStepTitle?: string;
  onAddSparks?: (amount: number) => void;
}

export const PlacementChatbot: React.FC<PlacementChatbotProps> = ({
  companion,
  studentProfile,
  currentStepTitle = 'Two Pointers & Sliding Window',
  onAddSparks
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-0',
        role: 'assistant',
        content: `Hi ${studentProfile.name.split(' ')[0]}! I'm ${companion.name}, your placement mentor. We're currently tackling "${currentStepTitle}". Ask me any coding doubt, mock interview question, or placement dilemma!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const quickPrompts = [
    'How do I explain an unexpected bug in STAR format?',
    'What is the difference between Two Pointers and Sliding Window?',
    'Will a 6.8 CGPA block me from 20+ LPA startups?',
    'Ask me a high-frequency mock interview question'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          companionName: companion.name,
          studentProfile
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
        onAddSparks?.(10); // Reward active learning sparks
      } else {
        throw new Error('Chat failed');
      }
    } catch (e) {
      // Local fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Great question! In campus placements, clarity and foundational reasoning beat memorization every time. Break the problem into constraints, propose a brute force approach first, and then optimize. What specific part can we dive into?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared! Ready for your next placement question. What would you like to prepare?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible bottom-right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-2xl shadow-indigo-500/40 border border-indigo-400/40 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="relative">
            <img
              src={companion.avatar}
              alt={companion.name}
              className="w-7 h-7 rounded-full object-cover border border-white/40"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
          </div>
          <span>Chat with {companion.name}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={companion.avatar}
                  alt={companion.name}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-500/60"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{companion.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-medium">
                    AI Mentor
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Targeting {studentProfile.targetRole}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {m.content}
                      </div>

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                        <span>{m.timestamp}</span>
                        {!isUser && (
                          <>
                            <button
                              onClick={() => handleSpeak(m.content)}
                              className="hover:text-indigo-400 transition cursor-pointer"
                              title="Read aloud"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              className="hover:text-indigo-400 transition cursor-pointer"
                              title="Copy answer"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 max-w-[80%] text-slate-400 text-xs animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>{companion.name} is writing guidance...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              {messages.length < 4 && (
                <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto">
                  {quickPrompts.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Ask ${companion.name} anything...`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  disabled={!inputMessage.trim() || isLoading}
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
