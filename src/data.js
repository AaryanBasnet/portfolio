export const profile = {
  name: 'Aaryan',
  title: 'Full-Stack Developer',
  location: 'Kathmandu, Nepal',
  email: 'basnetaryan1011@gmail.com',
  stack: 'MERN / Flutter / AI Systems',
  heroImage: '/profile.jpg',
  consoleSite: 'https://khel.aaryanbasnet.com.np',
  social: {
    github: 'https://github.com/AaryanBasnet',
    linkedin: 'https://www.linkedin.com/in/aaryan-basnet-4511a22a4/',
  },
  stats: [
    { num: '15+', label: 'Projects Developed' },
    { num: '3+', label: 'Years Building' },
    { num: '2026', label: 'Graduated' },
  ],
  tagline: "Three years of building things solo, most recently a bilingual chatbot that helps travelers navigate Kathmandu's airport in English or Nepali.",
};

export const projects = [
  {
    id: '01',
    category: 'Web',
    title: 'VENURE WEB',
    subtitle: 'Venue Booking Platform',
    description: 'A React frontend for discovering and booking event venues. Includes advanced filters, multi-step booking flows, and an owner dashboard for managing listings and bookings.',
    tech: ['React', 'Tailwind', 'Redux'],
    link: 'https://github.com/AaryanBasnet/venure-frontend',
    website: 'https://venure-frontend.vercel.app/',
    image: '/projects/venure.png',
    role: 'Frontend development and booking flow design',
    year: '2024',
    overview: 'Event customers need to compare venues quickly, and venue owners need a clean way to manage listings and booking requests. This React frontend handles both sides, with venue discovery through advanced filters, a multi-step booking flow for customers, and an owner dashboard for managing listings and bookings.',
    images: [
      { src: '/projects/venure.png', caption: 'Landing page for venue discovery and search' },
    ],
  },
  {
    id: '02',
    category: 'Mobile',
    title: 'VENURE APP',
    subtitle: 'Mobile Venue Booking',
    description: 'A Flutter venue-booking app built on Clean Architecture and Bloc, with biometric-gated Stripe payments and a shake-to-logout gesture on the profile screen.',
    tech: ['Flutter', 'Dart', 'Bloc', 'Hive', 'Stripe'],
    link: 'https://github.com/AaryanBasnet/venureapp',
    website: '#',
    image: '/projects/venure_app_home.png',
    role: 'Mobile app architecture: Clean Architecture, MVVM, and Bloc state management',
    year: '2025',
    overview: 'Venue booking needed to feel fast and secure on mobile. Built on Clean Architecture with MVVM and Bloc, with Hive for offline caching and a REST/JWT backend. Two details worth noting: a shake-to-logout gesture on the profile screen, and biometric authentication gating every Stripe payment.',
    images: [
      { src: '/projects/venure_app_home.png', caption: 'Home screen with featured venues and quick search' },
      { src: '/projects/venure_app_details.png', caption: 'Venue details: amenities, pricing, and booking entry' },
      { src: '/projects/venure_app_biometric.png', caption: 'Biometric authentication required before booking confirmation' },
      { src: '/projects/venure_app_stripe.png', caption: 'Stripe payment sheet for secure checkout' },
    ],
  },
  {
    id: '03',
    category: 'Web',
    title: 'SWEETNEST',
    subtitle: 'Custom Cake Platform',
    description: 'A complete ordering system featuring interactive 3D cake customization, eSewa payments, loyalty rewards, and a secure Node.js/MongoDB backend.',
    tech: ['React', 'Three.js', 'Zustand', 'Express', 'MongoDB'],
    link: 'https://github.com/AaryanBasnet/SweetNestFrontend',
    website: '#',
    image: '/projects/sweetnest.png',
    role: 'Full-stack development, 3D customization, payment integration',
    year: '2025',
    overview: 'Custom cake ordering needs to feel visual and flexible, and the business needs secure payments, order tracking, and customer retention. SweetNest covers both, pairing interactive 3D cake customization on the front end with eSewa payments, loyalty rewards, and a secure Node.js/MongoDB backend.',
    images: [
      { src: '/projects/sweetnest.png', caption: 'Cake product page with pricing and customization entry point' },
    ],
  },
  {
    id: '04',
    category: 'Web',
    title: 'CROWNHOUR',
    subtitle: 'Luxury Watch E-Commerce',
    description: 'A full-stack MERN luxury watch platform featuring product browsing, cart, checkout, order tracking, and a comprehensive admin dashboard for inventory and analytics.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    link: 'https://github.com/AaryanBasnet/CrownHourProject',
    website: '#',
    image: '/projects/crownhour.png',
    role: 'Full-stack development, product UI, admin workflows',
    year: '2024',
    overview: 'Luxury shoppers need a polished storefront, and store owners need one place to manage inventory, orders, and customer activity. CrownHour is a full-stack MERN platform covering both sides, from product browsing, cart, checkout, and order tracking on the front end to an admin dashboard for inventory and analytics on the back end.',
    images: [
      { src: '/projects/crownhour.png', caption: 'Product landing page with live pricing and checkout entry points' },
    ],
  },
  {
    id: '05',
    category: 'AI',
    thesis: true,
    title: 'TIA VIRTUAL ASSISTANT',
    subtitle: 'Multilingual Helpdesk',
    description: 'A virtual helpdesk for Tribhuvan International Airport supporting English and Nepali. Powered by RAG, LangGraph, and Ollama to answer FAQs and provide real-time flight status.',
    tech: ['LangGraph', 'ChromaDB', 'Ollama', 'Python'],
    link: 'https://github.com/AaryanBasnet/TARA',
    website: '#',
    image: '/projects/tara.png',
    role: 'AI system design, RAG pipeline, backend prototyping',
    year: '2026',
    overview: 'Airport passengers often need fast answers in both English and Nepali, but that information is scattered across FAQs and live status sources. This virtual helpdesk for Tribhuvan International Airport brings it into one place, using RAG, LangGraph, and Ollama to answer questions and pull real-time flight status.',
    images: [
      { src: '/projects/tara.png', caption: 'Chat interface with quick actions and live flight/weather widgets' },
    ],
  },
  {
    id: '06',
    category: 'UI/UX',
    title: 'SWEETNEST UI',
    subtitle: 'E-Commerce UI/UX Design',
    description: 'A full UI/UX design for the SweetNest cake platform in Figma, covering the homepage, product browsing, an interactive cake configurator, and cart/checkout, built on a shared type scale and color system.',
    tech: ['Figma', 'UI/UX Design', 'Design System'],
    website: 'https://www.figma.com/design/xVrn8fXcfSCIHA7HmQT497/SwwetNest--UI-Final?m=auto&t=4k3WbZsyrRreexam-6',
    websiteLabel: 'View in Figma',
    image: '/projects/sweetnest_ui_configurator.png',
    role: 'UI/UX design: full e-commerce flow, design system',
    year: '2025',
    overview: 'The end-to-end UI/UX design for the SweetNest cake platform, built in Figma. It covers a homepage and product catalog, an interactive cake configurator for choosing size, flavor, color, and toppers, and a full cart-to-checkout flow, all built on a shared type scale and color system.',
    images: [
      { src: '/projects/sweetnest_ui_home.png', caption: 'Homepage: hero, featured collections, and brand story' },
      { src: '/projects/sweetnest_ui_shop.png', caption: 'Product catalog with filters and collections' },
      { src: '/projects/sweetnest_ui_configurator.png', caption: 'Interactive cake configurator: size, flavor, color, and toppers' },
      { src: '/projects/sweetnest_ui_cart.png', caption: 'Cart and order summary' },
    ],
  }
];

export const currentProject = {
  title: 'RIPE',
  subtitle: 'Solo Game Dev Project',
  status: 'In Progress',
  description: 'A tomato farming simulator built solo in Godot 4 / GDScript. Currently building out shop UI architecture, inventory systems, and terrain/texture systems. Still in active development. Not yet released.',
  tech: ['Godot 4', 'GDScript'],
  media: [
    { label: 'Shop UI', src: null },
    { label: 'Terrain', src: null },
    { label: 'Shaders', src: null },
    { label: 'Drone Enemies', src: null },
  ],
};

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
    role: 'BSc (Hons) Computing, First Class Honours',
    org: 'Softwarica College / Coventry University',
    desc: 'Focused on full-stack development and AI systems. Thesis: a multilingual virtual assistant for Tribhuvan International Airport using LangGraph ReAct agents and ChromaDB RAG.',
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

export const filters = ['All', 'Web', 'Mobile', 'AI', 'UI/UX'];
