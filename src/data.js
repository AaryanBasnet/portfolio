export const profile = {
  name: 'Aaryan',
  title: 'Full-Stack Software Engineer',
  location: 'Kathmandu, Nepal',
  email: 'basnetaryan1011@gmail.com',
  stack: 'MERN / Flutter / AI Systems',
  eyebrow: 'Portfolio // Computing & Design',
  heroImage: '/profile.jpg',
  social: {
    github: 'https://github.com/AaryanBasnet',
    linkedin: 'https://www.linkedin.com/in/aaryan-basnet-4511a22a4/',
  },
  stats: [
    { num: '15+', label: 'Projects Developed' },
    { num: '3+', label: 'Years Building' },
    { num: '2026', label: 'Graduating' },
  ],
  tagline: 'Crafting scalable full-stack applications and intelligent AI systems. From sleek web interfaces to LLM-powered virtual assistants.',
};

export const projects = [
  {
    id: '01',
    category: 'Web',
    title: 'CROWNHOUR',
    subtitle: 'Luxury Watch E-Commerce',
    description: 'A full-stack MERN luxury watch platform featuring product browsing, cart, checkout, order tracking, and a comprehensive admin dashboard for inventory and analytics.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    link: 'https://github.com/AaryanBasnet/CrownHourProject',
    image: '/projects/crownhour.png',
    role: 'Full-stack development, product UI, admin workflows',
    problem: 'Luxury shoppers need a polished storefront while store owners need one place to manage inventory, orders, and customer activity.',
    highlights: [
      'Built product browsing, cart, checkout, order tracking, and authentication flows.',
      'Created an admin dashboard for inventory control, order management, and analytics.',
      'Designed a premium visual direction to match the luxury watch category.',
    ],
  },
  {
    id: '02',
    category: 'Web',
    title: 'VENURE WEB',
    subtitle: 'Venue Booking Platform',
    description: 'A React frontend for discovering and booking event venues. Includes advanced filters, multi-step booking flows, and an owner dashboard for managing listings and bookings.',
    tech: ['React', 'Tailwind', 'Redux'],
    link: 'https://github.com/AaryanBasnet/venure-frontend',
    image: '/projects/venure.png',
    role: 'Frontend development and booking flow design',
    problem: 'Event customers need to compare venues quickly, while venue owners need a clean way to manage listings and booking requests.',
    highlights: [
      'Built searchable venue discovery with filters for category, location, and availability.',
      'Designed a multi-step booking experience to reduce user confusion.',
      'Implemented owner-facing listing and booking management screens.',
    ],
  },
  {
    id: '03',
    category: 'Mobile',
    title: 'VENURE APP',
    subtitle: 'Mobile Venue Booking',
    description: 'A Flutter mobile app featuring MVVM architecture, offline storage with Hive, and Bloc for state management. Users can search venues, save favorites, and manage bookings on the go.',
    tech: ['Flutter', 'Dart', 'Bloc', 'Hive'],
    link: 'https://github.com/AaryanBasnet/venureapp',
    image: '/projects/venure_app.png',
    role: 'Mobile app architecture and feature development',
    problem: 'Venue browsing and booking needed a mobile-first experience that stays fast and usable across common user journeys.',
    highlights: [
      'Structured the app with MVVM and Bloc for predictable state management.',
      'Used Hive for local/offline storage of favorites and user data.',
      'Built mobile flows for search, venue details, saved venues, and bookings.',
    ],
  },
  {
    id: '04',
    category: 'AI',
    title: 'TIA VIRTUAL ASSISTANT',
    subtitle: 'Multilingual Helpdesk',
    description: 'A virtual helpdesk for Tribhuvan International Airport supporting English and Nepali. Powered by RAG, LangGraph, and Ollama to answer FAQs and provide real-time flight status.',
    tech: ['LangGraph', 'ChromaDB', 'Ollama', 'Python'],
    link: 'https://github.com/AaryanBasnet/TARA',
    image: '/projects/tara.png',
    role: 'AI system design, RAG pipeline, backend prototyping',
    problem: 'Airport passengers often need fast answers in both English and Nepali, but airport information is scattered across FAQs and live status sources.',
    highlights: [
      'Designed a RAG pipeline using ChromaDB for airport FAQ retrieval.',
      'Used LangGraph/ReAct-style agent flow to handle user questions and tool calls.',
      'Added bilingual support for English and Nepali airport assistance.',
    ],
  },
  {
    id: '05',
    category: 'Web',
    title: 'SWEETNEST',
    subtitle: 'Custom Cake Platform',
    description: 'A complete ordering system featuring interactive 3D cake customization, eSewa payments, loyalty rewards, and a secure Node.js/MongoDB backend.',
    tech: ['React', 'Three.js', 'Zustand', 'Express', 'MongoDB'],
    link: 'https://github.com/AaryanBasnet/SweetNestFrontend',
    image: '/projects/sweetnest.png',
    role: 'Full-stack development, 3D customization, payment integration',
    problem: 'Custom cake ordering needs to feel visual and flexible, while the business needs secure payments, order tracking, and customer retention features.',
    highlights: [
      'Built an interactive cake ordering experience with 3D customization.',
      'Integrated eSewa payments, loyalty rewards, and secure backend APIs.',
      'Created state-managed ordering flows with React, Zustand, Node.js, and MongoDB.',
    ],
  }
];

export const skills = [
  {
    title: 'Frontend',
    items: ['React', 'Tailwind CSS', 'Zustand / Redux', 'Framer Motion'],
  },
  {
    title: 'Backend',
    items: ['Node.js / Express', 'Python', 'RESTful APIs', 'JWT Auth', 'eSewa Integration'],
  },
  {
    title: 'Mobile & AI',
    items: ['Flutter & Dart', 'LangGraph / LangChain', 'ChromaDB (RAG)', 'Ollama / LLMs', 'Bloc State Mgmt'],
  },
  {
    title: 'Database & Tools',
    items: ['MongoDB / Mongoose', 'PostgreSQL', 'Git / GitHub', 'Postman', 'Figma'],
  },
];

export const timeline = [
  {
    date: '2023 - 2026',
    role: 'BSc (Hons) Computing',
    org: 'Softwarica College / Coventry University',
    desc: 'Currently pursuing my degree with a focus on full-stack development and AI systems. Thesis project: a multilingual virtual assistant for Tribhuvan International Airport using LangGraph ReAct agents and ChromaDB RAG.',
  },
  {
    date: '2023 - Present',
    role: 'Full-Stack Developer',
    org: 'Independent Projects',
    desc: 'Built comprehensive platforms like CrownHour (luxury e-commerce), Venure (event management system), and SweetNest (3D cake customization), handling everything from UI/UX design to robust backend architecture.',
  },
];

export const marqueeItems = [
  'Full-Stack Engineering',
  'React',
  'Flutter & Dart',
  'LLM & RAG Systems',
  'Node.js & Express',
  'MongoDB Aggregation',
  'Figma Design Systems',
];

export const filters = ['All', 'Web', 'Mobile', 'AI'];
