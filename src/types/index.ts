export type PageView = 
  | 'dashboard'
  | 'roadmap'
  | 'flashcards'
  | 'mock-interview'
  | 'friends'
  | 'visualizers'
  | 'speaking-coach'
  | 'resume-studio'
  | 'opportunities'
  | 'self-analysis'
  | 'doubts';

export type CompanionId = 'dexter' | 'nova' | 'aria';

export interface Flashcard {
  id: string;
  front: string; // Question or Core Concept
  back: string; // Intuition, Explanation & Solution
  hint: string; // Quick Memory Anchor / Mnemonic
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  codeSnippet?: string;
  keyRule?: string;
  isMastered?: boolean;
}

export interface MockInterviewQuestion {
  id: string;
  round: 'Coding (DSA)' | 'System Design' | 'HR & Behavioral';
  question: string;
  context: string;
  expectedKeyPoints: string[];
  interviewerPersona: string;
  rubric: {
    clarity: number;
    depth: number;
    structure: number;
  };
}

export interface Companion {
  id: CompanionId;
  name: string;
  role: string;
  avatar: string;
  personality: string;
  welcomeMessage: string;
  cheerMessage: string;
}

export interface LessonSection {
  title: string;
  body: string;
  codeSnippet?: string;
  keyRule: string;
}

export interface SkillNode {
  id: string;
  stepNumber: number; // Order-by-order sequence: 1, 2, 3...
  title: string;
  category: 'Foundations' | 'Linear DSA' | 'Hierarchical' | 'Advanced Algorithms' | 'System Design' | 'Interview Trials';
  isUnlocked: boolean; // unlocked in strict order
  isLearned: boolean; // learned the study guide first
  isCompleted: boolean; // completed assessment with passing score
  masteryScore: number; // 0 - 100
  summary: string;
  keyConcepts: string[];
  interviewWeight: 'High' | 'Very High' | 'Crucial';
  lesson: {
    overview: string;
    sections: LessonSection[];
    visualDiagram?: string;
    cheatSheet: string[];
  };
  assessmentQuestions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
}

export interface CharacterLevel {
  level: number;
  title: string;
  minSparks: number;
  nextLevelSparks: number;
  badgeName: string;
  auraColor: string;
  perks: string[];
  gearName: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FriendUser {
  id: string;
  name: string;
  college: string;
  avatar: string;
  streak: number;
  sparks: number;
  completedTopicsCount: number;
  currentTopic: string;
  status: 'Studying' | 'In Assessment' | 'Online';
  isNudged?: boolean;
}

export interface SquadQuest {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  unit: string;
  rewardSparks: number;
  completed: boolean;
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  college: string;
  department: string;
  degree: string;
  graduationBatch: string;
  cgpa: string;
  targetRole: string;
  targetPackage: string;
  dreamCompanies: string[];
  placementStatus: 'Actively Preparing' | 'Appearing for Drives' | 'Shortlisted' | 'Placed';
  avatarSeed: string;
}

export interface UserStats {
  sparks: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedNodesCount: number;
  assessmentsPassed: number;
  speechesPracticed: number;
  resumeAtsScore: number;
  activeCompanion: CompanionId;
  languagePreference: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: {
    institution: string;
    degree: string;
    cgpa: string;
    graduationYear: string;
  };
  skills: {
    languages: string;
    frameworks: string;
    databases: string;
    tools: string;
  };
  experience: {
    title: string;
    company: string;
    period: string;
    bullet1: string;
    bullet2: string;
  }[];
  projects: {
    title: string;
    techStack: string;
    link: string;
    bullet1: string;
    bullet2: string;
  }[];
}

export interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship' | '6M Internship + PPO';
  stipendOrCtc: string;
  eligibilityBatch: string[];
  minCgpa: number;
  difficulty: 'Standard' | 'Elevated' | 'Dream';
  deadline: string;
  tags: string[];
  hiringRounds: string[];
  frequentlyAsked: string[];
  applicationStatus: 'Explore' | 'Bookmarked' | 'Applied' | 'Interviewing' | 'Selected';
}

export interface PlacementDoubt {
  id: string;
  category: 'Academics & CGPA' | 'Tech & DSA' | 'HR & Behavioral' | 'Preparation Strategy';
  question: string;
  answerSummary: string;
  interviewReadyAnswer: string;
  eli5Answer: string;
  memeAnswer: string;
  actionItem: string;
}
