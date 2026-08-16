export interface SkillItem {
  name: string;
  category: SkillCategory;
}

export type SkillCategory =
  | 'language'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'tools'
  | 'learning'
  | 'exploring';

export interface SkillGroup {
  key: SkillCategory;
  label: string;
}

export const skillCategories: SkillGroup[] = [
  { key: 'language', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'tools', label: 'Tools & Workflow' },
];

export const skills: SkillItem[] = [
  { name: 'JavaScript', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'Java', category: 'language' },
  { name: 'React', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'HTML / CSS', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'MongoDB', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'Supabase', category: 'database' },
  { name: 'Git / GitHub', category: 'tools' },
  { name: 'Linux / CLI', category: 'tools' },
  { name: 'Figma', category: 'tools' },
  { name: 'VS Code', category: 'tools' },
];

export const currentlyLearning: string[] = ['Python', 'LLMs'];

export const exploring: string[] = ['Next.js', 'Prisma', 'Docker'];

export interface SoftSkill {
  name: string;
  description: string;
}

export const softSkills: SoftSkill[] = [
  { name: 'Team collaboration', description: 'Comfortable working within a team, sharing progress and reviewing code.' },
  { name: 'Time management', description: 'Plan work in small chunks and keep momentum without losing focus.' },
  { name: 'Problem solving', description: 'Break down problems, research what I don\u2019t know and ship a fix.' },
  { name: 'Adaptability', description: 'Pick up unfamiliar tools and codebases quickly, and adapt to new requirements.' },
];

export function skillsByCategory(category: SkillCategory): SkillItem[] {
  return skills.filter((s) => s.category === category);
}
