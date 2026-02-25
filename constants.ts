
import { Service, Client, NavItem, Article, Project } from './types';

declare global {
  interface Window {
    aistudio?: any;
  }
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/', sectionId: 'services' },
  { label: 'About', href: '/', sectionId: 'about' },
  { label: 'Work', href: '/', sectionId: 'projects' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/', sectionId: 'contact' },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Death of the Traditional Funnel: Why Mesh Networks are Winning',
    excerpt: 'Linear funnels are bleeding efficiency. Learn how decentralized touchpoints create higher-velocity conversion loops in 2024.',
    content: `The traditional marketing funnel is dead. The linear path from awareness to consideration to conversion no longer reflects how modern B2B buyers make decisions. In today's hyper-fragmented digital landscape, buyers are interacting with brands across dozens of touchpoints simultaneously, often in a non-linear fashion.

This shift requires a new mental model: the Mesh Network. Instead of forcing users down a rigid path, successful brands are building ecosystems of content and engagement that allow users to self-educate and convert on their own terms.

Key Components of a Mesh Network Strategy:
1.  **Decentralized Content Nodes:** Distribute high-value content across multiple platforms (LinkedIn, YouTube, X, Newsletters) rather than gating everything behind a landing page.
2.  **Signal-Based Retargeting:** Use engagement data from one node to trigger relevant messaging in another, creating a cohesive narrative without forcing a linear journey.
3.  **Community-Led Growth:** Empower your existing customers to become advocates, creating a self-reinforcing loop of social proof and referral.

By adopting a Mesh Network approach, brands can reduce CAC, increase LTV, and build deeper resilience against algorithm changes on any single platform.`,
    author: 'Alex V.',
    date: 'Oct 12, 2024',
    category: 'Strategy',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'AI-Native SEO: dominating the generative search era',
    excerpt: 'Google SGE is changing the game. We break down the new ranking factors for AI-driven search results.',
    content: `Search Engine Optimization (SEO) is undergoing its biggest transformation in two decades. With the rise of Generative AI in search results (like Google's SGE), the goal is no longer just to rank for keywords, but to be cited as a source of truth by the AI models themselves.

This shift demands a fundamental rethink of content strategy. "SEO content" stuffed with keywords is being de-prioritized in favor of deep, authoritative content that demonstrates genuine expertise and unique perspective.

How to Win in the Age of Generative Search:
1.  **Focus on Information Gain:** Create content that adds new data, original research, or unique viewpoints to the conversation. AI models prioritize sources that provide information not found elsewhere.
2.  **Optimize for Entities, Not Just Keywords:** Ensure your brand and key concepts are clearly defined and linked within the Knowledge Graph.
3.  **Prioritize E-E-A-T:** Experience, Expertise, Authoritativeness, and Trustworthiness are more critical than ever. Showcase your authors' credentials and cite primary sources.

The future of search belongs to brands that can effectively communicate their expertise to both humans and machines.`,
    author: 'Sarah J.',
    date: 'Oct 08, 2024',
    category: 'Technical',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Visual Capital: Why Design is the Highest-Leverage Asset',
    excerpt: 'In a noise-saturated market, premium visual identity is the only way to signal competence instantly.',
    content: `We live in the attention economy, but most brands are bankrupt when it comes to visual capital. In a world where users scroll past thousands of messages a day, design is the primary filter they use to judge credibility.

Visual Capital is the accumulated trust and authority your brand commands through its aesthetic presentation. A high-quality visual identity signals competence, attention to detail, and market leadership before a single word is read.

The ROI of Premium Design:
1.  **Instant Trust:** Users form an opinion about a website in 50 milliseconds. Premium design buys you the time to deliver your message.
2.  **Price Elasticity:** Brands that look expensive can charge more. Visuals anchor price expectations.
3.  **Talent Attraction:** Top talent wants to work for winning companies. Your visual identity tells them if you're a leader or a follower.

Investing in visual capital isn't an expense; it's a leverage multiplier for every other marketing dollar you spend.`,
    author: 'David K.',
    date: 'Sep 28, 2024',
    category: 'Design',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop'
  }
];

