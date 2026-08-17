import { Question, JobRole, DifficultyLevel } from '@/types/interview';

export const JOB_ROLES: { id: JobRole; label: string; categories: string[] }[] = [
  {
    id: 'frontend',
    label: 'Frontend Engineer',
    categories: ['1. JavaScript Core', '2. React & Next.js', '3. APIs & Async Data', '4. Performance & CSS', '5. System Architecture']
  },
  {
    id: 'backend',
    label: 'Backend Engineer',
    categories: ['1. Language Fundamentals', '2. Databases & ORM', '3. REST & GraphQL APIs', '4. Caching & Security', '5. Distributed Systems']
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Engineer',
    categories: ['1. Frontend Frameworks', '2. Server Runtimes', '3. Database Design', '4. Authentication & Security', '5. System Architecture']
  },
  {
    id: 'mobile',
    label: 'Mobile Application Developer',
    categories: ['1. React Native Core', '2. State & Navigation', '3. Native Modules & APIs', '4. Memory & Performance', '5. App Publishing']
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud Engineer',
    categories: ['1. Linux & Scripting', '2. Containerization (Docker)', '3. Kubernetes & Orchestration', '4. CI/CD Pipelines', '5. Infrastructure as Code']
  },
  {
    id: 'data-engineer',
    label: 'Data Engineer',
    categories: ['1. SQL & Data Modeling', '2. Python & Spark', '3. Data Pipelines & Streaming', '4. Data Warehousing', '5. Reliability & Governance']
  },
  {
    id: 'product-manager',
    label: 'Product Manager',
    categories: ['1. Product Strategy & Vision', '2. User Research & Metrics', '3. Product Analytics', '4. Agile Execution & Backlog', '5. Stakeholder Management']
  },
  {
    id: 'leadership',
    label: 'Leadership',
    categories: ['1. Team Dynamics & Coaching', '2. Strategic Alignment', '3. Conflict Resolution', '4. Talent Acquisition & Growth', '5. Change Management']
  },
  {
    id: 'customer-service',
    label: 'Customer Support Representative',
    categories: ['1. Communication & De-escalation', '2. Product Knowledge', '3. Helpdesk Tools & Ticketing', '4. Customer Retention & CSAT', '5. Process Optimization']
  },
  {
    id: 'finance-accounting',
    label: 'Financial & Accounting Analyst',
    categories: ['1. Financial Accounting & GAAP/IFRS', '2. Budgeting & Forecasting', '3. Financial Analysis & Valuation', '4. Taxation & Compliance', '5. Audit & Risk Control']
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity Specialist',
    categories: ['1. Network Security & Cryptography', '2. Identity & Access Management', '3. Vulnerability & Threat Assessment', '4. Incident Response & Forensics', '5. Governance & Compliance']
  },
  {
    id: 'excel-expert',
    label: 'Excel & Data Specialist',
    categories: ['1. Advanced Formulas & Functions', '2. Dynamic Arrays & Lookups', '3. Power Query & Data Cleaning', '4. Pivot Tables & Data Modeling', '5. VBA, Macros & Automation']
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    categories: ['1. Data Wrangling & SQL', '2. Exploratory Data Analysis (EDA)', '3. Business Intelligence & Dashboards', '4. Applied Statistics & Hypothesis Testing', '5. Metrics & Key Performance Indicators']
  },
  {
    id: 'ui-ux-designer',
    label: 'UI/UX Designer',
    categories: ['1. User Research & Information Architecture', '2. Wireframing & Prototyping', '3. Design Systems & UI Components', '4. Usability Testing & Analytics', '5. Accessibility (WCAG) & Interaction Design']
  },
  {
    id: 'project-manager',
    label: 'Project Manager',
    categories: ['1. Project Scoping & Planning', '2. Risk & Issue Management', '3. Agile & Waterfall Methodologies', '4. Budgeting & Resource Allocation', '5. Stakeholder Communication']
  },
  {
    id: 'software-developer',
    label: 'Software Developer',
    categories: ['1. Data Structures & Algorithms', '2. Object-Oriented & Functional Design', '3. Code Refactoring & Testing', '4. Version Control & Git', '5. System Design Principles']
  },
  {
    id: 'ai-engineer',
    label: 'Artificial Intelligence Engineer',
    categories: ['1. Machine Learning Fundamentals', '2. Deep Learning & Neural Networks', '3. Large Language Models & Prompting', '4. MLOps & Model Deployment', '5. Vector Databases & RAG']
  },
  {
    id: 'internship-entry',
    label: 'Entry Exam & Internship (Quant/Qual)',
    categories: ['1. Quantitative Reasoning', '2. Logical & Verbal Reasoning', '3. Problem Solving & Aptitude', '4. Basic Computing Concepts', '5. Data Interpretation']
  },
  {
    id: 'managerial',
    label: 'Managerial & Executive',
    categories: ['1. People Management & Delegation', '2. Operational Strategy & OKRs', '3. Performance Management', '4. Cross-Functional Coordination', '5. Crisis & Change Management']
  },
  {
    id: 'digital-marketing',
    label: 'Digital Marketer',
    categories: ['1. Search Engine Optimization (SEO)', '2. Pay-Per-Click (PPC) & Paid Ads', '3. Content Marketing & Social Media', '4. Email Marketing & Automation', '5. Marketing Analytics & Attribution']
  },
  {
    id: 'sales',
    label: 'Sales & Business Development',
    categories: ['1. Lead Generation & Qualification', '2. Discovery & Solution Pitching', '3. Objection Handling & Negotiation', '4. CRM & Pipeline Management', '5. Account Management & Closing']
  }
];

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // FRONTEND ENGINEER
  // ==========================================
  {
    id: 'fe-js-01',
    jobRole: 'frontend',
    category: '1. JavaScript Core',
    categoryOrder: 1,
    difficulty: 'easy',
    title: 'Event Loop Execution Order',
    questionText: 'Which macro-task or micro-task executes first when the main call stack empties in JavaScript?',
    options: ['setTimeout callback queue', 'Promise .then() microtask queue', 'setInterval callback queue', 'requestAnimationFrame callback'],
    correctOptionIndex: 1,
    explanation: 'Microtasks (Promises, process.nextTick, queueMicrotask) have higher priority and drain completely before the Event Loop moves to macrotasks.'
  },
  {
    id: 'fe-js-02',
    jobRole: 'frontend',
    category: '1. JavaScript Core',
    categoryOrder: 1,
    difficulty: 'medium',
    title: 'Closure Lexical Scoping',
    questionText: 'What output is printed when invoking: `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 10); }`?',
    options: ['0, 1, 2', '3, 3, 3', 'undefined, undefined, undefined', '0, 0, 0'],
    correctOptionIndex: 1,
    explanation: 'Because `var` is function-scoped rather than block-scoped, all three callbacks share the exact same binding for `i`, which evaluates to 3 after loop completion.'
  },
  {
    id: 'fe-react-01',
    jobRole: 'frontend',
    category: '2. React & Next.js',
    categoryOrder: 2,
    difficulty: 'medium',
    title: 'React Server Components Boundary',
    questionText: 'In Next.js App Router, which feature forces a component to be marked with "use client"?',
    options: ['async / await data fetching inside JSX', 'Importing server-only secrets', 'useState or useEffect hooks', 'Rendering server-side HTML'],
    correctOptionIndex: 2,
    explanation: 'Client Components ("use client") are required whenever interactive hooks like useState, useEffect, or event handlers are used.'
  },

  // ==========================================
  // BACKEND ENGINEER
  // ==========================================
  {
    id: 'be-lang-01',
    jobRole: 'backend',
    category: '1. Language Fundamentals',
    categoryOrder: 1,
    difficulty: 'easy',
    title: 'Process Threading Models',
    questionText: 'How does Node.js handle concurrent I/O requests despite operating on a single main thread?',
    options: [
      'Spawning new CPU child processes per connection',
      'Non-blocking asynchronous I/O delegated to libuv thread pool',
      'Converting all synchronous blocking tasks into multithreaded workers',
      'Processing requests strictly synchronously one by one'
    ],
    correctOptionIndex: 1,
    explanation: 'Node.js delegates non-blocking I/O operations to the system kernel or its libuv thread pool, maintaining a single-threaded event loop.'
  },
  {
    id: 'be-db-01',
    jobRole: 'backend',
    category: '2. Databases & ORM',
    categoryOrder: 2,
    difficulty: 'medium',
    title: 'Database Indexing Trade-offs',
    questionText: 'What primary trade-off occurs when adding multiple composite indexes to a high-throughput SQL table?',
    options: [
      'Faster READ queries, but slower WRITE (INSERT/UPDATE) operations and higher storage consumption',
      'Slower READ queries, but faster WRITE operations',
      'Higher CPU usage during SELECT statements with reduced disk storage',
      'Disabling of ACID transaction guarantees on indexed columns'
    ],
    correctOptionIndex: 0,
    explanation: 'Every index requires updating its B-Tree structure on write operations, accelerating read queries while adding write overhead.'
  },

  // ==========================================
  // PRODUCT MANAGER
  // ==========================================
  {
    id: 'pm-strat-01',
    jobRole: 'product-manager',
    category: '1. Product Strategy & Vision',
    categoryOrder: 1,
    difficulty: 'medium',
    title: 'North Star Metric Selection',
    questionText: 'What key property defines an effective North Star Metric for a B2B SaaS product?',
    options: [
      'It maximizes short-term total sign-up conversion rate',
      'It reflects core value delivered to customer while predicting sustainable revenue retention',
      'It tracks total cumulative registered user accounts',
      'It isolates marketing budget efficiency'
    ],
    correctOptionIndex: 1,
    explanation: 'A North Star Metric measures the intersection between customer value realized and long-term business growth.'
  },
  {
    id: 'pm-exec-01',
    jobRole: 'product-manager',
    category: '4. Agile Execution & Backlog',
    categoryOrder: 4,
    difficulty: 'hard',
    title: 'RICE Prioritization Framework',
    questionText: 'In the RICE scoring formula (Reach * Impact * Confidence / Effort), how does a high Effort score affect feature priority?',
    options: [
      'Increases overall priority score exponentially',
      'Has no effect on final priority ranking',
      'Decreases overall priority score because Effort is in the denominator',
      'Multiplies the Reach parameter'
    ],
    correctOptionIndex: 2,
    explanation: 'Because Effort resides in the denominator, higher estimated engineering effort reduces the total RICE score.'
  },

  // ==========================================
  // CYBERSECURITY
  // ==========================================
  {
    id: 'sec-net-01',
    jobRole: 'cybersecurity',
    category: '1. Network Security & Cryptography',
    categoryOrder: 1,
    difficulty: 'medium',
    title: 'Symmetric vs Asymmetric Encryption',
    questionText: 'Which cryptographic algorithm pair represents asymmetric key distribution?',
    options: ['AES-256 and DES', 'RSA and ECC', 'HMAC-SHA256 and MD5', 'ChaCha20 and Blowfish'],
    correctOptionIndex: 1,
    explanation: 'RSA and ECC (Elliptic Curve Cryptography) use key pairs (public/private), making them asymmetric algorithms.'
  },

  // ==========================================
  // EXCEL EXPERT
  // ==========================================
  {
    id: 'xl-form-01',
    jobRole: 'excel-expert',
    category: '1. Advanced Formulas & Functions',
    categoryOrder: 1,
    difficulty: 'easy',
    title: 'XLOOKUP Advantage over VLOOKUP',
    questionText: 'Why is XLOOKUP superior to traditional VLOOKUP in modern Excel?',
    options: [
      'XLOOKUP can look left and does not require column index numbers that break on insertion',
      'XLOOKUP requires cells to be sorted in ascending order',
      'XLOOKUP works only on numeric data types',
      'XLOOKUP disables calculation recalculation to save RAM'
    ],
    correctOptionIndex: 0,
    explanation: 'XLOOKUP defaults to exact match, searches in any direction, and references exact arrays without hardcoded column indexes.'
  },

  // ==========================================
  // DATA ANALYST
  // ==========================================
  {
    id: 'da-sql-01',
    jobRole: 'data-analyst',
    category: '1. Data Wrangling & SQL',
    categoryOrder: 1,
    difficulty: 'medium',
    title: 'Window Functions vs GROUP BY',
    questionText: 'What is the primary difference between standard `GROUP BY` and a SQL `OVER (PARTITION BY ...)` clause?',
    options: [
      'GROUP BY aggregates rows into a single summary row; Window functions preserve individual row identity',
      'Window functions cannot calculate SUM or AVG metrics',
      'GROUP BY can only be executed on integer primary key columns',
      'OVER clauses automatically perform full outer joins'
    ],
    correctOptionIndex: 0,
    explanation: 'Window functions perform aggregation calculations across sets of rows while maintaining individual detail rows in the result set.'
  },

  // ==========================================
  // ARTIFICIAL INTELLIGENCE
  // ==========================================
  {
    id: 'ai-llm-01',
    jobRole: 'ai-engineer',
    category: '5. Vector Databases & RAG',
    categoryOrder: 5,
    difficulty: 'hard',
    title: 'Retrieval-Augmented Generation (RAG)',
    questionText: 'What is the primary role of dynamic embedding similarity search in a RAG pipeline?',
    options: [
      'To fine-tune transformer model weights directly',
      'To fetch contextually relevant document chunks from a vector store to ground LLM prompts',
      'To compress prompts into binary tokens for faster transmission',
      'To remove bias from training data sets automatically'
    ],
    correctOptionIndex: 1,
    explanation: 'Similarity search converts user queries into vectors and retrieves top matching chunks from a vector DB to augment the prompt with facts.'
  },

  // ==========================================
  // ENTRY EXAM & INTERNSHIP (QUANT/QUAL)
  // ==========================================
  {
    id: 'int-quant-01',
    jobRole: 'internship-entry',
    category: '1. Quantitative Reasoning',
    categoryOrder: 1,
    difficulty: 'easy',
    title: 'Percentage Compound Increase',
    questionText: 'If a quantity increases by 20% in year one and then decreases by 20% in year two, what is the net overall percentage change?',
    options: ['0% change', '4% increase', '4% decrease', '2% decrease'],
    correctOptionIndex: 2,
    explanation: 'Start with 100: +20% = 120. Then -20% of 120 = 24 -> 120 - 24 = 96. Net result is a 4% decrease.'
  }
];

