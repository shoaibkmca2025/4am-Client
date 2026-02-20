
import { Service, Client, NavItem, Article, Project } from './types';

declare global {
  interface Window {
    aistudio?: any;
  }
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Quantum Nexus",
    category: "Website & App Development",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2564&auto=format&fit=crop",
    description: "Enterprise-grade blockchain middleware for secure data synchronization.",
    challenge: "Developing a low-latency system that could handle 10k+ concurrent transactions while maintaining 100% data integrity across decentralized nodes.",
    solution: "We engineered a custom Rust-based consensus layer and a React-powered monitoring dashboard that reduced processing overhead by 60%.",
    technologies: ["Rust", "React", "Node.js", "AWS"]
  },
  {
    id: 2,
    title: "Vanguard Growth",
    category: "Paid Ads & Lead Generation",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "Multi-channel ROAS optimization for a global FinTech disruptor.",
    challenge: "The client was seeing diminishing returns on Meta and Google Ads, with customer acquisition costs (CAC) rising by 40% year-over-year.",
    solution: "We implemented an AI-driven attribution model and a viral content strategy that pivoted on user-generated content, slashing CAC by 55%.",
    technologies: ["Meta Ads", "Google Analytics", "AI Copywriting", "SEO"]
  },
  {
    id: 3,
    title: "Aura Commerce",
    category: "Branding & Creative",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    description: "A luxury fashion marketplace with integrated AR try-on features.",
    challenge: "High return rates due to customers misjudging fit and style during online shopping.",
    solution: "Created a React Native app with Spark AR integration allowing real-time virtual try-ons, increasing conversion rates by 22%.",
    technologies: ["React Native", "Three.js", "Spark AR", "Firebase"]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Algorithmic Shift: Marketing in 2025',
    excerpt: 'How proprietary AI models are replacing traditional SEO strategies in the battle for the top spot.',
    content: 'The digital landscape is no longer just about keywords; it is about intent and context. At 4AM Global Media, we have seen a 300% increase in efficiency when moving from traditional SEO to LLM-optimized content frameworks...',
    author: 'Sarah Devlin',
    date: 'Jan 15, 2024',
    category: 'Marketing',
    readTime: '6 min read',
  },
  {
    id: '2',
    title: 'Scaling from Zero to 1M Users',
    excerpt: 'A technical blueprint for architects building the next generation of SaaS platforms.',
    content: 'Scaling isn\'t just about bigger servers; it\'s about smarter code. This article dives into the exact stack we use at our software company to ensure horizontal scalability from day one...',
    author: 'David Zhang',
    date: 'Feb 02, 2024',
    category: 'Technology',
    readTime: '10 min read',
  },
  {
    id: '3',
    title: 'Immersion: The Future of Interaction',
    excerpt: 'Why AR and VR motion graphics are becoming the standard for enterprise storytelling.',
    content: 'AR and VR motion graphics integrate animation into immersive environments, enhancing user interaction and realism. By combining motion with augmented or virtual spaces, designers can guide attention, tell stories, and create experiences that feel dynamic...',
    author: 'Leo Sterling',
    date: 'March 10, 2024',
    category: 'Immersive',
    readTime: '8 min read',
  }
];

