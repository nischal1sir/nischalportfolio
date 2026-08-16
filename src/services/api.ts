import type { Project, GalleryImage } from '../types';
import { projects as MOCK_PROJECTS } from '../data/projects';
import { galleryImages as MOCK_GALLERY } from '../data/gallery';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithMock<T>(url: string, mockData: T[]): Promise<T[]> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as T[];
    if (!Array.isArray(data) || data.length === 0) return mockData;
    return data;
  } catch {
    return mockData;
  }
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    return fetchWithMock<Project>(`${API_URL}/projects`, MOCK_PROJECTS);
  },

  async getFeatured(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_URL}/projects/featured`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as Project[];
      if (Array.isArray(data) && data.length > 0) return data;
      const all = await this.getAll();
      const featured = all.filter((p) => p.featured);
      return featured.length > 0
        ? featured
        : all.slice(0, 3);
    } catch {
      const all = await this.getAll();
      const featured = all.filter((p) => p.featured);
      return featured.length > 0
        ? featured
        : all.slice(0, 3);
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_URL}/projects/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Not found');
      return (await res.json()) as Project;
    } catch {
      return MOCK_PROJECTS.find((p) => p.id === id) || null;
    }
  },
};

export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    return fetchWithMock<GalleryImage>(`${API_URL}/gallery`, MOCK_GALLERY);
  },

  async getByCategory(category: string): Promise<GalleryImage[]> {
    try {
      const res = await fetch(
        `${API_URL}/gallery/category/${encodeURIComponent(category)}`,
        { headers: { Accept: 'application/json' } },
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as GalleryImage[];
      if (Array.isArray(data) && data.length > 0) return data;
      return MOCK_GALLERY.filter((g) => g.category === category);
    } catch {
      return MOCK_GALLERY.filter((g) => g.category === category);
    }
  },

  async getById(id: string): Promise<GalleryImage | null> {
    try {
      const res = await fetch(`${API_URL}/gallery/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Not found');
      return (await res.json()) as GalleryImage;
    } catch {
      return MOCK_GALLERY.find((g) => g.id === id) || null;
    }
  },
};
