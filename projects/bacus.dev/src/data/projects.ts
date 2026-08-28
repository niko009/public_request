import projectData from './projects.json';

export type ProjectStatus = 'Active' | 'In development' | 'Prototype';

export type ProjectFactoryConfig = {
  managed: boolean;
  repository?: string;
  visibility?: 'public' | 'private';
  domain?: string;
};

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  summaryEn: string;
  summaryRu: string;
  descriptionEn: string;
  descriptionRu: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  factory?: ProjectFactoryConfig;
};

export const projects = projectData as unknown as Project[];

export const featuredProjects = projects.filter((project) =>
  ['motion-play', 'cosmic-rangers', 'nutriguru', 'eye-gym', 'san-teh', 'alcocalc'].includes(project.slug)
);
