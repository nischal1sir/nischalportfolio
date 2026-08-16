export interface ExperienceData {
  id: string;
  type: 'freelance' | 'internship' | 'role';
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export const experiences: ExperienceData[] = [
  {
    id: 'exp-0',
    type: 'internship',
    role: 'Frontend Developer Intern',
    company: 'Youth IT',
    companyUrl: 'https://hamroyouthit.com/',
    period: 'Jul 2025 — Sep 2025',
    location: 'Itahari, Nepal',
    description:
      'Completed a frontend development internship at Youth IT, working on real client-facing interfaces and learning professional development workflows.',
    highlights: [
      'Built and maintained responsive frontend components',
      'Collaborated with the team using Git and code reviews',
      'Translated designs into clean, accessible interfaces',
      'Improved UI performance and cross-browser compatibility',
      'Adapted to an existing codebase and team workflow',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Git / GitHub'],
  },
  {
    id: 'exp-1',
    type: 'freelance',
    role: 'Freelance Developer',
    company: 'Project-Based',
    period: '2023 — Present',
    location: 'Remote',
    description:
      'Worked on freelance and project-based web development, building responsive websites and adapting solutions to different project requirements.',
    highlights: [
      'Built responsive interfaces for a variety of small projects',
      'Worked with frontend technologies to create modern interfaces',
      'Understood client requirements and translated them into functional solutions',
      'Made UI and responsive improvements on existing projects',
      'Worked within existing codebases and adapted to different requirements',
      'Debugged and fixed issues across browsers and devices',
    ],
    technologies: ['React', 'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Git'],
  },
];
