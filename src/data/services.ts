export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const services: ServiceData[] = [
  {
    id: 'srv-1',
    title: 'Responsive Websites',
    description:
      'Modern websites that work seamlessly across mobile, tablet and desktop.',
    icon: 'layout',
  },
  {
    id: 'srv-2',
    title: 'Business Websites',
    description:
      'Professional websites for businesses, organizations and personal brands.',
    icon: 'briefcase',
  },
  {
    id: 'srv-3',
    title: 'Portfolio Websites',
    description:
      'Personal portfolios for developers, students, designers and professionals.',
    icon: 'user',
  },
  {
    id: 'srv-4',
    title: 'Frontend Development',
    description:
      'Modern interfaces using React, TypeScript, Tailwind CSS and other frontend technologies.',
    icon: 'code',
  },
  {
    id: 'srv-5',
    title: 'Full-Stack Projects',
    description:
      'Flexible projects involving frontend, backend and database integration.',
    icon: 'database',
  },
  {
    id: 'srv-6',
    title: 'Website Improvements',
    description:
      'Responsive improvements, UI upgrades, animations and modern redesigns.',
    icon: 'refresh-cw',
  },
];
