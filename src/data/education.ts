import { GraduationCap, School } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  faculty?: string;
  status?: string;
  subjects?: string[];
  highlights: string[];
  icon: LucideIcon;
}

export const education: EducationData[] = [
  {
    id: 'edu-2',
    institution: 'Itahari International College',
    degree: 'BIT (Hons) — BSc IT (Hons)',
    period: '2024 — Present',
    location: 'Itahari, Nepal',
    status: 'Pursuing',
    subjects: [
      'Software Engineering',
      'Database Systems',
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Web Technologies',
    ],
    highlights: [
      'Bachelor of Information Technology (Hons)',
      'Currently pursuing — ongoing',
      'Strengthening fundamentals in software engineering and programming',
    ],
    icon: GraduationCap,
  },
  {
    id: 'edu-1',
    institution: 'Goldengate International College',
    degree: 'High School — Computer Science',
    period: '2021 — 2023',
    location: 'Kathmandu, Nepal',
    faculty: 'Management',
    status: 'Completed 2023',
    highlights: [
      'Completed high school with a focus on Computer Science',
      'Built a foundational understanding of programming and logic',
      'Faculty: Management',
    ],
    icon: School,
  },
];
