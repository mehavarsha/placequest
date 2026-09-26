import { JobOpportunity } from '../types';

export const INITIAL_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'google-swe-intern',
    company: 'Google',
    role: 'Software Engineering Intern',
    location: 'Bangalore / Hyderabad / Hybrid',
    type: 'Internship',
    stipendOrCtc: '₹1,20,000 / month',
    eligibilityBatch: ['2026', '2027'],
    minCgpa: 7.0,
    difficulty: 'Dream',
    deadline: 'Rolling (Active Window)',
    tags: ['DSA Heavy', 'Graph Algorithms', 'Trees', 'Problem Solving'],
    hiringRounds: [
      'Round 1: Online Assessment (2 algorithmic challenges on Google Hire portal, 60 mins)',
      'Round 2: Technical Interview (Live Google Docs coding: DSA, DP, Graphs, 45 mins)',
      'Round 3: Second Technical Interview (Data structures, edge case robustness, 45 mins)',
      'Round 4: Project & Host Matching phase'
    ],
    frequentlyAsked: [
      'Trapping Rain Water with modified terrain elevations',
      'Shortest Path in a grid with K obstacle eliminations',
      'Serialize and Deserialize Binary Tree'
    ],
    applicationStatus: 'Explore'
  },
  {
    id: 'amazon-sde',
    company: 'Amazon',
    role: 'SDE-1 (Full-Time & 6M Intern)',
    location: 'Bangalore / Chennai / Gurgaon',
    type: '6M Internship + PPO',
    stipendOrCtc: '₹80,000 / mo (Intern) → ₹32 - 44 LPA CTC',
    eligibilityBatch: ['2025', '2026'],
    minCgpa: 6.5,
    difficulty: 'Dream',
    deadline: 'Next 14 Days',
    tags: ['Trees', 'Graphs', 'Amazon LP', 'OOD'],
    hiringRounds: [
      'Round 1: Online Assessment (Coding + Work Style Assessment / Leadership simulation)',
      'Round 2: Technical Round 1 (Data Structures: Binary Trees, Heaps, Hashmaps)',
      'Round 3: Technical Round 2 (Object Oriented Design / Low-Level Design + DSA)',
      'Round 4: Bar Raiser (Deep dive into Amazon Leadership Principles + System scalability)'
    ],
    frequentlyAsked: [
      'Word Ladder (BFS shortest path)',
      'Design an In-Memory File System or LRU Cache',
      'Tell me about a time you had a conflicting opinion with a teammate.'
    ],
    applicationStatus: 'Explore'
  },
  {
    id: 'razorpay-swe',
    company: 'Razorpay',
    role: 'Backend Product Engineer Intern',
    location: 'Bangalore (On-site)',
    type: 'Internship',
    stipendOrCtc: '₹65,000 / month',
    eligibilityBatch: ['2025', '2026'],
    minCgpa: 7.0,
    difficulty: 'Elevated',
    deadline: 'Active for 7 Days',
    tags: ['Go / Node', 'Postgres', 'Concurrency', 'APIs'],
    hiringRounds: [
      'Round 1: Machine Coding Challenge (Build an in-memory queue or rate limiter in 90 mins)',
      'Round 2: Code Review & System Extensibility Discussion (45 mins)',
      'Round 3: Tech Leadership & Cultural Alignment (30 mins)'
    ],
    frequentlyAsked: [
      'Design a Token Bucket Rate Limiter with Redis',
      'How to handle idempotency in payment transactions',
      'Explain ACID vs Eventual Consistency in microservices'
    ],
    applicationStatus: 'Explore'
  },
  {
    id: 'atlassian-swe',
    company: 'Atlassian',
    role: 'Graduate Software Engineer',
    location: 'Remote / Work from Anywhere (India)',
    type: 'Full-time',
    stipendOrCtc: '₹55 LPA CTC (Base + Stocks)',
    eligibilityBatch: ['2025'],
    minCgpa: 7.5,
    difficulty: 'Dream',
    deadline: 'Rolling',
    tags: ['DSA', 'System Design', 'Values Round', 'Clean Code'],
    hiringRounds: [
      'Round 1: HackerRank OA (3 medium-hard problems in 90 mins)',
      'Round 2: Data Structures & Algorithms pairing session (60 mins)',
      'Round 3: System Design / Problem Crafting (60 mins)',
      'Round 4: Values & Cultural Fit interview (Atlassian 5 Core Values)'
    ],
    frequentlyAsked: [
      'File System Directory Traversal and Tagging with Trie',
      'Snake and Ladder Game simulation with optimal dice moves',
      'Open Company, No Bullshit: Tell me about a time you gave critical feedback.'
    ],
    applicationStatus: 'Explore'
  },
  {
    id: 'tcs-digital',
    company: 'TCS (Tata Consultancy Services)',
    role: 'Digital Software Engineer',
    location: 'Pan India (Multiple Centers)',
    type: 'Full-time',
    stipendOrCtc: '₹7.5 - 9.2 LPA CTC',
    eligibilityBatch: ['2025', '2026'],
    minCgpa: 6.0,
    difficulty: 'Standard',
    deadline: 'Drive Active',
    tags: ['Aptitude', 'Core CS', 'Python/Java', 'DBMS'],
    hiringRounds: [
      'Round 1: TCS NQT (National Qualifier Test: Advanced Quant, Verbal, Coding 2 problems)',
      'Round 2: Combined Technical + Managerial + HR interview (30-40 mins)'
    ],
    frequentlyAsked: [
      'Reverse words in a given string without extra space',
      'Explain normal forms (1NF, 2NF, 3NF, BCNF) with real student table examples',
      'Differentiate between Process and Thread, and deadlock prevention.'
    ],
    applicationStatus: 'Explore'
  }
];
