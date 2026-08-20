export interface Project {
  name: string;
  tagline: string;
  role: string;
  stack: string[];
  highlights: string[];
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface TimelineEntry {
  title: string;
  org: string;
  period: string;
  points: string[];
}

export const profile = {
  name: 'Aritra Datta',
  headline: 'Senior Full-Stack Developer',
  tags: ['Angular', 'Node.js', 'AI-Native Development'],
  location: 'Kolkata, India',
  email: 'aritradatta0@gmail.com',
  phone: '+91 8016685983',
  linkedin: 'https://www.linkedin.com/in/aritra-datta-584468229',
  github: 'https://github.com/aritradatta0',
  summary: `4.5 years of building and scaling production applications with Angular and Node.js,
    including platforms serving 300K+ users. Currently part of an AI-first R&D team shipping
    full-stack products end-to-end through agentic AI development.`,
  stats: [
    { value: '4.5+', label: 'years of experience' },
    { value: '300K+', label: 'users on platforms I build' },
    { value: '~10', label: 'AI-built apps in 6 months' },
  ],
} as const;

export const aboutStory = [
  `I spent four years going deep on Angular — from v9 to v21, through SSR, signals and
   everything in between — while building Node.js backends for real products: payments,
   real-time systems, background jobs, search.`,
  `Then my company created an AI-first R&D team with one rule: not a single line of code
   written by hand. For the past six months I have been directing agentic AI to ship
   NestJS, React and React Native apps — validating every line against fundamentals
   I learned the long way.`,
  `That combination — deep framework knowledge plus AI-native delivery speed — is what
   I bring to a team.`,
];

export const projects: Project[] = [
  {
    name: 'Blue Tees Golf',
    tagline: 'Large-scale consumer product platform',
    role: 'Senior Full-Stack Developer',
    stack: ['Angular 20', 'Node.js', 'MongoDB', 'Socket.io', 'OpenAI', 'AWS S3'],
    highlights: [
      'Platform serving 300K+ users with real-time data features over Socket.io',
      'Replaced inefficient queries with MongoDB Atlas Search, significantly cutting response times',
      '“Scout AI” golf prediction via OpenAI prompt workflows, plus dual-provider text-to-speech',
    ],
  },
  {
    name: 'Commission.gg',
    tagline: 'Digital marketplace for artists',
    role: 'Backend-heavy Full-Stack Developer',
    stack: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'PayPal', 'Cloudflare R2'],
    highlights: [
      'Designed the entire backend architecture from scratch',
      'Milestone-based commission system with an escrow-style payment flow',
      'Real-time chat, push notifications and scheduled jobs',
    ],
  },
  {
    name: 'Gold Reliance',
    tagline: 'Online jewellery buying & selling platform',
    role: 'Full-Stack Developer',
    stack: ['Angular 18', 'Node.js', 'Firebase', 'FedEx API', 'Chart.js'],
    highlights: [
      'Jewellery listings with live gold-value tracking and trend charts',
      'FedEx integration for shipments, return labels and generated PDFs',
      'Web push notifications via Angular Service Worker',
    ],
  },
  {
    name: 'AI-First R&D',
    tagline: '~10 apps shipped by directing AI agents',
    role: 'All-Stack AI Developer',
    stack: ['OpenAI Codex', 'Figma MCP', 'NestJS', 'React', 'React Native', 'GitHub Actions'],
    highlights: [
      'Company mandate: zero hand-written code — everything built through agentic AI workflows',
      'Figma designs converted straight to production frontends via Figma MCP',
      'AI-assisted QA and DevOps: Playwright, Maestro, automated TestFlight pipelines',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    skills: ['Angular (v9–v21)', 'TypeScript', 'RxJS', 'Signals', 'SSR', 'Angular Material', 'HTML5', 'CSS3', 'Chart.js'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express', 'MongoDB', 'Atlas Search', 'REST APIs', 'Socket.io', 'Agenda', 'OpenAI APIs'],
  },
  {
    label: 'AI-Native',
    skills: ['OpenAI Codex', 'Figma MCP', 'Prompt-driven development', 'NestJS', 'React', 'React Native', 'Playwright', 'Maestro'],
  },
  {
    label: 'Cloud & Tools',
    skills: ['AWS S3', 'Cloudflare R2', 'Firebase', 'Stripe', 'PayPal', 'FedEx API', 'GitHub Actions', 'Git', 'Jira'],
  },
];

export const timeline: TimelineEntry[] = [
  {
    title: 'R&D — AI-First Development',
    org: 'Webskitters Technology Solutions',
    period: 'Feb 2026 — Present',
    points: [
      'Selected into the R&D team operating under a 100% AI-generated-code mandate',
      'Shipped ~10 applications across NestJS, React and React Native by directing agentic AI',
    ],
  },
  {
    title: 'Senior Application Developer',
    org: 'Webskitters Technology Solutions',
    period: 'Feb 2022 — Present',
    points: [
      'Full-stack development of production Angular + Node.js platforms',
      'Real-time systems, payment workflows, background jobs and API optimization at 300K+ user scale',
    ],
  },
  {
    title: 'B.Tech, Computer Science & Engineering',
    org: 'JIS College of Engineering',
    period: '2015 — 2019',
    points: [],
  },
];
