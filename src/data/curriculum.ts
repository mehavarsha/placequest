import { SkillNode, Companion, FriendUser, SquadQuest } from '../types';
import { ASSETS } from './assets';

export const COMPANIONS: Record<string, Companion> = {
  dexter: {
    id: 'dexter',
    name: 'Dexter',
    role: 'Tech & Architecture Alchemist',
    avatar: ASSETS.avatarDexter,
    personality: 'Sharp, analytical, and obsessed with O(1) space optimizations.',
    welcomeMessage: 'Welcome to your structured placement roadmap! Follow the steps in exact order: Learn the core intuition first, then take the test assessment to unlock the next milestone!',
    cheerMessage: 'Flawless execution! You mastered this topic and cleared the assessment. The next roadmap milestone is now unlocked!'
  },
  nova: {
    id: 'nova',
    name: 'Nova',
    role: 'HR & Communication Coach',
    avatar: ASSETS.avatarNova,
    personality: 'Empathetic, articulate, and master of the STAR interview framework.',
    welcomeMessage: 'Consistency is everything. Complete your daily study step, challenge your friends in your Squad Quest, and build unstoppable interview confidence!',
    cheerMessage: 'Outstanding clarity and precision! You scored high on this assessment. Onwards to the next challenge!'
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    role: 'Aptitude & Logic Prodigy',
    avatar: ASSETS.avatarAria,
    personality: 'Playful, energetic, and turns daunting algorithms into fun step-by-step games.',
    welcomeMessage: 'No more confusing or messy preparation! Step 1 leads to Step 2, each locked until you master the previous one. Let’s do this together!',
    cheerMessage: 'Incredible score! Points added to your balance, and the next study node is now available!'
  }
};

