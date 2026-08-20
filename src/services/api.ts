import type { Project, GalleryImage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const isProduction = import.meta.env.PROD;

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as Project[];
  },

  async getFeatured(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects/featured`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as Project[];
    if (Array.isArray(data) && data.length > 0) return data;
    const all = await this.getAll();
    return all.filter((p) => p.featured).slice(0, 3);
  },

  async getById(id: string): Promise<Project | null> {
    const res = await fetch(`${API_URL}/projects/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Not found');
    return (await res.json()) as Project;
  },
};

export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_URL}/gallery`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as GalleryImage[];
  },

  async getByCategory(category: string): Promise<GalleryImage[]> {
    const res = await fetch(`${API_URL}/gallery/category/${encodeURIComponent(category)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as GalleryImage[];
  },

  async getById(id: string): Promise<GalleryImage | null> {
    const res = await fetch(`${API_URL}/gallery/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Not found');
    return (await res.json()) as GalleryImage;
  },
};

export { isProduction };
