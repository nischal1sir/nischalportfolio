import type { Project } from '../types';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const projects: ProjectData[] = [
  {
    id: 'p-1',
    title: 'E-Commerce Storefront',
    description:
      'A full-stack e-commerce solution with product browsing, cart, checkout flow and an admin dashboard. Built with the MERN stack and styled with Tailwind CSS.',
    short_description:
      'Full-stack MERN e-commerce platform with cart, checkout and an admin dashboard.',
    image_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Full-Stack',
    featured: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'p-2',
    title: 'Task Manager App',
    description:
      'A collaborative task manager with boards, drag-and-drop reordering, workspaces and real-time status updates. Focused on a clean, responsive UI.',
    short_description:
      'Collaborative task manager with Kanban boards, drag-and-drop and workspaces.',
    image_url:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Web App',
    featured: true,
    created_at: '2024-05-12T00:00:00Z',
    updated_at: '2024-05-12T00:00:00Z',
  },
  {
    id: 'p-3',
    title: 'Weather Dashboard',
    description:
      'A clean weather dashboard with location search, animated forecasts and historical data. Great practice working with external APIs and data visualisation.',
    short_description:
      'Weather dashboard with location search, animated forecasts and historical data.',
    image_url:
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
    technologies: ['React', 'OpenWeather API', 'Tailwind CSS'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Frontend',
    featured: false,
    created_at: '2024-06-20T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z',
  },
  {
    id: 'p-4',
    title: 'Developer Blog',
    description:
      'A content-focused blog platform with MDX support, syntax highlighting, RSS feed and basic SEO. Built to explore content modelling and rendering.',
    short_description:
      'Developer-focused blog platform with MDX, syntax highlighting and RSS.',
    image_url:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    technologies: ['Next.js', 'MDX', 'TypeScript', 'Tailwind CSS'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Web App',
    featured: true,
    created_at: '2024-08-09T00:00:00Z',
    updated_at: '2024-08-09T00:00:00Z',
  },
  {
    id: 'p-5',
    title: 'Real-Time Chat',
    description:
      'A messaging app with rooms, direct messages, file sharing and message reactions. Helped me understand real-time data flow and optimistic UI updates.',
    short_description:
      'Real-time chat with rooms, DMs, file sharing and emoji reactions.',
    image_url:
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7600?w=800&q=80',
    technologies: ['React', 'Express', 'Socket.io', 'Tailwind CSS'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Full-Stack',
    featured: false,
    created_at: '2024-10-02T00:00:00Z',
    updated_at: '2024-10-02T00:00:00Z',
  },
  {
    id: 'p-6',
    title: 'Portfolio Website',
    description:
      'This very portfolio. A component-based, responsive site with TypeScript, Tailwind CSS, a backend-ready contact form and a clean, maintainable structure.',
    short_description:
      'This portfolio: component-based, responsive, backend-ready contact form.',
    image_url:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    github_url: 'https://github.com/nischalrai',
    live_url: '',
    category: 'Template',
    featured: false,
    created_at: '2024-11-18T00:00:00Z',
    updated_at: '2024-11-18T00:00:00Z',
  },
];

export function toProject(data: ProjectData): Project {
  return data;
}
