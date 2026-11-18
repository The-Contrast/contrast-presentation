export interface Product {
  id: string;
  index: string;
  badge: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  url?: string;
  accent?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'meetcard',
    index: '01',
    badge: 'App · Android & iPhone',
    name: 'MeetCard',
    tagline: 'Scan. Save. Connect.',
    description:
      'An AI-powered app that scans visiting cards, saves the contact and helps you follow up on WhatsApp, so no lead ever goes cold. Reads English, Hindi, Marathi, Tamil and more.',
    features: [
      'Several cards in one photo',
      'Multilingual card reading',
      'Typed or voice notes',
      'AI-written WhatsApp follow-ups',
      'Reminders and event tags',
      'Export to CSV or phone contacts',
    ],
    cta: 'Get MeetCard',
    url: 'https://meetcard.in',
    accent: true,
  },
  {
    id: 'communicator',
    index: '02',
    badge: 'Web app · 14 days free',
    name: 'Contrast Communicator',
    tagline: 'One inbox for every app you work in.',
    description:
      'Teams, Outlook, Gmail, Slack, WhatsApp, Telegram, Discord and Instagram in one list, with priorities, AI summaries and scheduled replies. Your messages stay encrypted with your own passphrase.',
    features: [
      'Automatic priority sorting',
      'AI summary of any long thread',
      'Schedule replies on every app',
      'Reminders and follow-ups',
      'Encrypted with your passphrase',
    ],
    cta: 'Start free for 14 days',
    url: 'https://teams-messenger-d97c9.web.app',
  },
  {
    id: 'software',
    index: '03',
    badge: 'Studio · Live',
    name: 'Custom Software & Apps',
    tagline: 'A senior product team that designs, builds, launches and owns it.',
    description:
      'Web, mobile and native apps for founders and businesses, from MVP to scale. Senior engineers from about $20/hour, with your repos, your cloud and your IP from day one.',
    features: ['Web & mobile development', 'MVP in weeks', 'UI/UX design', 'Dedicated team', 'Maintenance & support'],
    cta: 'Discuss my project',
  },
  {
    id: 'task',
    index: '04',
    badge: 'Product · Coming soon',
    name: 'Task Management App',
    tagline: 'Plan, assign and ship work the way a delivery team actually works.',
    description:
      'One workspace for tasks, sprints and accountability, built on the delivery practices we use for client projects. Early-access teams get the best terms.',
    features: ['Kanban boards & sprints', 'One owner, one due date', 'Burndown & status tracking', 'Slack · GitHub · Calendar'],
    cta: 'Request early access',
  },
  {
    id: 'academy',
    index: '05',
    badge: 'Academy · Admissions open',
    name: 'The Contrast Academy',
    tagline: 'Project-based courses, built by a real software company.',
    description:
      'Five-month programs where you work on live client tasks from week one, in small batches, with interview prep and placement support. Taught in English, Hindi and Marathi.',
    features: ['Full-Stack Development', 'UI/UX Design', 'Software Testing', 'Mobile App Development', 'Product & Project Management'],
    cta: 'Ask about courses',
  },
];

export const MC_STEPS = [
  { n: '01', title: 'Scan the card', text: 'Point, shoot. AI reads every field, even several cards in one photo.' },
  { n: '02', title: 'Add a note', text: 'Type or speak what you discussed. Voice is transcribed, the recording is deleted.' },
  { n: '03', title: 'AI writes the follow-up', text: 'Friendly, formal or short. Edit it, then send now or schedule it.' },
  { n: '04', title: 'Send and remind', text: 'Goes out on WhatsApp from your own number, with a reminder set.' },
];

export const MC_LANGS = ['English', 'हिन्दी', 'मराठी', 'தமிழ்', 'ಕನ್ನಡ', 'বাংলা'];

export const CM_APPS = ['Teams', 'Outlook', 'Gmail', 'Slack', 'WhatsApp', 'Telegram', 'Discord', 'Instagram'];

export const CM_FEATURES = [
  { icon: '01', title: 'Priority sorting', text: "Know who's blocked, who's waiting and what slipped, across Teams, Slack and mail." },
  { icon: '02', title: 'AI summaries', text: 'Back from a meeting? A long thread becomes what happened, what was decided and what waits on you.' },
  { icon: '03', title: 'Scheduled replies', text: 'Write now, send later as you, on Slack, Teams, Gmail, WhatsApp and more.' },
  { icon: '04', title: 'Private by design', text: 'Message content is encrypted with your passphrase. WhatsApp is read-only.' },
];

