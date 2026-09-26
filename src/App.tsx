import React, { useState, useEffect } from 'react';
import { PageView, CompanionId, SkillNode, UserStats, StudentProfile } from './types';
import { COMPANIONS, INITIAL_ROADMAP_NODES } from './data/curriculum';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OrderedRoadmap } from './components/OrderedRoadmap';
import { FriendsQuest } from './components/FriendsQuest';
import { VisualizerLab } from './components/VisualizerLab';
import { SpeakingCoach } from './components/SpeakingCoach';
import { ResumeStudio } from './components/ResumeStudio';
import { OpportunitiesRadar } from './components/OpportunitiesRadar';
import { SelfAnalysisRadar } from './components/SelfAnalysisRadar';
import { DoubtSanctum } from './components/DoubtSanctum';
import { PlacementChatbot } from './components/PlacementChatbot';
import { LiveBackground, BackgroundTheme } from './components/LiveBackground';
import { StudyFlashcards } from './components/StudyFlashcards';
import { MockInterviewArena } from './components/MockInterviewArena';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [activeCompanionId, setActiveCompanionId] = useState<CompanionId>('dexter');

  // Live Running Background Theme State
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_bg_theme');
      if (saved && ['study-library', 'cyber-work', 'motivational-sunrise', 'midnight-rain'].includes(saved)) {
        return saved as BackgroundTheme;
      }
    }
    return 'study-library';
  });

  useEffect(() => {
    localStorage.setItem('pq_bg_theme', backgroundTheme);
  }, [backgroundTheme]);

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return {
      name: 'Arjun Sharma',
      rollNumber: '22BCS1084',
      college: 'National Institute of Technology',
      department: 'Computer Science and Engineering',
      degree: 'B.Tech CSE',
      graduationBatch: '2026',
      cgpa: '8.4',
      targetRole: 'SDE-1 / Product Engineer',
      targetPackage: '18 – 35 LPA',
      dreamCompanies: ['Google', 'Amazon', 'Atlassian', 'Razorpay'],
      placementStatus: 'Actively Preparing',
      avatarSeed: 'ArjunTech'
    };
  });

  useEffect(() => {
    localStorage.setItem('pq_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Persistent Sparks & Streak stats
  const [sparks, setSparks] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_sparks_v2');
      return saved ? parseInt(saved, 10) : 180;
    }
    return 180;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_streak_v2');
      return saved ? parseInt(saved, 10) : 4;
    }
    return 4;
  });

  const [speechesPracticed, setSpeechesPracticed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_speeches_v2');
      return saved ? parseInt(saved, 10) : 3;
    }
    return 3;
  });

  const [resumeAtsScore, setResumeAtsScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_ats_v2');
      return saved ? parseInt(saved, 10) : 84;
    }
    return 84;
  });

  // Ordered Roadmap nodes state with local storage
  const [nodes, setNodes] = useState<SkillNode[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pq_roadmap_nodes_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return INITIAL_ROADMAP_NODES;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pq_sparks_v2', sparks.toString());
  }, [sparks]);

  useEffect(() => {
    localStorage.setItem('pq_streak_v2', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('pq_speeches_v2', speechesPracticed.toString());
  }, [speechesPracticed]);

  useEffect(() => {
    localStorage.setItem('pq_ats_v2', resumeAtsScore.toString());
  }, [resumeAtsScore]);

  useEffect(() => {
    localStorage.setItem('pq_roadmap_nodes_v2', JSON.stringify(nodes));
  }, [nodes]);

  const handleAddSparks = (amount: number) => {
    setSparks((prev) => prev + amount);
  };

  const handleIncrementStreak = () => {
    setStreakDays((prev) => prev + 1);
  };

  // Phase 1: Mark topic study as completed
  const handleMarkLearned = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, isLearned: true } : n))
    );
  };

  // Phase 2: Passed assessment -> record score, grant points, and unlock Step N+1!
  const handlePassAssessment = (nodeId: string, score: number, sparksEarned: number) => {
    handleAddSparks(sparksEarned);
    setNodes((prev) => {
      const current = prev.find((n) => n.id === nodeId);
      const currentStep = current ? current.stepNumber : 1;
      const nextStep = currentStep + 1;

      return prev.map((n) => {
        if (n.id === nodeId) {
          return { ...n, isCompleted: true, masteryScore: score, isLearned: true };
        }
        if (n.stepNumber === nextStep) {
          return { ...n, isUnlocked: true }; // Unlock the next sequential step!
        }
        return n;
      });
    });
  };

  const companion = COMPANIONS[activeCompanionId] || COMPANIONS.dexter;

  const userStats: UserStats = {
    sparks,
    streakDays,
    lastActiveDate: new Date().toISOString(),
    unlockedNodesCount: nodes.filter((n) => n.isUnlocked).length,
    assessmentsPassed: nodes.filter((n) => n.isCompleted).length,
    speechesPracticed,
    resumeAtsScore,
    activeCompanion: activeCompanionId,
    languagePreference: 'English'
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Live Running Background Canvas & Motivational Layer */}
      <LiveBackground
        theme={backgroundTheme}
        onChangeTheme={(t) => setBackgroundTheme(t)}
      />

      {/* 3-Zone Clean Header */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        sparks={sparks}
        streakDays={streakDays}
        activeCompanionId={activeCompanionId}
        onSelectCompanion={(id) => setActiveCompanionId(id)}
        backgroundTheme={backgroundTheme}
        onChangeBackgroundTheme={(t) => setBackgroundTheme(t)}
      />

      {/* Main Page Area */}
      <main className="relative z-10 flex-1">
        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            companion={companion}
            stats={userStats}
            studentProfile={studentProfile}
            onUpdateProfile={(updated) => setStudentProfile(updated)}
            onAddSparks={handleAddSparks}
            onIncrementStreak={handleIncrementStreak}
          />
        )}

        {currentPage === 'roadmap' && (
          <OrderedRoadmap
            nodes={nodes}
            companion={companion}
            onMarkLearned={handleMarkLearned}
            onPassAssessment={handlePassAssessment}
            onNavigateVisualizer={() => {
              setCurrentPage('visualizers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'flashcards' && (
          <StudyFlashcards
            companion={companion}
            onAddSparks={handleAddSparks}
          />
        )}

        {currentPage === 'mock-interview' && (
          <MockInterviewArena
            companion={companion}
            studentProfile={studentProfile}
            onAddSparks={handleAddSparks}
          />
        )}

        {currentPage === 'friends' && <FriendsQuest />}

        {currentPage === 'visualizers' && <VisualizerLab />}

        {currentPage === 'speaking-coach' && (
          <SpeakingCoach
            companion={companion}
            onIncrementPracticeCount={() => setSpeechesPracticed((p) => p + 1)}
            onAddSparks={handleAddSparks}
          />
        )}

        {currentPage === 'resume-studio' && (
          <ResumeStudio
            onUpdateScore={(score) => setResumeAtsScore(score)}
            onAddSparks={handleAddSparks}
          />
        )}

        {currentPage === 'opportunities' && <OpportunitiesRadar />}

        {currentPage === 'self-analysis' && <SelfAnalysisRadar />}

        {currentPage === 'doubts' && <DoubtSanctum />}
      </main>

      {/* Floating AI Placement Chatbot */}
      <PlacementChatbot
        companion={companion}
        studentProfile={studentProfile}
        currentStepTitle={nodes.find((n) => n.isUnlocked && !n.isCompleted)?.title}
        onAddSparks={handleAddSparks}
      />

      {/* Clean Footer */}
      <footer className="relative z-10 mt-16 border-t border-slate-900 bg-slate-950/90 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">PlaceQuest</span>
            <span aria-hidden="true">·</span>
            <span>Ordered Placement Roadmap & Social Quest Hub</span>
          </div>
          <div className="text-slate-400">
            Learn first, pass assessment, unlock the next milestone.
          </div>
        </div>
      </footer>
    </div>
  );
}
