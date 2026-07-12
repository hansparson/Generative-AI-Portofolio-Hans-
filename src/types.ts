export type RoleType = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: RoleType;
  text: string;
  timestamp: string;
  activeComponent?: string;
  componentProps?: any;
  avatarExpression?: 'neutral' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'explaining';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: 'Full-Stack' | 'Generative AI' | 'Cloud / DevOps' | 'Creative Tech';
  demoUrl?: string;
  githubUrl?: string;
  impact?: string;
  featured?: boolean;
  image?: string;
  screenshots?: string[];
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'AI & LLMs' | 'Cloud & Systems';
  yearsOfExp: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
  image?: string;
}

export interface EngineeringValue {
  id: string;
  title: string;
  value: string;
  iconName: string;
  description: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface GenerativeUIResponse {
  message: string;
  activeComponent: 'home' | 'projects' | 'skills' | 'timeline' | 'contact' | 'philosophy';
  avatarExpression: 'neutral' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'explaining';
  componentProps: {
    highlightedItems?: string[];
    customTitle?: string;
    customIntro?: string;
    filterCategory?: string;
    contactPreFill?: {
      subject?: string;
      body?: string;
    };
  };
}