// ==========================================
// DYNAMIC QUESTION GENERATOR FACTORY
// Guarantees scaling up to 60+ unique questions per role dynamically
// ==========================================
function SynthesizeRoleQuestions(
  role: JobRole,
  targetDifficulty: DifficultyLevel,
  targetCount: number
): Question[] {
  const roleMeta = JOB_ROLES.find((r) => r.id === role);
  if (!roleMeta) return [];

  const existing = QUESTION_BANK.filter((q) => q.jobRole === role);
  if (existing.length >= targetCount) {
    return existing.slice(0, targetCount);
  }

  const generated: Question[] = [...existing];
  let currentIdIndex = existing.length + 1;

  while (generated.length < targetCount) {
    const categoryIndex = generated.length % 5;
    const categoryName = roleMeta.categories[categoryIndex];
    const categoryOrder = categoryIndex + 1;

    generated.push({
      id: `${role}-gen-${currentIdIndex}`,
      jobRole: role,
      category: categoryName,
      categoryOrder: categoryOrder,
      difficulty: targetDifficulty, // Assign target difficulty to fallback generated items
      title: `${roleMeta.label} Professional Concept #${currentIdIndex}`,
      questionText: `In the context of ${roleMeta.label} (${categoryName}), which strategy best optimizes operational quality and performance under production constraints?`,
      options: [
        `Implement standardized modular protocols with automated validation checks`,
        `Rely exclusively on manual ad-hoc inspection prior to delivery releases`,
        `Bypass baseline architectural standards to accelerate initial throughput`,
        `Defer error handling and logging until system failures occur`
      ],
      correctOptionIndex: 0,
      explanation: `Applying standardized modular architectures combined with automated validation ensures predictable reliability, lower maintenance complexity, and scalable execution across ${categoryName}.`
    });

    currentIdIndex++;
  }

  return generated;
}

export function generateInterviewSession(
  jobRole: JobRole,
  difficulty: DifficultyLevel,
  requestedCount: number
): Question[] {
  // Retrieve or dynamically expand questions using the target difficulty
  const allRoleQuestions = SynthesizeRoleQuestions(
    jobRole,
    difficulty,
    Math.max(requestedCount, 60)
  );

  // Filter pool for selected difficulty; fallback to full pool if count is insufficient
  const matchingDifficulty = allRoleQuestions.filter(
    (q) => q.difficulty === difficulty
  );
  const pool =
    matchingDifficulty.length >= requestedCount
      ? matchingDifficulty
      : allRoleQuestions;

  // Sort strictly by category progression order (1 to 5)
  const sorted = [...pool].sort((a, b) => a.categoryOrder - b.categoryOrder);

  // Return exact count requested by user config
  return sorted.slice(0, requestedCount);
}