import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key available
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize Google Gen AI:', err);
  }
}

// 1. Voice Interview / Speaking Coach Feedback Endpoint
app.post('/api/speech-feedback', async (req: Request, res: Response) => {
  try {
    const { question, answerText, targetRole, language = 'English' } = req.body;

    if (!answerText || answerText.trim().length === 0) {
      return res.status(400).json({ error: 'Answer transcript is required.' });
    }

    // Filler word detection
    const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'sort of', 'kind of', 'literally'];
    const lowerAns = answerText.toLowerCase();
    const detectedFillers: { word: string; count: number }[] = [];
    fillerWords.forEach(fw => {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi');
      const matches = lowerAns.match(regex);
      if (matches && matches.length > 0) {
        detectedFillers.push({ word: fw, count: matches.length });
      }
    });

    const totalWords = answerText.trim().split(/\s+/).length;
    const fillerCount = detectedFillers.reduce((acc, curr) => acc + curr.count, 0);
    const fillerRatio = totalWords > 0 ? (fillerCount / totalWords) * 100 : 0;

    let aiFeedback = {
      score: Math.max(50, Math.min(95, Math.round(92 - fillerRatio * 3))),
      structureEvaluation: 'Good start. Answers gain massive points when adhering to STAR (Situation, Task, Action, Result).',
      strengths: ['Clear enthusiasm and willingness to address the core prompt.', 'Good natural conversational flow.'],
      improvements: [
        'Quantify achievements (e.g., improved load speed by 35% or handled 500+ requests).',
        fillerRatio > 3 ? 'Reduce filler pauses like "' + (detectedFillers[0]?.word || 'um') + '" by taking a silent 1-second breath.' : 'Maintain a crisp 90-120 second pace.'
      ],
      sampleIdealResponse: `In my previous project, we faced a tight deadline to deliver a real-time tracking feature (Situation & Task). I spearheaded the WebSocket pipeline refactor and added caching (Action). As a result, latency dropped by 42% and we shipped ahead of schedule (Result).`,
      fillerAnalysis: {
        totalWords,
        fillerCount,
        fillers: detectedFillers
      }
    };

    if (genAI) {
      try {
        const prompt = `You are Nova, an elite placement HR and behavioral interview coach at top tech companies.
The candidate was asked: "${question}"
Candidate applied for: "${targetRole || 'Software Development Engineer'}"
Candidate spoken response (language preference: ${language}): "${answerText}"

Provide concise JSON with format:
{
  "score": number (0-100),
  "structureEvaluation": "1-2 sentence critique on STAR structure and executive presence",
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "sampleIdealResponse": "A crisp, high-impact 3-sentence STAR response model"
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          aiFeedback = {
            ...aiFeedback,
            ...parsed,
            fillerAnalysis: {
              totalWords,
              fillerCount,
              fillers: detectedFillers
            }
          };
        }
      } catch (e) {
        console.warn('Gemini API call failed, using heuristic feedback:', e);
      }
    }

    return res.json(aiFeedback);
  } catch (err: any) {
    console.error('Speech feedback error:', err);
    return res.status(500).json({ error: 'Failed to process speech feedback' });
  }
});

// 2. Resume ATS & Gap Analyzer Endpoint
app.post('/api/resume-analyze', async (req: Request, res: Response) => {
  try {
    const { resumeData, targetRole = 'Software Development Engineer' } = req.body;

    const keywordsByRole: Record<string, string[]> = {
      'Software Development Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'REST APIs', 'Unit Testing', 'CI/CD', 'Scalability', 'Database optimization'],
      'Frontend Engineer': ['React', 'TypeScript', 'Tailwind CSS', 'State Management', 'Web Performance', 'Accessibility', 'Vite', 'Responsive Design', 'Next.js'],
      'Backend Engineer': ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Microservices', 'Redis', 'Authentication/OAuth', 'API Design', 'Cloud/AWS'],
      'Data Analyst / ML': ['Python', 'SQL', 'Pandas', 'Tableau', 'PowerBI', 'Machine Learning', 'Statistical Modeling', 'Data Cleaning', 'A/B Testing']
    };

    const targetKeywords = keywordsByRole[targetRole] || keywordsByRole['Software Development Engineer'];
    const resumeText = JSON.stringify(resumeData).toLowerCase();

    const matchedKeywords = targetKeywords.filter(k => resumeText.includes(k.toLowerCase()));
    const missingKeywords = targetKeywords.filter(k => !resumeText.includes(k.toLowerCase()));

    const atsScore = Math.min(96, Math.max(48, Math.round((matchedKeywords.length / targetKeywords.length) * 45 + 50)));

    let analysis = {
      atsScore,
      targetRole,
      matchedKeywords,
      missingKeywords,
      summary: `Your profile has a solid foundation for ${targetRole} roles with strong technical presence. Incorporating ${missingKeywords.slice(0, 3).join(', ')} will significantly boost recruiter shortlist rates.`,
      bulletEnhancements: [
        {
          original: 'Built a web application with React and Node.js for users to buy products.',
          enhanced: 'Architected full-stack e-commerce platform using React, Node.js, and Redis caching; boosted checkout throughput by 38% and supported 2,500+ active sessions.'
        },
        {
          original: 'Worked on database queries and fixed bugs.',
          enhanced: 'Optimized relational schema and indexed heavy SQL queries, slashing average database query latency from 850ms to 95ms.'
        }
      ],
      strengths: [
        'Clean section layout suitable for ATS parsers (standard single-column flow).',
        'Includes verifiable skills aligned with current industry hiring bars.'
      ],
      quickFixes: [
        'Add quantitative metrics (% improvements, latency reductions, user count) to every bullet.',
        `Include keywords: ${missingKeywords.slice(0, 4).join(', ')} in your Skills or Experience section.`
      ]
    };

    if (genAI) {
      try {
        const prompt = `You are an executive Technical Recruiter and ATS algorithm auditor.
Analyze this student's resume data for the role of "${targetRole}":
Resume content: ${JSON.stringify(resumeData)}

Provide JSON response:
{
  "atsScore": number (0-100),
  "summary": "1-2 sentence executive appraisal",
  "matchedKeywords": ["found keyword 1", ...],
  "missingKeywords": ["recommended missing keyword 1", ...],
  "bulletEnhancements": [
    {"original": "weak bullet from or similar to resume", "enhanced": "X-Y-Z formula bullet with strong action verb and metric"}
  ],
  "strengths": ["strength 1", "strength 2"],
  "quickFixes": ["quick actionable fix 1", "quick actionable fix 2"]
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          analysis = { ...analysis, ...parsed };
        }
      } catch (e) {
        console.warn('Gemini resume audit error, using fallback analysis:', e);
      }
    }

    return res.json(analysis);
  } catch (err: any) {
    console.error('Resume audit error:', err);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// 3. Doubt Solver ("Solve all necessary and unnecessary doubts")
app.post('/api/doubt-solver', async (req: Request, res: Response) => {
  try {
    const { question, mode = 'interview_ready', tone = 'friendly' } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Doubt query is required.' });
    }

    let answer = {
      title: 'Placement Insight',
      explanation: `Great question! In campus and off-campus placements, recruiters look for core fundamentals, problem-solving mindset, and authenticity. Keep your basics clear and communicate your thought process step by step.`,
      keyTakeaways: [
        'Focus on understanding time/space trade-offs over memorizing syntax.',
        'Always ask clarifying questions before jumping into code during interviews.',
        'Consistency and daily 1-hour problem solving beats cramming 10 hours on weekends.'
      ],
      actionStep: 'Try solving 1 problem from our Skill Tree today to solidify this concept!',
      modeUsed: mode
    };

    if (genAI) {
      try {
        let stylePrompt = '';
        if (mode === 'humor_meme') {
          stylePrompt = 'Use witty, funny, relatable college-student humor with tech metaphors without being cynical. Keep it uplifting and hilarious!';
        } else if (mode === 'simple_eli5') {
          stylePrompt = 'Explain like I am a 10-year-old or beginner with zero jargon, using everyday analogies (like pizza, queues at a canteen, gaming).';
        } else {
          stylePrompt = 'Explain with direct, high-value, crisp interview-room precision that impresses hiring managers.';
        }

        const prompt = `You are Dexter and Nova, the master placement mentors.
Student has this placement question / doubt: "${question}"
Explanation style mode: ${mode} (${stylePrompt})

Provide JSON response:
{
  "title": "Snappy title for this explanation",
  "explanation": "Clear, engaging, easy-to-understand explanation (2-4 paragraphs or formatted bullet insights)",
  "keyTakeaways": ["Golden rule 1", "Golden rule 2", "Golden rule 3"],
  "actionStep": "One tangible thing the student can do right now in 5 minutes"
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          answer = { ...answer, ...parsed };
        }
      } catch (e) {
        console.warn('Gemini doubt solver fallback:', e);
      }
    }

    return res.json(answer);
  } catch (err: any) {
    console.error('Doubt solver error:', err);
    return res.status(500).json({ error: 'Failed to solve doubt' });
  }
});

// 4. Interactive AI Placement Chatbot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, companionName = 'Dexter', studentProfile } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const latestMessage = messages[messages.length - 1].content;

    let botReply = `Hello! I am your placement mentor. In tech interviews, focus on clean communication, understanding constraints before coding, and breaking problems down. How can I help you today?`;

    // Smart heuristic responses if Gemini API key is not present or on fallback
    const lower = latestMessage.toLowerCase();
    if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('tree') || lower.includes('dp')) {
      botReply = `Great question on problem-solving! When tackling this:
1. Always state the brute-force approach first (e.g., nested loops in O(N²)).
2. Identify the bottleneck (redundant recalculation, unsorted order, or linear scans).
3. Propose the optimal pattern: Two Pointers if sorted, Hashing if looking for complements, or Monotonic Stack for next-greater queries.
What specific testcase or constraints are you dealing with?`;
    } else if (lower.includes('hr') || lower.includes('tell me about yourself') || lower.includes('behavioral')) {
      botReply = `For behavioral & HR rounds, structure is king:
• Use the STAR method: Situation (15s), Task (15s), Action (60s with specific technical choices), and Result (30s with quantified metrics like % latency drop).
• When answering 'Tell me about yourself', follow Past (milestones) → Present (core skills) → Future (why this team).
Would you like to simulate an HR question right now?`;
    } else if (lower.includes('cgpa') || lower.includes('gap') || lower.includes('reject')) {
      botReply = `Don't let CGPA or gaps intimidate you!
• Top product startups (Razorpay, Swiggy, Zepto) and off-campus FAANG referrals prioritize 90% problem-solving rigor and production projects.
• Frame any gap year around intentional upskilling and tangible systems built.
Stay consistent with your daily Roadmap steps!`;
    } else if (lower.includes('resume') || lower.includes('ats')) {
      botReply = `For maximum ATS pass rates:
• Use a single-column layout with standard headings: Education, Skills, Experience, Projects.
• Formula for every bullet: Accomplished [X], as measured by [Y], by doing [Z].
• Ensure target keywords (e.g., REST APIs, Redis, Docker, System Design) match the job description.`;
    }

    if (genAI) {
      try {
        const studentContext = studentProfile ? `Student: ${studentProfile.name}, College: ${studentProfile.college}, Target: ${studentProfile.targetRole} (${studentProfile.targetPackage}), CGPA: ${studentProfile.cgpa}` : 'Undergraduate Computer Science student preparing for campus placements';

        const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? 'Student' : companionName}: ${m.content}`).join('\n');

        const prompt = `You are ${companionName}, an encouraging, highly knowledgeable senior software engineer and placement coach at a top tech company.
Context about the student: ${studentContext}
Conversation so far:
${conversationHistory}

Reply in 2-3 concise, high-impact paragraphs. Be warm, uplifting, direct, and actionable. Avoid generic fluff. Include concrete code tips, formula guidance, or interview strategy where appropriate:`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        if (response.text) {
          botReply = response.text.trim();
        }
      } catch (e) {
        console.warn('Gemini chat fallback used:', e);
      }
    }

    return res.json({ reply: botReply });
  } catch (err: any) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// 5. Generate Flashcards with Hints from Notes or File Text
app.post('/api/generate-flashcards', async (req: Request, res: Response) => {
  try {
    const { rawNotes, fileName } = req.body;
    if (!rawNotes || typeof rawNotes !== 'string' || !rawNotes.trim()) {
      return res.status(400).json({ error: 'Notes or file content is required.' });
    }

    let flashcards = [
      {
        id: `fc-${Date.now()}-1`,
        front: 'What is the primary trade-off and invariant in Two-Pointer array search?',
        back: 'The array must be sorted. The left pointer increases sum, while right pointer decreases it, giving O(N) linear convergence with O(1) space.',
        hint: 'Remember: Inward convergence requires sorted monotonicity.',
        category: 'DSA Foundations',
        difficulty: 'Medium',
        keyRule: 'Always verify sorted order before picking Two Pointers over HashMap.'
      },
      {
        id: `fc-${Date.now()}-2`,
        front: 'Why does 0/1 Knapsack require reverse loop iteration in 1D array space compression?',
        back: 'Iterating capacity W backwards ensures we never reuse the current item multiple times, keeping state dependent strictly on the previous items.',
        hint: 'Reverse loop = single-use items. Forward loop = unbounded items.',
        category: 'Dynamic Programming',
        difficulty: 'Hard',
        keyRule: 'Backward loop preserves dp[w - weight] from step i - 1.'
      },
      {
        id: `fc-${Date.now()}-3`,
        front: 'How does Redis Cache-Aside handle cache stampede during sudden spikes?',
        back: 'When a hot key expires, thousands of threads might hit the primary DB. Mitigate with Mutex locks or probabilistic early background cache re-computation.',
        hint: 'Lock the refresh or refresh before expiry to shield SQL.',
        category: 'System Design',
        difficulty: 'Medium',
        keyRule: 'Never let expired hot keys cascade directly to the main database.'
      }
    ];

    if (genAI) {
      try {
        const prompt = `You are a master technical educator for placement candidates.
Analyze the following student study notes / uploaded file text (Source: ${fileName || 'Uploaded Notes'}):

"""
${rawNotes.slice(0, 5000)}
"""

Extract 4 to 6 bite-sized, high-retention interview flashcards. Each flashcard MUST have:
1. "front": Clear, focused question or core concept
2. "back": Concise 1-2 sentence intuition and crystal clear explanation
3. "hint": A memorable mnemonic, quick rule-of-thumb, or practical memory anchor to make it easy to learn
4. "category": Topic area (e.g., DSA, OS/DBMS, System Design, HR)
5. "difficulty": "Easy", "Medium", or "Hard"
6. "keyRule": 1 key takeaway rule to remember in viva/interviews

Output strictly JSON formatted array:
[
  {
    "front": "string",
    "back": "string",
    "hint": "string",
    "category": "string",
    "difficulty": "Easy" | "Medium" | "Hard",
    "keyRule": "string"
  }
]`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            flashcards = parsed.map((item: any, idx: number) => ({
              id: `fc-ai-${Date.now()}-${idx}`,
              front: item.front || 'Core Concept',
              back: item.back || 'Explanation',
              hint: item.hint || 'Remember key constraint',
              category: item.category || 'General CS',
              difficulty: item.difficulty || 'Medium',
              keyRule: item.keyRule || 'Practice testcases first.'
            }));
          }
        }
      } catch (aiErr) {
        console.warn('Gemini flashcard generation fallback:', aiErr);
      }
    }

    return res.json({ flashcards });
  } catch (error: any) {
    console.error('Flashcard error:', error);
    return res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

// 6. Interactive Mock Interview Round Evaluation
app.post('/api/mock-interview-eval', async (req: Request, res: Response) => {
  try {
    const { question, candidateAnswer, roundType, companyTarget } = req.body;

    let evalResult = {
      score: 82,
      decision: 'Hire - Strong Candidate',
      breakdown: {
        problemDecomposition: 85,
        communicationStructure: 80,
        edgeCaseAwareness: 82
      },
      interviewerVerdict: 'Solid grasp of core requirements with structured thinking. Good pace and clear defense of time complexity.',
      strengths: ['Identified the core invariant quickly', 'Communicated constraints upfront before writing solution'],
      improvements: ['State space complexity explicitly without waiting for interviewer prompt', 'Double-check single-element array boundary conditions'],
      followUpQuestion: 'How would your approach change if the data stream was 100x larger than available memory?'
    };

    if (genAI && candidateAnswer) {
      try {
        const prompt = `You are a Principal Engineering Bar Raiser conducting a placement mock interview for ${companyTarget || 'Top Tech Tier 1 Company'}.
Round: ${roundType || 'Coding & System Design'}
Question: "${question}"
Candidate Transcript / Answer:
"${candidateAnswer}"

Evaluate strictly as an interviewer. Respond with JSON:
{
  "score": number (0-100),
  "decision": "Strong Hire" | "Hire - Strong Candidate" | "Leaning Hire" | "Needs Improvement",
  "breakdown": {
    "problemDecomposition": number (0-100),
    "communicationStructure": number (0-100),
    "edgeCaseAwareness": number (0-100)
  },
  "interviewerVerdict": "1-2 sentence executive verdict from the interviewer",
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "followUpQuestion": "A sharp, probing follow-up question the interviewer would ask next"
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          evalResult = { ...evalResult, ...parsed };
        }
      } catch (err) {
        console.warn('Mock eval fallback used:', err);
      }
    }

    return res.json(evalResult);
  } catch (error: any) {
    console.error('Mock interview eval error:', error);
    return res.status(500).json({ error: 'Failed to evaluate mock session' });
  }
});

// Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