export const SERVICES: Service[] = [
  {
    id: 'development',
    title: 'Software & App Engineering',
    description: 'High-performance digital products engineered for extreme scale, sub-1ms speed, and high-ticket conversion.',
    icon: 'code',
    longDescription: 'We dont just build websites; we engineer revenue-generating assets. Our development philosophy is rooted in "Stateless Architecture"—ensuring your platform remains lightning-fast regardless of user load. We bridge the gap between complex backend logic and intuitive, world-class user interfaces.',
    methodology: 'Agile Modular Framework: We break complex software into secure, independent micro-modules that allow for rapid deployment and easy horizontal scaling without downtime.',
    features: [
      'Custom React/Next.js Web Applications',
      'Native iOS & Android Mobile Engineering',
      'Scalable SaaS Infrastructure Architecture',
      'High-Performance E-commerce Engines',
      'Enterprise API Design & Integration',
      'Web3 & Blockchain Middleware'
    ],
    outcomes: [
      '99.9% Core System Uptime',
      '40% Reduction in Technical Debt',
      'Sub-2s Page Load Performance',
      'Optimized Security Protocols'
    ]
  },
  {
    id: 'social',
    title: 'Social Media Domination',
    description: 'Strategic brand presence and high-end content production that drives market authority and viral engagement.',
    icon: 'share-2',
    longDescription: 'Social media is no longer about posting; it is about psychological positioning. We use "Attention-First" strategies to ensure your brand isn’t just seen, but remembered. We produce cinematic-quality content that signals elite status to your target audience.',
    methodology: 'The Narrative Loop: We create content cycles that build trust over 7 unique touchpoints, transforming passive scrollers into high-intent leads through authority-driven storytelling.',
    features: [
      'Cinematic Content Production (Reels/TikTok)',
      'Brand Identity & Voice Development',
      'Influencer & Creator Management',
      'High-Growth Community Building',
      'Social Sentiment Data Analysis',
      'Viral Hook Engineering'
    ],
    outcomes: [
      '300% Average Engagement Growth',
      'Primary Authority Positioning',
      'Sustainable Organic Reach',
      'High-Intent Lead Generation'
    ]
  },
  {
    id: 'ads',
    title: 'Performance Paid Ads',
    description: 'ROI-focused performance marketing that converts traffic into consistent, scalable revenue streams.',
    icon: 'zap',
    longDescription: 'We approach paid ads as a pure engineering problem. By treating every dollar spent as a data point, we ruthlessly optimize for Return on Ad Spend (ROAS). We handle the full funnel—from cold interest to high-frequency retargeting.',
    methodology: 'High-Velocity Testing (HVT): We deploy dozens of ad variations simultaneously to identify winning variables within 48 hours, allowing us to scale profitable campaigns with surgical precision.',
    features: [
      'Meta & Instagram Ads Scaling',
      'Google Search & Display Mastery',
      'High-Ticket YouTube Ad Funnels',
      'Precision Retargeting Frameworks',
      'Dynamic Creative Optimization',
      'Advanced Attribution Tracking'
    ],
    outcomes: [
      'Guaranteed ROAS Improvement',
      'Scalable Daily Lead Volume',
      'Reduced Customer Acquisition Cost (CAC)',
      'Predictable Revenue Growth'
    ]
  },
  {
    id: 'seo',
    title: 'SEO & Topical Authority',
    description: 'Long-term organic growth frameworks that establish your brand as the definitive leader in your category.',
    icon: 'search',
    longDescription: 'Modern SEO isn’t about keywords; it’s about becoming the "Topical Authority." We build semantic content ecosystems that search engines cannot ignore. We focus on ranking for the high-intent queries that actually drive revenue, not just vanity traffic.',
    methodology: 'Semantic Hub-and-Spoke: We build massive "Pillar Pages" supported by deep-dive clusters, signaling to search engines that your brand is the definitive expert in your niche.',
    features: [
      'Technical SEO Infrastructure Audits',
      'Semantic Search Content Strategy',
      'High-Authority Link Acquisition',
      'AI-Driven Market Intent Mapping',
      'Local & Global SERP Domination',
      'Content Velocity Scaling'
    ],
    outcomes: [
      'Rank 1 for High-Intent Queries',
      'Consistent Organic Traffic Flow',
      'Reduced Long-Term Ad Spend',
      'Compound Market Influence'
    ]
  },
  {
    id: 'creative',
    title: 'Branding & Visual Identity',
    description: 'Premium visual design and creative direction that positions your brand for undisputed market leadership.',
    icon: 'palette',
    longDescription: 'Visuals speak before words. We design "Signal-Heavy" identities—visual systems that immediately communicate high value and technical competence. Our designs are built to look futuristic, clean, and authoritative across all digital nodes.',
    methodology: 'Cognitive Branding: We use color theory and spatial design to evoke specific emotional responses that align with your business objectives and audience psychology.',
    features: [
      'High-End Logo & Identity Design',
      'UI/UX Design Systems (Figma)',
      'Motion Graphics & AR Assets',
      'Brand Style Guides & Typography',
      'Marketing Collateral Creation',
      'Futuristic UI Elements'
    ],
    outcomes: [
      'Instant Brand Recognition',
      'High-End Market Positioning',
      'Cohesive Visual Ecosystem',
      'Enhanced User Trust Scores'
    ]
  }
];

export const CLIENTS: Client[] = [
  { id: 1, name: "Nexus Labs", url: "#" },
  { id: 2, name: "Growth Corp", url: "#" },
  { id: 3, name: "Innovate AI", url: "#" },
  { id: 4, name: "Cloud Tech", url: "#" }
];
