import { JobRoleOption, Question } from '@/types/interview';

export const JOB_ROLES: JobRoleOption[] = [
  { id: 'frontend', label: 'Frontend Developer', categories: ['React', 'TypeScript', 'CSS/HTML', 'Performance'] },
  { id: 'backend', label: 'Backend Developer', categories: ['Node.js', 'Databases', 'APIs', 'Security'] },
  { id: 'fullstack', label: 'Fullstack Engineer', categories: ['System Architecture', 'REST/GraphQL', 'DBs', 'DevOps'] },
  { id: 'devops', label: 'DevOps & Cloud', categories: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'] },
  { id: 'mobile', label: 'Mobile Engineer', categories: ['React Native', 'Flutter', 'iOS/Android', 'State'] },
  { id: 'data-science', label: 'Data Scientist', categories: ['Python', 'Machine Learning', 'SQL', 'Pandas'] },
  { id: 'ui-ux', label: 'UI/UX Designer', categories: ['Wireframing', 'User Research', 'Figma', 'Prototyping'] },
  { id: 'product-management', label: 'Product Manager', categories: ['Roadmapping', 'Agile', 'KPIs', 'User Stories'] },
];

// Helper question bank with guaranteed unique IDs per role
export const QUESTION_BANK: Question[] = [
  // --- FRONTEND (12 Questions) ---
  {
    id: 'fe-1',
    jobRole: 'frontend',
    category: 'React',
    difficulty: 'easy',
    questionText: 'What is the primary purpose of React React.memo()?',
    options: [
      'To cache API call results in memory',
      'To prevent unnecessary re-renders of a component when props do not change',
      'To make state mutations synchronous',
      'To create persistent refs across render cycles'
    ],
    correctOptionIndex: 1,
    explanation: 'React.memo is a higher-order component that skips rendering a component if its props have not changed.'
  },
  {
    id: 'fe-2',
    jobRole: 'frontend',
    category: 'JavaScript',
    difficulty: 'easy',
    questionText: 'Which keyword creates a block-scoped variable that cannot be re-assigned?',
    options: ['var', 'let', 'const', 'global'],
    correctOptionIndex: 2,
    explanation: 'const declares block-scoped variables that cannot be reassigned after initialization.'
  },
  {
    id: 'fe-3',
    jobRole: 'frontend',
    category: 'CSS',
    difficulty: 'medium',
    questionText: 'Which CSS layout module handles two-dimensional (rows and columns) layouts best?',
    options: ['Flexbox', 'CSS Grid', 'Float', 'Position absolute'],
    correctOptionIndex: 1,
    explanation: 'CSS Grid is designed specifically for two-dimensional layout controls (rows and columns simultaneously).'
  },
  {
    id: 'fe-4',
    jobRole: 'frontend',
    category: 'TypeScript',
    difficulty: 'easy',
    questionText: 'What does the "unknown" type represent in TypeScript?',
    options: [
      'An alias for "any" with no type checking',
      'A type-safe counterpart to "any" that requires type assertions before usage',
      'A function that never returns',
      'An empty object type'
    ],
    correctOptionIndex: 1,
    explanation: 'unknown forces developer verification or narrowing before operations can be performed on the value.'
  },
  {
    id: 'fe-5',
    jobRole: 'frontend',
    category: 'Performance',
    difficulty: 'medium',
    questionText: 'What does CLS stand for in Google Web Vitals?',
    options: ['Cumulative Layout Shift', 'Cached Load Speed', 'Central Location Scripting', 'Compiled Layout Style'],
    correctOptionIndex: 0,
    explanation: 'Cumulative Layout Shift measures visual stability by measuring unexpected layout movements.'
  },
  {
    id: 'fe-6',
    jobRole: 'frontend',
    category: 'React',
    difficulty: 'medium',
    questionText: 'When does the cleanup function of useEffect run?',
    options: [
      'Only when the component unmounts',
      'Before every re-render and when the component unmounts',
      'Immediately before state updates',
      'After the next render completes'
    ],
    correctOptionIndex: 1,
    explanation: 'useEffect cleanups run before the effect is re-executed on prop/state changes and upon component unmounting.'
  },
  {
    id: 'fe-7',
    jobRole: 'frontend',
    category: 'HTML/DOM',
    difficulty: 'easy',
    questionText: 'Which HTML attribute signals async execution of external scripts without blocking DOM parsing?',
    options: ['defer', 'async', 'preload', 'no-block'],
    correctOptionIndex: 1,
    explanation: 'async downloads the script in parallel and executes it immediately when ready without blocking HTML parsing.'
  },
  {
    id: 'fe-8',
    jobRole: 'frontend',
    category: 'CSS',
    difficulty: 'easy',
    questionText: 'What does the `box-sizing: border-box` CSS declaration do?',
    options: [
      'Adds double borders around containers',
      'Includes padding and border in the element total width and height',
      'Excludes margins from calculations',
      'Centers element content automatically'
    ],
    correctOptionIndex: 1,
    explanation: 'border-box causes width and height to include content, padding, and borders.'
  },
  {
    id: 'fe-9',
    jobRole: 'frontend',
    category: 'JavaScript',
    difficulty: 'medium',
    questionText: 'What is Event Delegation in JavaScript?',
    options: [
      'Passing event handlers as parameters to child components',
      'Attaching a single event listener to a parent element to manage events for child nodes',
      'Canceling bubbling phase events',
      'Running asynchronous event handlers in parallel'
    ],
    correctOptionIndex: 1,
    explanation: 'Event Delegation takes advantage of event bubbling to listen for child events at a parent container level.'
  },
  {
    id: 'fe-10',
    jobRole: 'frontend',
    category: 'React',
    difficulty: 'medium',
    questionText: 'What is the correct hook to store a mutable value that does NOT trigger re-renders on change?',
    options: ['useState', 'useMemo', 'useRef', 'useCallback'],
    correctOptionIndex: 2,
    explanation: 'useRef returns a mutable object whose .current property persists across renders without causing re-renders.'
  },
  {
    id: 'fe-11',
    jobRole: 'frontend',
    category: 'Performance',
    difficulty: 'medium',
    questionText: 'What technique delays loading off-screen images until the user scrolls near them?',
    options: ['Tree shaking', 'Code splitting', 'Lazy loading', 'Pre-fetching'],
    correctOptionIndex: 2,
    explanation: 'Lazy loading defers image download until required in the browser viewport.'
  },
  {
    id: 'fe-12',
    jobRole: 'frontend',
    category: 'TypeScript',
    difficulty: 'easy',
    questionText: 'Which utility type constructs a type with all properties of T set to optional?',
    options: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Pick<T>'],
    correctOptionIndex: 0,
    explanation: 'Partial<T> makes all properties in interface T optional.'
  },

  // --- BACKEND (12 Questions) ---
  {
    id: 'be-1',
    jobRole: 'backend',
    category: 'Node.js',
    difficulty: 'easy',
    questionText: 'What is the Node.js Event Loop responsible for?',
    options: [
      'Executing synchronous code in multithreaded workers',
      'Offloading non-blocking I/O tasks to execute single-threaded asynchronous callbacks',
      'Compiling JavaScript into C++ binary',
      'Handling SQL database connections directly'
    ],
    correctOptionIndex: 1,
    explanation: 'The Event Loop handles async operations in Node.js on a single main thread via non-blocking callbacks.'
  },
  {
    id: 'be-2',
    jobRole: 'backend',
    category: 'Databases',
    difficulty: 'easy',
    questionText: 'What does ACID stand for in database management systems?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Async, Concurrent, Indexed, Distributed',
      'Access, Control, Integrity, Data',
      'Array, Column, Index, Document'
    ],
    correctOptionIndex: 0,
    explanation: 'ACID guarantees database transaction reliability.'
  },
  {
    id: 'be-3',
    jobRole: 'backend',
    category: 'Security',
    difficulty: 'medium',
    questionText: 'Which HTTP header mitigates Cross-Site Scripting (XSS) attacks?',
    options: ['Content-Security-Policy', 'Access-Control-Allow-Origin', 'X-Frame-Options', 'Strict-Transport-Security'],
    correctOptionIndex: 0,
    explanation: 'Content-Security-Policy restricts resource origins allowed to execute in browser scripts.'
  },
  {
    id: 'be-4',
    jobRole: 'backend',
    category: 'APIs',
    difficulty: 'easy',
    questionText: 'Which HTTP status code signifies "201 Created"?',
    options: ['200', '201', '204', '301'],
    correctOptionIndex: 1,
    explanation: 'HTTP 201 indicates a resource was successfully created on the server.'
  },
  {
    id: 'be-5',
    jobRole: 'backend',
    category: 'Node.js',
    difficulty: 'medium',
    questionText: 'Which module in Node.js enables creating separate child processes to run CPU-heavy tasks?',
    options: ['cluster', 'child_process', 'fs', 'http'],
    correctOptionIndex: 1,
    explanation: 'child_process enables spawning subprocesses without blocking the primary event loop.'
  },
  {
    id: 'be-6',
    jobRole: 'backend',
    category: 'Databases',
    difficulty: 'medium',
    questionText: 'What is database indexing primarily used for?',
    options: [
      'Encrypting sensitive customer tables',
      'Speeding up data retrieval queries at the cost of additional storage and write speed',
      'Backing up database tables automatically',
      'Normalizing relational schemas'
    ],
    correctOptionIndex: 1,
    explanation: 'Indexes create data structures (like B-Trees) that allow fast lookup times for specific columns.'
  },
  {
    id: 'be-7',
    jobRole: 'backend',
    category: 'APIs',
    difficulty: 'easy',
    questionText: 'In REST API design, which HTTP method should be idempotent and replace a target resource entirely?',
    options: ['POST', 'PUT', 'PATCH', 'OPTIONS'],
    correctOptionIndex: 1,
    explanation: 'PUT replaces target resource representations fully and is idempotent.'
  },
  {
    id: 'be-8',
    jobRole: 'backend',
    category: 'Security',
    difficulty: 'medium',
    questionText: 'How should user passwords be stored securely in a database?',
    options: [
      'Encrypted with reversible AES-256',
      'Hashed using a salted algorithm like bcrypt or Argon2',
      'Encoded as Base64 strings',
      'Stored in plain text inside isolated private subnets'
    ],
    correctOptionIndex: 1,
    explanation: 'Passwords should be salted and hashed with robust slow algorithms (bcrypt/Argon2) to prevent rainbow table attacks.'
  },
  {
    id: 'be-9',
    jobRole: 'backend',
    category: 'Caching',
    difficulty: 'easy',
    questionText: 'Which in-memory key-value database is commonly used for caching and session management?',
    options: ['Redis', 'PostgreSQL', 'SQLite', 'MongoDB'],
    correctOptionIndex: 0,
    explanation: 'Redis provides lightning-fast in-memory storage ideal for caching sessions and data.'
  },
  {
    id: 'be-10',
    jobRole: 'backend',
    category: 'Databases',
    difficulty: 'medium',
    questionText: 'What distinguishes NoSQL databases from traditional Relational databases?',
    options: [
      'NoSQL databases lack index support',
      'NoSQL provides schema-flexible, non-tabular models optimized for scaling horizontally',
      'Relational databases cannot handle JSON documents',
      'NoSQL does not support transactions under any scenario'
    ],
    correctOptionIndex: 1,
    explanation: 'NoSQL offers flexible document/key-value schemas designed for horizontal scalability.'
  },
  {
    id: 'be-11',
    jobRole: 'backend',
    category: 'Architecture',
    difficulty: 'medium',
    questionText: 'What pattern isolates write operations from read queries in distributed services?',
    options: ['MVC', 'CQRS (Command Query Responsibility Segregation)', 'Pub/Sub', 'Monolith'],
    correctOptionIndex: 1,
    explanation: 'CQRS separates read and update data models for optimized scaling and throughput.'
  },
  {
    id: 'be-12',
    jobRole: 'backend',
    category: 'Security',
    difficulty: 'easy',
    questionText: 'What is a JSON Web Token (JWT) signature used for?',
    options: [
      'Encrypting payload data so client cannot read it',
      'Verifying the sender and ensuring payload was not tampered with in transit',
      'Auto-renewing database connection strings',
      'Compressing HTTP body payload size'
    ],
    correctOptionIndex: 1,
    explanation: 'The JWT signature validates message integrity and authenticity.'
  }
];

export const getQuestionsForSession = (
  role: string,
  difficulty: string,
  count: number
): Question[] => {
  // Filter matching role first
  let filtered = QUESTION_BANK.filter((q) => q.jobRole === role);

  // If specific difficulty requested and available
  const matchDifficulty = filtered.filter((q) => q.difficulty === difficulty);
  if (matchDifficulty.length >= count) {
    filtered = matchDifficulty;
  }

  // Fallback if question pool for exact difficulty is small: pad with remaining questions from same role
  if (filtered.length < count) {
    const fallback = QUESTION_BANK.filter((q) => q.jobRole !== role);
    filtered = [...filtered, ...fallback];
  }

  // Shuffle and pick unique set without repeating
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};