export const PROJECTS: Project[] = [
  { id: 1, title: "Joker Media", category: "Client Website", url: "https://jokermedia.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 2, title: "Silver Thatch Pensions", category: "Client Website", url: "https://silverthatch.org.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 3, title: "Century Boats", category: "Client Website", url: "https://centuryboats.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 4, title: "Greendale Physical Therapy", category: "Client Website", url: "https://greendalept.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 5, title: "RussellsOrlando", category: "Client Website", url: "https://russellsorlando.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 6, title: "Rolly Polly", category: "Client Website", url: "https://rolypoly.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 7, title: "Verdant Isle Pension Plan", category: "Client Website", url: "https://verdantisle.org.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 8, title: "SCCOOS", category: "Client Website", url: "https://sccoos.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 9, title: "GCOOS", category: "Client Website", url: "https://gcoos.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 10, title: "CeNCOOS", category: "Client Website", url: "https://www.cencoos.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 11, title: "SDRP", category: "Client Website", url: "https://sarasotadolphin.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 12, title: "Alan Smith Pool Plastering & Remodeling", category: "Client Website", url: "https://alansmithpools.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 13, title: "The Back Porch Mulberry", category: "Client Website", url: "https://thebackporchmulberry.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 14, title: "Hogan’s Place Gibsonton Florida", category: "Client Website", url: "https://hogansplacegibsontonflorida.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 15, title: "DMS Broadcasting", category: "Client Website", url: "https://dmsbroadcasting.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 16, title: "CS Roofing Company", category: "Client Website", url: "https://csroofingcompany.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 17, title: "DeBartolo Longevity University", category: "Client Website", url: "https://www.debartololongevitymetauniversity.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 18, title: "Gutter Guards Direct", category: "Client Website", url: "https://www.gutterguardsdirect.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 19, title: "CoachManTahoe", category: "Client Website", url: "https://coachmantahoe.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 20, title: "Nashua Glass", category: "Client Website", url: "https://nashuaglass.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 21, title: "Creative Concrete Inc", category: "Client Website", url: "https://www.creativeconcreteinc.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 22, title: "This Sold House", category: "Client Website", url: "https://thissoldhouseinc.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 23, title: "Orlando Hand Surgery Associates", category: "Client Website", url: "https://orlandohandsurgery.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 24, title: "LakeShoreGuys", category: "Client Website", url: "https://lakeshoreguys.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 25, title: "IceDamRemovalGuys", category: "Client Website", url: "https://icedamremovalguys.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 26, title: "LandscapeGuys", category: "Client Website", url: "https://landscapeguys.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 27, title: "FullDrone", category: "Client Website", url: "https://fulldrone.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 28, title: "HandArmorGloves", category: "Client Website", url: "https://handarmorgloves.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 29, title: "The Back Porch Longwood", category: "Client Website", url: "https://thebackporchlongwood.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 30, title: "Frenchy’s Wood Fired", category: "Client Website", url: "https://frenchyswoodfired.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 31, title: "The Greater Pine Island Alliance", category: "Client Website", url: "https://www.gpialliance.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 32, title: "Loeschen Art", category: "Client Website", url: "https://loeschenart.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 33, title: "GMRodriguez Law", category: "Client Website", url: "https://gmrodriguezlaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 34, title: "Hampton Closet Company", category: "Client Website", url: "https://hamptonclosetcompany.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 35, title: "Rebecca Waxse Law", category: "Client Website", url: "https://www.rebeccalouiselaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 36, title: "John's Pro Care", category: "Client Website", url: "https://johnsprocare.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 37, title: "Valley Agencies", category: "Client Website", url: "https://valleyagencies.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 38, title: "Little Fin Seafood", category: "Client Website", url: "https://littlefinseafood.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 39, title: "Waco Foundation Repair", category: "Client Website", url: "https://wacofoundationrepair.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 40, title: "Cross Stone Law", category: "Client Website", url: "https://crossstone.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 41, title: "Ocean Synchro", category: "Client Website", url: "https://oceansynchro.io/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 42, title: "Ridgeline Scientific", category: "Client Website", url: "https://ridgelinescientificsx.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 43, title: "Surface Waxse Law", category: "Client Website", url: "https://surfacewaxselaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 44, title: "MemoryBanc", category: "Client Website", url: "https://memorybanc.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 45, title: "Regulus Global", category: "Client Website", url: "https://regulusglobal.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 46, title: "Callicoon Hills", category: "Client Website", url: "https://www.callicoonhills.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 47, title: "Lavent Law", category: "Client Website", url: "https://laventlaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 48, title: "Athens Shutters", category: "Client Website", url: "https://athensshutters.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 49, title: "Saxon", category: "Client Website", url: "https://www.saxon.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 50, title: "WC Beverage", category: "Client Website", url: "https://www.wcbevdc.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 51, title: "JokerCare", category: "Client Website", url: "https://jokercare.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 52, title: "Four Daughters Vineyard", category: "Client Website", url: "https://fourdaughtersvineyard.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 53, title: "Bald Beauties Project", category: "Client Website", url: "https://baldbeautiesproject.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 54, title: "SuccessPrint", category: "Client Website", url: "https://successprint.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 55, title: "Dynasty’s United Youth Association", category: "Client Website", url: "https://dynastysyouth.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 56, title: "Villagio Family & Cosmetic Dental", category: "Client Website", url: "https://www.villagiofamilydental.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 57, title: "Chatow Law", category: "Client Website", url: "https://chatow.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 58, title: "Josh Benson", category: "Client Website", url: "https://joshbenson.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 59, title: "Prosper Shaked Accident Injury Attorneys PA", category: "Client Website", url: "https://prosperlaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 60, title: "North Star Fur", category: "Client Website", url: "https://northstarfur.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 61, title: "Better Way Home Improvement", category: "Client Website", url: "https://bettervinylsiding.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 62, title: "Orlando Regenerative Medicine", category: "Client Website", url: "https://orlandoregenerativemed.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 63, title: "Lasers Over Los Angeles", category: "Client Website", url: "https://www.lasersoverlosangeles.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 64, title: "The Pilates Body", category: "Client Website", url: "https://tpbody.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 65, title: "Local Visibility System", category: "Client Website", url: "https://www.localvisibilitysystem.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 66, title: "Kickball Society of Tampa Bay", category: "Client Website", url: "https://kickballsociety.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 67, title: "Dr. Jason Attaman", category: "Client Website", url: "https://jasonattaman.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 68, title: "NewsRoomKnot", category: "Client Website", url: "https://newsroomknot.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 69, title: "Tim Cortes", category: "Client Website", url: "https://timcortes.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 70, title: "First State Bank and Trust", category: "Client Website", url: "https://www.fsbt.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 71, title: "Blue Sky Estate Services", category: "Client Website", url: "https://www.blueskyestateservices.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 72, title: "Butcher And Market", category: "Client Website", url: "https://butcherandmarket.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 73, title: "Willy's Original Orlando", category: "Client Website", url: "https://willysoriginalorlando.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 74, title: "Phoenix Accident and Injury Law Firm", category: "Client Website", url: "https://phxinjurylaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 75, title: "Saxon Administration", category: "Client Website", url: "https://saxonadministration.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 76, title: "Kammes Colorworks", category: "Client Website", url: "https://kammescolorworks.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 77, title: "Forza", category: "Client Website", url: "https://forza.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 78, title: "Regus Cayman", category: "Client Website", url: "https://reguscayman.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 79, title: "Minnesota Rose Society", category: "Client Website", url: "https://minnesotarosesociety.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 80, title: "Find Jodi Huisentruit", category: "Client Website", url: "https://findjodi.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 81, title: "Mountaintop Roofing & Solar", category: "Client Website", url: "https://www.mountaintoproofing.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 82, title: "The Traditionalist Bourbon", category: "Client Website", url: "https://thetraditionalistbourbon.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 83, title: "Cents of Relief", category: "Client Website", url: "https://centsofrelief.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 84, title: "Greta's Grotto", category: "Client Website", url: "https://www.gretasgrotto.ky/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 85, title: "Loon Juice Hard Cider", category: "Client Website", url: "https://loonjuice.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 86, title: "Small Victories Project", category: "Client Website", url: "https://smallvictoriesproject.org/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 87, title: "Dr. Anup Patel", category: "Client Website", url: "https://dranuppatel.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 88, title: "Boston Orthopaedic & Spine", category: "Client Website", url: "https://bostonorthoandspine.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 89, title: "OC Patent Lawyer", category: "Client Website", url: "https://ocpatentlawyer.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 90, title: "Warner & Fitzmartin", category: "Client Website", url: "https://warnerfitzmartin.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 91, title: "Houston Faces", category: "Client Website", url: "https://www.houstonfaces.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 92, title: "Sea Force Boats", category: "Client Website", url: "https://seaforceboats.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 93, title: "PharmaKonnect", category: "Client Website", url: "https://pharmakonnect.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 94, title: "Smoke Boards: Cocktail Smoker", category: "Client Website", url: "https://smokeboards.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 95, title: "Casper Mehlos Law Group", category: "Client Website", url: "https://mehloslaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 96, title: "Hollingsworth Kelly Law Firm", category: "Client Website", url: "https://www.hollingsworthlaw.com/", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] },
  { id: 97, title: "Jimmy Ryce Foundation", category: "Client Website", url: "https://jimmyryce.org", description: "Custom website and digital marketing implementation.", technologies: ["Web Design", "SEO", "Analytics"] }
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
  { id: 4, name: "Cloud Tech", url: "#" },
  { id: 5, name: "Signal Studio", url: "#" }
];
