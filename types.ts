
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  longDescription?: string;
  features: string[]; // What We Offer
  benefits: string[]; // Benefits / Results
  process: { title: string; description: string }[]; // Process Section
  relatedImages?: string[]; // New field for related images
  cta?: string;
}

export interface Client {
  id: number;
  name: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  sectionId?: string;
  subItems?: NavItem[];
}



export interface Project {
  id: number;
  title: string;
  category: string;
  image?: string;
  url: string;
  description: string;
  technologies: string[];
  result?: string;
  industry?: string;
}

// FIX: Added User interface to resolve multiple errors in components using AuthContext
export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  jobTitle?: string;
  location?: string;
  phone?: string;
  website?: string;
}

// FIX: Added Opportunity interface for Jobs and Internships components
export interface Opportunity {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
  status: 'Open' | 'Interviewing' | 'Closed';
  description: string;
  requirements: string[];
}

export const types = true;
