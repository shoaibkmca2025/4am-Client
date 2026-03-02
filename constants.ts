import { Service, Client, NavItem, Project } from './types';

declare global {
  interface Window {
    aistudio?: any;
  }
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', sectionId: 'home' },
  { 
    label: 'Services', 
    href: '/', 
    sectionId: 'services',
    subItems: [
      { label: 'Digital Marketing', href: '/services/digital-marketing' },
      { label: 'Branding', href: '/services/branding' },
      { label: 'Social Media', href: '/services/social-media-growth' },
      { label: 'SEO', href: '/services/seo' },
      { label: 'Web Dev', href: '/services/web-development' },
      { label: 'Content', href: '/services/content-creation' },
    ]
  },
  { label: 'About', href: '/', sectionId: 'about' },
  { label: 'Work', href: '/', sectionId: 'work' },
  { label: 'Contact', href: '/', sectionId: 'contact' },
];



export const SERVICES: Service[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Paid and organic campaigns engineered to turn attention into predictable pipeline.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    longDescription: 'We don’t just run ads; we build revenue engines. Our digital marketing strategies are data-backed and performance-driven, ensuring every dollar spent contributes to your bottom line.',
    features: [
      'PPC & Paid Social Campaigns',
      'Email Marketing Automation',
      'Conversion Rate Optimization (CRO)',
      'Retargeting & Audience Segmentation'
    ],
    benefits: [
      'Higher ROI on ad spend',
      'Scalable lead generation',
      'Predictable revenue growth',
      'Enhanced brand visibility'
    ],
    process: [
      { title: 'Audit & Strategy', description: 'We analyze your current performance and market position to build a winning roadmap.' },
      { title: 'Campaign Setup', description: 'Targeted ad structures, compelling copy, and high-converting creatives.' },
      { title: 'Launch & Optimize', description: 'Real-time monitoring and rapid iteration to maximize results.' },
      { title: 'Scale', description: 'Expanding reach and budget efficiency once profitability is proven.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'branding',
    title: 'Branding',
    slug: 'branding',
    description: 'Visual identity and messaging systems that position you as the obvious choice.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    longDescription: 'Your brand is more than a logo—it’s the feeling you leave behind. We craft cohesive identities that resonate with your audience and differentiate you from the noise.',
    features: [
      'Logo Design & Visual Identity',
      'Brand Strategy & Positioning',
      'Messaging & Tone of Voice',
      'Brand Guidelines'
    ],
    benefits: [
      'Instant market recognition',
      'Increased customer trust',
      'Premium pricing power',
      'Consistent brand experience'
    ],
    process: [
      { title: 'Discovery', description: 'Deep dive into your values, mission, and target audience.' },
      { title: 'Concept Development', description: 'Exploring visual directions and narrative themes.' },
      { title: 'Design & Refine', description: 'Crafting the assets and polishing the details.' },
      { title: 'Delivery', description: 'Handing over a complete brand system ready for deployment.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626785774573-4b799314348d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'social-media-growth',
    title: 'Social Media Growth',
    slug: 'social-media-growth',
    description: 'Always-on content and social strategy designed for engagement and authority.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    longDescription: 'Social media is the modern public square. We help you own the conversation with content that educates, entertains, and converts followers into loyal advocates.',
    features: [
      'Content Strategy & Calendar',
      'Community Management',
      'Viral Content Creation',
      'Analytics & Reporting'
    ],
    benefits: [
      'Explosive follower growth',
      'High engagement rates',
      'Stronger brand community',
      'Direct channel to customers'
    ],
    process: [
      { title: 'Analysis', description: 'Understanding your audience and competitors on social platforms.' },
      { title: 'Content Plan', description: 'Developing a mix of educational, entertaining, and promotional content.' },
      { title: 'Execution', description: 'Consistent posting and active community engagement.' },
      { title: 'Growth', description: 'Leveraging viral loops and partnerships to expand reach.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'seo',
    title: 'SEO',
    slug: 'seo',
    description: 'Search strategies that compound over time and bring in high-intent, ready-to-buy traffic.',
    image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
    longDescription: 'Stop renting traffic and start owning it. Our SEO strategies build long-term assets that drive qualified leads to your site 24/7 without ongoing ad spend.',
    features: [
      'On-Page & Technical SEO',
      'Keyword Research & Strategy',
      'Link Building & Authority',
      'Content Optimization'
    ],
    benefits: [
      'Sustainable organic traffic',
      'Top search engine rankings',
      'Reduced customer acquisition cost',
      'Long-term business growth'
    ],
    process: [
      { title: 'Site Audit', description: 'Identifying technical issues and opportunities for quick wins.' },
      { title: 'Keyword Research', description: 'Finding the terms your ideal customers are searching for.' },
      { title: 'Optimization', description: 'Improving site structure, content, and metadata.' },
      { title: 'Monitoring', description: 'Tracking rankings and adjusting strategy for algorithm updates.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'web-development',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Conversion-focused websites and landing pages built for speed and clarity.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    longDescription: 'Your website is your 24/7 salesperson. We build fast, secure, and beautiful websites designed to convert visitors into customers seamlessly.',
    features: [
      'Custom Website Design',
      'E-commerce Solutions',
      'Landing Page Optimization',
      'Performance Tuning'
    ],
    benefits: [
      'Lightning-fast load times',
      'Mobile-responsive design',
      'High conversion rates',
      'Seamless user experience'
    ],
    process: [
      { title: 'Wireframing', description: 'Mapping out user journeys and site architecture.' },
      { title: 'Design', description: 'Creating high-fidelity mockups of the interface.' },
      { title: 'Development', description: 'Writing clean, efficient code to bring the design to life.' },
      { title: 'Launch', description: 'Testing, deployment, and post-launch support.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    slug: 'content-creation',
    description: 'Video, copy, and creative assets that keep your brand present everywhere.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    longDescription: 'Content is king, but context is queen. We create compelling assets tailored to each platform, ensuring your message lands with impact every time.',
    features: [
      'Video Production & Editing',
      'Copywriting & storytelling',
      'Graphic Design',
      'Photography'
    ],
    benefits: [
      'Compelling brand storytelling',
      'Consistent visual language',
      'Higher audience retention',
      'Versatile asset library'
    ],
    process: [
      { title: 'Concept', description: 'Brainstorming ideas that align with your campaign goals.' },
      { title: 'Production', description: 'Filming, writing, or designing the core assets.' },
      { title: 'Editing', description: 'Polishing and refining to meet professional standards.' },
      { title: 'Distribution', description: 'Formatting assets for optimal performance across channels.' }
    ],
    relatedImages: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: "Joker Media", 
    category: "Client Website", 
    url: "https://jokermedia.com/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "+240% conversions",
    industry: "Entertainment"
  },
  { 
    id: 2, 
    title: "Silver Thatch Pensions", 
    category: "Client Website", 
    url: "https://silverthatch.org.ky/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "3x Traffic Growth",
    industry: "Finance"
  },
  { 
    id: 3, 
    title: "Century Boats", 
    category: "Client Website", 
    url: "https://centuryboats.com/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "45% Lower CAC",
    industry: "Marine"
  },
  { 
    id: 4, 
    title: "Greendale Physical Therapy", 
    category: "Client Website", 
    url: "https://greendalept.com/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "+180% Bookings",
    industry: "Healthcare"
  },
  { 
    id: 5, 
    title: "RussellsOrlando", 
    category: "Client Website", 
    url: "https://russellsorlando.com/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "2.5x Engagement",
    industry: "Hospitality"
  },
  { 
    id: 6, 
    title: "Rolly Polly", 
    category: "Client Website", 
    url: "https://rolypoly.com/", 
    description: "Custom website and digital marketing implementation.", 
    technologies: ["Web Design", "SEO", "Analytics"],
    result: "+300% Online Orders",
    industry: "Food & Beverage"
  },
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




export const CLIENTS: Client[] = [
  { id: 1, name: "Nexus Labs", url: "#" },
  { id: 2, name: "Growth Corp", url: "#" },
  { id: 3, name: "Innovate AI", url: "#" },
  { id: 4, name: "Cloud Tech", url: "#" },
  { id: 5, name: "Signal Studio", url: "#" }
];