export const INITIAL_ROADMAP_NODES: SkillNode[] = [
  {
    id: 'two-pointers',
    stepNumber: 1,
    title: 'Two Pointers & Sliding Window',
    category: 'Foundations',
    isUnlocked: true,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Master constant-space window shrinkage and bidirectional pointers for arrays and strings.',
    keyConcepts: ['Opposite-end convergence', 'Dynamic window shrinkage', 'Subarray sum optimization'],
    interviewWeight: 'Very High',
    lesson: {
      overview: 'The Two-Pointer and Sliding Window techniques optimize brute-force nested loops O(N^2) into linear time O(N) by maintaining state between index positions.',
      sections: [
        {
          title: '1. The Core Intuition: Why does it work?',
          body: 'Instead of recomputing sums or checks from scratch for every subarray, we use two indices (Left and Right). In sorted arrays, moving Left inward strictly increases sum, while moving Right inward strictly decreases it. This eliminates 90% of redundant iterations.',
          codeSnippet: `// Two Sum in Sorted Array - O(N) Time, O(1) Space
let left = 0, right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++; // Need larger sum
  else right--; // Need smaller sum
}`,
          keyRule: 'Rule: The array MUST be sorted for bidirectional convergence. If unsorted, consider Hashing first.'
        },
        {
          title: '2. Sliding Window: Dynamic vs Fixed Windows',
          body: 'For substring or contiguous subarray problems, expand the Right pointer eagerly. When an invariant is broken (e.g. duplicate character found or sum exceeds K), contract the Left pointer until valid again.',
          codeSnippet: `// Longest Substring Without Repeating Characters
const seen = new Map();
let maxLen = 0, left = 0;
for (let right = 0; right < s.length; right++) {
  if (seen.has(s[right])) {
    left = Math.max(left, seen.get(s[right]) + 1);
  }
  seen.set(s[right], right);
  maxLen = Math.max(maxLen, right - left + 1);
}`,
          keyRule: 'Each element enters and exits the window at most once, guaranteeing amortized O(N) runtime.'
        },
        {
          title: '3. Common Interview Pitfalls',
          body: 'Forgetting to update Left when duplicates occur behind the current Left pointer (e.g. using Math.max(left, previousIndex + 1)). Always dry run with strings of length 1, 2, and all duplicate characters.',
          keyRule: 'Edge cases to test: empty array, all identical elements, negative numbers.'
        }
      ],
      cheatSheet: [
        'Sorted array + Pair condition = Two Pointers (Left & Right inward).',
        'Contiguous subarray + Max/Min condition = Sliding Window.',
        'Fast & Slow Pointers (Tortoise & Hare) = Cycle detection in Linked Lists.',
        'Space complexity is almost always O(1) with Two Pointers.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'tp-1',
        question: 'When finding a pair with target sum in a SORTED array of size N, what is the optimal time and space complexity of Two Pointers?',
        options: [
          'O(N) time with O(1) auxiliary space',
          'O(N log N) time with O(N) auxiliary space',
          'O(N^2) time with O(1) auxiliary space',
          'O(1) time with O(N) auxiliary space'
        ],
        correctIndex: 0,
        explanation: 'Because the array is already sorted, moving left pointer inward increases the sum while moving right pointer decreases it, needing only two index variables (O(1) space) and a single pass (O(N) time).',
        tip: 'Check if the array is sorted before choosing between Two Pointers and HashMap!'
      },
      {
        id: 'tp-2',
        question: 'In the sliding window problem "Longest Substring Without Repeating Characters", what condition triggers the left boundary to contract?',
        options: [
          'When the current character was already seen inside the active window',
          'When the window size exceeds half the string length',
          'When right pointer encounters a whitespace',
          'When the ASCII value of the character is prime'
        ],
        correctIndex: 0,
        explanation: 'To maintain the invariant of only unique characters, any duplicate character spotted at the right pointer forces the left pointer to advance past the previous duplicate occurrence.',
        tip: 'Use a hash map or 128-element frequency array for instant O(1) duplicate lookups.'
      },
      {
        id: 'tp-3',
        question: 'In "Trapping Rain Water", why can we calculate trapped water with two pointers instead of storing leftMax and rightMax arrays?',
        options: [
          'Because the water trapped at any index is bounded by min(leftMax, rightMax), and the smaller side determines height immediately',
          'Because rainfall always flows to the rightmost index',
          'Because it reduces time complexity from O(N) to O(log N)',
          'Because negative elevation is impossible in testcases'
        ],
        correctIndex: 0,
        explanation: 'If leftMax < rightMax, the bottleneck for the left bar is strictly leftMax regardless of subsequent bars to the right. Thus we can tally water and increment left directly in O(1) space.',
        tip: 'Look for bottlenecks: the shorter wall always dictates maximum fill level.'
      }
    ]
  },
  {
    id: 'frequency-hashing',
    stepNumber: 2,
    title: 'Frequency Hashing & Prefix Sums',
    category: 'Foundations',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Instant lookups, subarray sum equals K, and anagram categorization using hashtables.',
    keyConcepts: ['Prefix sum modulo arithmetic', 'Hash collision avoidance', 'O(1) average lookup'],
    interviewWeight: 'High',
    lesson: {
      overview: 'Hash tables trade space O(N) for average constant time O(1) lookups. When paired with prefix sums, they solve continuous array subarray problems in a single pass.',
      sections: [
        {
          title: '1. The Prefix Sum + Hash Map Paradigm',
          body: 'If the sum from index 0 to j is Sum_j, and the sum from 0 to i is Sum_i, then the subarray between i+1 and j has sum = Sum_j - Sum_i. Setting this to target K means we just check if (Sum_j - K) exists in our hash map!',
          codeSnippet: `// Subarray Sum Equals K
const map = new Map([[0, 1]]); // Empty prefix has sum 0
let currSum = 0, count = 0;
for (const num of nums) {
  currSum += num;
  if (map.has(currSum - k)) {
    count += map.get(currSum - k);
  }
  map.set(currSum, (map.get(currSum) || 0) + 1);
}`,
          keyRule: 'Always seed the map with {0: 1} to account for subarrays that start right at index 0.'
        },
        {
          title: '2. Collisions and Amortized O(1)',
          body: 'In real-world interview viva, interviewers will ask: "What happens when 1,000 keys hash to the same bucket?" In Java 8+, hash buckets convert from linked lists to Red-Black Trees if the bin count exceeds 8, ensuring O(log N) worst-case instead of O(N).',
          keyRule: 'Know the difference between open addressing (linear probing) and separate chaining.'
        }
      ],
      cheatSheet: [
        'Continuous subarray sum problems = Prefix Sum + HashMap.',
        'Anagram groupings = Character count frequency array as hash key.',
        'Two Sum in unsorted array = Store complement (target - num) in hash set.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'fh-1',
        question: 'To find the number of continuous subarrays whose sum equals K in O(N) time, what data structure should pair with prefix sums?',
        options: [
          'HashMap storing {prefixSum: frequency}',
          'PriorityQueue sorted by prefix sums',
          'Binary Search Tree of window sizes',
          'Monotonic increasing stack'
        ],
        correctIndex: 0,
        explanation: 'If currentPrefix - target = previousPrefix, then the subarray between previous and current equals target. A frequency map checks previous occurrences in O(1).',
        tip: 'Always initialize map with {0: 1} to handle subarrays starting from index 0!'
      },
      {
        id: 'fh-2',
        question: 'What is the worst-case time complexity of inserting into a hash table with poor hash distribution and separate chaining without treeification?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N log N)'],
        correctIndex: 0,
        explanation: 'If all keys hash to the same bucket, it degenerates into traversing a single linked list of size N.',
        tip: 'Top companies often ask how modern runtimes prevent hash collision denial-of-service attacks.'
      }
    ]
  },
  {
    id: 'linked-lists',
    stepNumber: 3,
    title: 'Linked Lists & Pointer Manipulation',
    category: 'Linear DSA',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Cycle detection (Floyd’s Tortoise & Hare), in-place reversal, and dummy head nodes.',
    keyConcepts: ['Dummy head node pattern', 'In-place 3-pointer reversal', 'Floyd cycle detection'],
    interviewWeight: 'High',
    lesson: {
      overview: 'Linked lists test pointer discipline and edge case handling (null pointers, head reassignments, cycles).',
      sections: [
        {
          title: '1. The Dummy Head Pattern',
          body: 'Whenever the head of a linked list might change (e.g. removing nodes, merging two lists, partition), always create a dummy node before head. This eliminates messy if-else checks for the first node.',
          codeSnippet: `const dummy = new ListNode(0);
dummy.next = head;
let prev = dummy;
// Prevents null pointer exceptions when deleting head`,
          keyRule: 'Return dummy.next at the end of the function.'
        },
        {
          title: '2. In-Place Reversal',
          body: 'Requires three pointers: prev, curr, and next. Never lose track of curr.next before modifying pointers.',
          codeSnippet: `let prev = null, curr = head;
while (curr) {
  const nextTemp = curr.next;
  curr.next = prev;
  prev = curr;
  curr = nextTemp;
}
return prev; // New head`,
          keyRule: 'Draw the 3 pointer arrows on scratch paper during live interviews.'
        }
      ],
      cheatSheet: [
        'Head modification risk = Use dummy node.',
        'Find middle of list = Slow moves 1 step, Fast moves 2 steps.',
        'Detect cycle = Floyd’s algorithm: fast and slow will meet if cycle exists.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'll-1',
        question: 'In Floyd’s Cycle Detection (Tortoise and Hare), once slow and fast meet inside the cycle, how do you locate the cycle’s start node?',
        options: [
          'Move slow back to head, then advance both slow and fast 1 step at a time until they meet',
          'Reverse the entire linked list and check for null',
          'Count the cycle length and double it',
          'Fast continues running at 3x speed'
        ],
        correctIndex: 0,
        explanation: 'Mathematically, the distance from head to cycle entrance equals the distance from meeting point to cycle entrance modulo cycle length. Moving slow to head and stepping both at 1x finds the entrance.',
        tip: 'This is a favorite interview follow-up question at Amazon and Microsoft.'
      }
    ]
  },
  {
    id: 'trees-bst',
    stepNumber: 4,
    title: 'Binary Trees & BST Mastery',
    category: 'Hierarchical',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'DFS/BFS traversals, Lowest Common Ancestor (LCA), and BST invariant validation.',
    keyConcepts: ['Recursion stack unwinding', 'Level-order queue traversal', 'BST invariant validation (min, max)'],
    interviewWeight: 'Crucial',
    lesson: {
      overview: 'Binary trees are the cornerstone of technical interviews. 80% of tree problems reduce to DFS (Pre, In, Post) or BFS (Queue).',
      sections: [
        {
          title: '1. Validating a Binary Search Tree (BST)',
          body: 'A common mistake is checking only if node.left < node and node.right > node locally. The entire left subtree must be less than the ancestor! We must pass down (min, max) boundaries recursively.',
          codeSnippet: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}`,
          keyRule: 'Alternative check: An in-order traversal of a valid BST must yield strictly sorted numbers.'
        },
        {
          title: '2. Lowest Common Ancestor (LCA)',
          body: 'In a BST: if both values are smaller than root, LCA is in left subtree; if both are larger, in right subtree; if they split, root is the LCA!',
          keyRule: 'In a generic Binary Tree without BST ordering, return node if it matches p or q, and propagate nulls upward.'
        }
      ],
      cheatSheet: [
        'DFS = Call stack / recursion. Best for path finding, depth, max diameter.',
        'BFS = Queue (FIFO). Best for level-by-level processing, shortest path in unweighted tree.',
        'In-order on BST = Sorted order.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'tree-1',
        question: 'When validating whether a binary tree is a valid Binary Search Tree (BST), what is the most critical constraint?',
        options: [
          'EVERY node in the left subtree must be strictly less than the root, and every node in right must be strictly greater',
          'Only check immediate children (node.left.val < node.val)',
          'All leaf nodes must have identical depth',
          'The tree must be balanced with height O(log N)'
        ],
        correctIndex: 0,
        explanation: 'Local child checks are insufficient. Subtree invariants must hold for all ancestors via valid [min, max] range propagation.',
        tip: 'In interviews, mention both the [min, max] recursion method and the in-order traversal verification!'
      },
      {
        id: 'tree-2',
        question: 'What is the time complexity of finding the Lowest Common Ancestor (LCA) in a balanced Binary Search Tree?',
        options: ['O(H) where H is tree height O(log N)', 'O(N^2)', 'O(1)', 'O(N!)'],
        correctIndex: 0,
        explanation: 'At each step we discard half the tree by comparing p and q with root. In a balanced BST, height is O(log N).',
        tip: 'In a BST, splitting paths immediately marks the lowest common ancestor.'
      }
    ]
  },
  {
    id: 'stacks-monotonic',
    stepNumber: 5,
    title: 'Stacks & Monotonic Queues',
    category: 'Linear DSA',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Next Greater Element, Daily Temperatures, and Largest Rectangle in Histogram.',
    keyConcepts: ['Monotonic decreasing stack', 'Span computation', 'Amortized O(N) complexity'],
    interviewWeight: 'Very High',
    lesson: {
      overview: 'Monotonic stacks maintain elements in strictly increasing or decreasing order, solving "next greater / smaller element" queries in linear time.',
      sections: [
        {
          title: '1. The Monotonic Stack Template',
          body: 'Iterate through elements. While stack is not empty and current element is greater than the top element, pop from stack and resolve the popped element.',
          codeSnippet: `const result = new Array(nums.length).fill(-1);
const stack = []; // Stores indices
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[i] > nums[stack.at(-1)]) {
    const prevIndex = stack.pop();
    result[prevIndex] = nums[i]; // Found next greater!
  }
  stack.push(i);
}`,
          keyRule: 'Store INDICES in the stack, not raw values, so you can calculate distances and update result arrays in-place.'
        }
      ],
      cheatSheet: [
        'Next Greater Element = Monotonic Decreasing Stack.',
        'Next Smaller Element = Monotonic Increasing Stack.',
        'Each index pushed once and popped at most once = Amortized O(N).'
      ]
    },
    assessmentQuestions: [
      {
        id: 'stk-1',
        question: 'In "Daily Temperatures", why is the monotonic stack approach O(N) even with a while loop inside the for loop?',
        options: [
          'Because each element is pushed once and popped at most once across the entire algorithm',
          'Because the array is already sorted',
          'Because modern JS engines parallelize while loops',
          'Because the stack size is bounded by 10'
        ],
        correctIndex: 0,
        explanation: 'Amortized analysis: 2N total operations max (N pushes and at most N pops across all loop iterations), giving strictly O(N) time.',
        tip: 'Whenever an interviewer asks about a nested loop, defend it with amortized element lifecycle!'
      }
    ]
  },
  {
    id: 'dynamic-programming',
    stepNumber: 6,
    title: 'Dynamic Programming: Knapsack & Subsequences',
    category: 'Advanced Algorithms',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Subproblem overlapping, state transitions, memoization vs tabulation, space compression.',
    keyConcepts: ['Optimal substructure', 'Memoization recursion tree pruning', '1D rolling array compression'],
    interviewWeight: 'Crucial',
    lesson: {
      overview: 'Dynamic Programming solves problems with overlapping subproblems and optimal substructure by caching calculated sub-solutions.',
      sections: [
        {
          title: '1. The 0/1 Knapsack Space Compression',
          body: 'In 0/1 knapsack, each item can only be chosen once. When optimizing from 2D dp[i][w] to 1D dp[w], we MUST iterate the capacity loop backwards from W down to weight. This guarantees we use values from the previous step without double-counting!',
          codeSnippet: `const dp = new Array(capacity + 1).fill(0);
for (let i = 0; i < n; i++) {
  for (let w = capacity; w >= weights[i]; w--) {
    dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  }
}`,
          keyRule: 'Looping backwards = 0/1 Knapsack (single use). Looping forwards = Unbounded Knapsack (infinite use).'
        }
      ],
      cheatSheet: [
        'Top-down = Recursion + Memoization table (easier to write).',
        'Bottom-up = Iterative table filling (no call stack overflow).',
        'Check subproblem dependency: If dp[i] only depends on dp[i-1], compress to O(1) variables.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'dp-1',
        question: 'In 0/1 Knapsack, when compressing space from 2D dp[n][w] to 1D dp[w], why must the capacity loop run in reverse?',
        options: [
          'To prevent reusing the same item multiple times in the same step',
          'To sort the items by value',
          'Because arrays can only allocate backwards',
          'Direction does not affect correctness'
        ],
        correctIndex: 0,
        explanation: 'Looping backwards ensures dp[w - weight] reflects the previous items, not the item currently being considered.',
        tip: 'Explaining 1D rolling array compression in DP proves senior engineering maturity.'
      }
    ]
  },
  {
    id: 'system-design',
    stepNumber: 7,
    title: 'System Design & High-Scale Flow',
    category: 'System Design',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Horizontal scaling, Redis cache-aside, CAP theorem, database read replicas, rate limiters.',
    keyConcepts: ['Cache-aside pattern', 'Consistent hashing', 'Thundering herd mitigation'],
    interviewWeight: 'Crucial',
    lesson: {
      overview: 'In senior campus and off-campus interviews, candidates are asked how systems scale from 1,000 to 1,000,000 users without crashing.',
      sections: [
        {
          title: '1. The Cache-Aside Pattern',
          body: 'Application checks Redis cache first. If hit, return data in 1-2ms. If miss, query relational database, write back to cache with TTL, and return. Relieves database of 95% read traffic.',
          keyRule: 'Always set a Time-To-Live (TTL) to prevent stale cache accumulation.'
        },
        {
          title: '2. Thundering Herd / Cache Stampede',
          body: 'When a popular cached key expires, 10,000 requests hit the database simultaneously. Mitigate with Mutex locks or probabilistic early background refresh.',
          keyRule: 'Mentioning cache stampede protection wins instant respect from system design interviewers.'
        }
      ],
      cheatSheet: [
        'Read heavy system = Add Read Replicas + Redis Cache.',
        'Write heavy system = Append-only logs + Message Queues (Kafka/RabbitMQ).',
        'Single point of failure = Introduce Load Balancers + Multi-AZ redundancy.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'sd-1',
        question: 'What is the "Cache Stampede" problem and how is it resolved in production?',
        options: [
          'Multiple simultaneous requests hit database when a hot cache key expires; mitigated with mutex locks or background early refresh',
          'When Redis runs out of memory and crashes the host OS',
          'When database write transactions collide on identical primary keys',
          'When browser cookies exceed the 4KB header limit'
        ],
        correctIndex: 0,
        explanation: 'When a popular cached item expires, hundreds of concurrent threads query the primary DB simultaneously. Mutual exclusion locks or probabilistic refresh solves it.',
        tip: 'Always emphasize protecting the primary database from sudden connection spikes.'
      }
    ]
  },
  {
    id: 'elite-mock-trials',
    stepNumber: 8,
    title: 'Elite Company Mock Trials',
    category: 'Interview Trials',
    isUnlocked: false,
    isLearned: false,
    isCompleted: false,
    masteryScore: 0,
    summary: 'Multi-round mock simulation combining timed DSA coding constraints and Amazon Bar Raiser questions.',
    keyConcepts: ['Live timed coding constraints', 'Behavioral leadership mapping', 'Edge case resilience'],
    interviewWeight: 'Crucial',
    lesson: {
      overview: 'The final boss milestone. Combine algorithmic speed, code cleanliness, and executive STAR presence into a cohesive interview performance.',
      sections: [
        {
          title: '1. The 45-Minute Interview Breakdown',
          body: '0-5 mins: Introductions & rapport. 5-10 mins: Clarify problem constraints & edge cases. 10-15 mins: Discuss brute force & propose optimal approach. 15-35 mins: Write clean, modular code. 35-40 mins: Dry run test cases. 40-45 mins: Thoughtful reverse questions.',
          keyRule: 'Never write a single line of code until the interviewer confirms they agree with your approach!'
        }
      ],
      cheatSheet: [
        'Brute force first -> Identify bottleneck -> Optimize -> Code -> Dry run.',
        'Behavioral questions: Use STAR (Situation, Task, Action, Result).',
        'End with 2 curious reverse-questions about their engineering challenges.'
      ]
    },
    assessmentQuestions: [
      {
        id: 'dg-1',
        question: 'In a top-tier tech interview, you are asked: "Tell me about a time you made a decision without complete data." Which Amazon Leadership Principle is this evaluating?',
        options: [
          'Bias for Action',
          'Frugality',
          'Invent and Simplify',
          'Earn Trust'
        ],
        correctIndex: 0,
        explanation: 'Bias for Action values speed and calculated risk taking: "Speed matters in business. Many decisions and actions are reversible and do not need extensive study."',
        tip: 'Frame your story around two-way door decisions (reversible) vs one-way door decisions.'
      }
    ]
  }
];

export const INITIAL_FRIENDS: FriendUser[] = [
  {
    id: 'f-1',
    name: 'Priya Patel',
    college: 'IIT Madras',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
    streak: 8,
    sparks: 420,
    completedTopicsCount: 3,
    currentTopic: 'Binary Trees & BST',
    status: 'Studying'
  },
  {
    id: 'f-2',
    name: 'Rahul Verma',
    college: 'NIT Trichy',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rahul',
    streak: 6,
    sparks: 340,
    completedTopicsCount: 2,
    currentTopic: 'Frequency Hashing',
    status: 'In Assessment'
  },
  {
    id: 'f-3',
    name: 'Ananya Sharma',
    college: 'BITS Pilani',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya',
    streak: 12,
    sparks: 610,
    completedTopicsCount: 5,
    currentTopic: 'Stacks & Monotonic Queues',
    status: 'Online'
  },
  {
    id: 'f-4',
    name: 'Vikrant Iyer',
    college: 'DTU Delhi',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vikrant',
    streak: 4,
    sparks: 280,
    completedTopicsCount: 2,
    currentTopic: 'Two Pointers',
    status: 'Studying'
  }
];

export const INITIAL_SQUAD_QUESTS: SquadQuest[] = [
  {
    id: 'sq-1',
    title: 'Squad Daily Co-op: Pass 4 Assessments',
    description: 'Work together with your squad to clear 4 topic assessments today.',
    goal: 4,
    current: 2,
    unit: 'Assessments',
    rewardSparks: 150,
    completed: false
  },
  {
    id: 'sq-2',
    title: 'Consistency Firewall: Keep All Streaks Alive',
    description: 'Ensure every squad member logs in and studies today to protect squad flame multiplier.',
    goal: 5,
    current: 4,
    unit: 'Active Members',
    rewardSparks: 100,
    completed: false
  },
  {
    id: 'sq-3',
    title: 'Voice Studio Sprint: 6 Mock Interview Sessions',
    description: 'Complete 6 speech evaluation sessions in the AI Voice Coach across the team.',
    goal: 6,
    current: 3,
    unit: 'Speech Sessions',
    rewardSparks: 200,
    completed: false
  }
];
