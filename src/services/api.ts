import type { Project, GalleryImage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with cart, checkout, payment integration, and admin dashboard.',
    short_description: 'A complete MERN stack e-commerce platform with Stripe payments and real-time inventory.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'Tailwind'],
    featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates, drag-and-drop boards, and team workspaces.',
    short_description: 'Real-time collaborative task manager with Kanban boards and team features.',
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['React', 'Socket.io', 'PostgreSQL', 'TypeScript', 'Prisma'],
    featured: true,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with location-based forecasts, historical data, and interactive maps.',
    short_description: 'Clean weather dashboard with animated forecasts and location search.',
    image_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['Vue.js', 'OpenWeather API', 'Chart.js', 'CSS Animations'],
    featured: false,
    created_at: '2024-06-10T00:00:00Z',
    updated_at: '2024-06-10T00:00:00Z',
  },
  {
    id: '4',
    title: 'Blog Platform',
    description: 'Modern blog platform with MDX support, syntax highlighting, RSS feeds, and SEO optimization.',
    short_description: 'Developer-focused blog platform with MDX, syntax highlighting, and full SEO.',
    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['Next.js', 'MDX', 'Tailwind', 'Vercel', 'TypeScript'],
    featured: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Chat Application',
    description: 'Real-time messaging app with rooms, direct messages, file sharing, and message reactions.',
    short_description: 'Real-time chat with rooms, DMs, file sharing, and emoji reactions.',
    image_url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7600?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['React', 'Firebase', 'Firestore', 'Tailwind', 'React Query'],
    featured: false,
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Portfolio Template',
    description: 'Customizable developer portfolio template with dark mode, animations, and blog integration.',
    short_description: 'Beautiful portfolio template with animations, dark mode, and CMS integration.',
    image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    technologies: ['Astro', 'React', 'Tailwind', 'Framer Motion', 'Markdoc'],
    featured: true,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
];

const MOCK_GALLERY: GalleryImage[] = [
  { id: '1', title: 'Mountain View', description: 'Sunrise over the peaks', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', category: 'nature', order_index: 0, created_at: '', updated_at: '' },
  { id: '2', title: 'City Lights', description: 'Downtown at night', image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', category: 'urban', order_index: 1, created_at: '', updated_at: '' },
  { id: '3', title: 'Ocean Waves', description: 'Pacific coastline', image_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', category: 'nature', order_index: 2, created_at: '', updated_at: '' },
  { id: '4', title: 'Forest Path', description: 'Misty morning walk', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', category: 'nature', order_index: 3, created_at: '', updated_at: '' },
  { id: '5', title: 'Modern Architecture', description: 'Glass and steel', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', category: 'urban', order_index: 4, created_at: '', updated_at: '' },
  { id: '6', title: 'Desert Sunset', description: 'Golden hour dunes', image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80', category: 'nature', order_index: 5, created_at: '', updated_at: '' },
  { id: '7', title: 'Street Photography', description: 'Candid moments', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', category: 'urban', order_index: 6, created_at: '', updated_at: '' },
  { id: '8', title: 'Lake Reflection', description: 'Mirror perfect calm', image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', category: 'nature', order_index: 7, created_at: '', updated_at: '' },
];

async function fetchWithMock<T>(url: string, mockData: T[]): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();
  } catch {
    return mockData;
  }
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    return fetchWithMock(`${API_URL}/projects`, MOCK_PROJECTS);
  },

  async getFeatured(): Promise<Project[]> {
    return fetchWithMock(`${API_URL}/projects/featured`, MOCK_PROJECTS.filter(p => p.featured));
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return MOCK_PROJECTS.find(p => p.id === id) || null;
    }
  },
};

export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    return fetchWithMock(`${API_URL}/gallery`, MOCK_GALLERY);
  },

  async getByCategory(category: string): Promise<GalleryImage[]> {
    try {
      const res = await fetch(`${API_URL}/gallery/category/${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    } catch {
      return MOCK_GALLERY.filter(g => g.category === category);
    }
  },
};