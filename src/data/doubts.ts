import { PlacementDoubt } from '../types';

export const CURATED_DOUBTS: PlacementDoubt[] = [
  {
    id: 'cgpa-dilemma',
    category: 'Academics & CGPA',
    question: 'Can I get a 15+ LPA product company offer with a 6.8 or 7.0 CGPA?',
    answerSummary: 'Yes! While mass recruiters (TCS/Infosys) and a few legacy banks enforce strict 7.5+ cutoffs, high-paying tech startups, mid-sized product companies, and off-campus FAANG care 90% about problem-solving and projects.',
    interviewReadyAnswer: 'CGPA serves primarily as an initial filtering threshold in on-campus eligibility lists. Once past the initial screening or through off-campus referrals, hiring managers evaluate technical rigor, system design awareness, and code cleanliness. Build 2 production-grade projects and maintain a 400+ LeetCode rating to dominate technical discussions.',
    eli5Answer: 'Think of CGPA like the cover of a book. Some strict libraries only put books with shiny covers on the front shelf. But readers (great tech startups) open the book to read your code. If your code is awesome, nobody cares if the cover had a tiny scratch!',
    memeAnswer: 'Recruiter: "Your CGPA is 6.9?" You: "Yes, but my Redis cache latency is 12ms and I inverted a binary tree before breakfast." Recruiter: "Welcome aboard, senior architect!"',
    actionItem: 'Target off-campus referral openings on LinkedIn & Wellfound where CGPA filters are rarely applied.'
  },
  {
    id: 'gap-year',
    category: 'Academics & CGPA',
    question: 'I have a 1-year gap in my degree or after graduation. Will I be blacklisted?',
    answerSummary: 'Not at all. Recruiters only worry about unaccounted time. If framed around deliberate upskilling, personal resilience, or health recovery, it becomes a strength.',
    interviewReadyAnswer: 'Own your narrative with 100% confidence. State: "During that period, I took intentional time to solidify my core computer science foundations, complete full-stack certifications, and build scalable systems. This disciplined preparation directly positioned me to deliver immediate value today."',
    eli5Answer: 'If a runner stops for a moment to tie their shoelaces and drink water so they can sprint faster, they don’t get disqualified. The gap was your pit-stop to prepare your car for the real race.',
    memeAnswer: 'It is not a "gap year". It is "12 months of headless single-threaded background optimization and runtime dependency updates".',
    actionItem: 'Prepare a crisp 30-second explanation that bridges from the reason straight into what you built or learned.'
  },
  {
    id: 'blank-mind-interview',
    category: 'Tech & DSA',
    question: 'What if an interviewer asks a coding question I have NEVER seen and my mind goes completely blank?',
    answerSummary: 'Do not panic or remain silent. Interviewers test your problem-solving trajectory, not your photographic memory.',
    interviewReadyAnswer: 'Start by clarifying requirements: "Let me restate the inputs, constraints, and expected output to ensure we are aligned." Walk through a small manual example on paper. Propose a brute force solution out loud first. State: "A brute force approach would be O(N^2) using nested loops. Can we optimize by sorting or caching lookups in O(N)?" Interviewers will almost always drop hints if you communicate your reasoning.',
    eli5Answer: 'When a detective arrives at a mystery house, they don’t instantly scream who the villain is. They look around, ask questions, and test small clues. Your interviewer wants to watch your detective process!',
    memeAnswer: 'Rule #1: Never stare at the whiteboard like it owes you money in silence for 5 minutes. Say: "Interesting constraints! Let us trace an edge case with array length 1..." and let the magic flow.',
    actionItem: 'Practice the "Brute Force First -> Analyze Bottleneck -> Optimize" verbal sequence on 3 random problems.'
  },
  {
    id: 'non-native-english',
    category: 'HR & Behavioral',
    question: 'My English is not fluent and I hesitate while speaking. Will I fail the HR rounds?',
    answerSummary: 'Tech interviews are NOT a vocabulary test. Clarity, calm pacing, and structured thinking beat fancy English every single day.',
    interviewReadyAnswer: 'Global tech companies hire engineers across 80+ nations. What matters is unambiguous technical communication. Speak slightly slower (120-130 words per minute), pause for 1 second instead of saying "ummm", and structure answers using the STAR method (Situation, Task, Action, Result).',
    eli5Answer: 'When you order ice cream, you don’t need Shakespeare poetry. You just say clearly: "One chocolate cone, please." In interviews, clear simple words are the best ice cream.',
    memeAnswer: 'You do not need to speak like Victorian royalty. Just say: "I built this API, handled 5,000 requests, and here is how I fixed the bug." Boom, offer letter in email.',
    actionItem: 'Use our AI Virtual Speaking Coach in the Speaking tab for 5 minutes daily to track filler words.'
  },
  {
    id: 'reverse-questions',
    category: 'HR & Behavioral',
    question: 'When the interviewer asks: "Do you have any questions for me?", what should I say?',
    answerSummary: 'Never say "No, I have no questions." Asking intelligent questions shows curiosity, high agency, and cultural fit.',
    interviewReadyAnswer: 'Ask 1 technical culture question and 1 personal insight question: 1) "What is the biggest engineering challenge your team tackled in the last quarter?" 2) "If I join this team, what would success look like in the first 90 days?"',
    eli5Answer: 'Imagine someone inviting you to their cool treehouse. If you look at nothing and say nothing, they think you are bored. If you ask: "How did you build that secret trapdoor?", they will smile and love you.',
    memeAnswer: 'Bad: "What is your lunch menu?" Good: "How do you handle production deployments on Friday afternoons without sweating?"',
    actionItem: 'Save 2 signature reverse-questions on your phone notes before every interview round.'
  },
  {
    id: 'projects-vs-dsa',
    category: 'Preparation Strategy',
    question: 'Is DSA alone enough to crack placements, or are heavy projects mandatory?',
    answerSummary: 'DSA gets you past the online assessment test (OA). Projects make interviewers respect you and seal the final round offer.',
    interviewReadyAnswer: 'The placement pipeline has two distinct filters: 1) Automated Coding Tests (100% DSA/Aptitude) where resumes are not even looked at. 2) Tech Interview Rounds (50% DSA, 50% Project Deep Dive). If your project is a generic YouTube clone, senior engineers get bored. If you built a project with caching, auth, and measurable performance, you stand out among 500 applicants.',
    eli5Answer: 'DSA is your passport to enter the amusement park. Your projects are the games you actually play and win prizes with. You need both to have a great time!',
    memeAnswer: 'Average student: "I made a Netflix clone." Chad applicant: "I engineered a distributed queue with WebSockets, rate limiting, and zero memory leaks." Offer letter dispatched.',
    actionItem: 'Upgrade at least one project by adding Redis caching, Docker containerization, or live deployment.'
  }
];
