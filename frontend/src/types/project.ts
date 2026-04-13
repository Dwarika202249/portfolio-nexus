export type ProjectCategory = 'FULLSTACK' | 'AI_ML' | 'BLOCKCHAIN' | 'OPEN_SOURCE';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  links?: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  // 3D positioning metadata (optional)
  position?: [number, number, number];
}