export const PROBLEMS = [
  {
    area: 'Events & sales',
    pain: 'Collecting cards is easy. Following up is the hard part.',
    detail: 'Cards pile up, details get typed by hand, and follow-ups happen late or not at all.',
    fix: 'MeetCard',
    fixLine: 'Scan, add a note, send a WhatsApp follow-up in minutes.',
    slide: 2,
  },
  {
    area: 'Teams & operations',
    pain: 'Your work lives in eight different apps.',
    detail: 'People get blocked, clients keep waiting and replies slip between Teams, Slack, mail and WhatsApp.',
    fix: 'Communicator',
    fixLine: 'One inbox, sorted by priority, with AI summaries and scheduled replies.',
    slide: 4,
  },
];

export const COMPARE = [
  { what: 'Hourly rate', them: '$100–$250', us: 'From $20, senior' },
  { what: 'Quotes', them: 'Often hidden', us: 'Clear, up front' },
  { what: 'Hand-offs', them: 'Several teams', us: 'One team, end to end' },
  { what: 'Lock-in', them: 'Common', us: 'Paid weekly, cancel anytime' },
  { what: 'Code & IP', them: 'Varies', us: 'Yours from day one' },
  { what: 'The team', them: 'Opaque', us: 'Visible, named' },
];

export const STATS = [
  { value: 2015, label: 'Building since', prefix: '', suffix: '', plain: true },
  { value: 320000, label: 'Live project hours', prefix: '', suffix: '+', plain: false },
  { value: 20, label: 'Companies served', prefix: '', suffix: '+', plain: false },
  { value: 100, label: 'End-to-end ownership', prefix: '', suffix: '%', plain: false },
];

export const MARQUEE = [
  'MeetCard',
  'Communicator',
  'Web Development',
  'Mobile Apps',
  'MVP Development',
  'UI/UX Design',
  'Dedicated Teams',
  'Academy',
];

export const WORK = [
  {
    name: 'VBSA',
    kind: 'Workforce & Operations',
    text: 'A CRM dashboard and field mobile app that replaced spreadsheets for manpower allocation and large-scale resource planning.',
    tags: ['CRM', 'Mobile'],
  },
  {
    name: 'Nova Mark',
    kind: 'Digital Exam Evaluation',
    text: 'An evaluation-management platform that streamlines answer-paper checking and evaluator workflows for institutions.',
    tags: ['EdTech', 'Platform'],
  },
  {
    name: 'The 3-20 Way',
    kind: 'Mobility for Older Adults',
    text: 'A website and mobile app that helps older adults build mobility and strength through simple, guided daily routines.',
    tags: ['Health', 'Web + App'],
  },
];

export const WHY = [
  { title: 'No hidden quotes', text: 'Transparent weekly billing. Cancel anytime.' },
  { title: 'No hand-offs', text: 'The team that plans it is the team that builds and runs it.' },
  { title: 'No lock-in', text: 'Your repos, your cloud, your IP from day one.' },
  { title: 'Real team, visible', text: 'You know who is working on your product and what they are doing.' },
];

export const STEPS = [
  { n: '01', title: 'Listen first', text: 'We understand your goal, users and constraints before suggesting anything.' },
  { n: '02', title: 'Plan with clarity', text: 'Scope, timeline and cost laid out plainly, with no surprises later.' },
  { n: '03', title: 'Build with ownership', text: 'Senior engineers, weekly demos, code that is yours from the first commit.' },
  { n: '04', title: 'Support beyond launch', text: 'We stay on for maintenance, scaling and the next version.' },
];

export const INTERESTS = [
  { id: 'meetcard', label: 'MeetCard' },
  { id: 'communicator', label: 'Communicator' },
  { id: 'software', label: 'Custom software / app' },
  { id: 'task', label: 'Task Management app' },
  { id: 'academy', label: 'Academy course' },
  { id: 'other', label: 'Something else' },
];

export const BUDGETS = ['Not sure yet', 'Under $2,000', '$2,000 – $10,000', '$10,000 – $50,000', '$50,000+'];
export const TIMELINES = ['Just exploring', 'Within 1 month', '1 – 3 months', '3+ months'];
