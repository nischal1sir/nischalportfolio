import type {
  Project, GalleryImage, Profile, PhilosophyItem, ProgressionItem,
  Skill, SoftSkill, Experience, Education, Service, SocialLink, Faq, NavLink,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthToken(): string | null {
  return localStorage.getItem('admin_token');
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `Request failed: ${res.status}` }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const profileApi = {
  async get(): Promise<Profile> {
    const res = await fetch(`${API_URL}/profile`, { headers: { Accept: 'application/json' } });
    return handleResponse<Profile>(res);
  },

  async update(data: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Profile>(res);
  },

  async getPhilosophy(): Promise<PhilosophyItem[]> {
    const res = await fetch(`${API_URL}/profile/philosophy`, { headers: { Accept: 'application/json' } });
    return handleResponse<PhilosophyItem[]>(res);
  },

  async addPhilosophy(data: Partial<PhilosophyItem>): Promise<PhilosophyItem> {
    const res = await fetch(`${API_URL}/profile/philosophy`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PhilosophyItem>(res);
  },

  async updatePhilosophy(id: string, data: Partial<PhilosophyItem>): Promise<PhilosophyItem> {
    const res = await fetch(`${API_URL}/profile/philosophy/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PhilosophyItem>(res);
  },

  async deletePhilosophy(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/profile/philosophy/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },

  async getProgression(): Promise<ProgressionItem[]> {
    const res = await fetch(`${API_URL}/profile/progression`, { headers: { Accept: 'application/json' } });
    return handleResponse<ProgressionItem[]>(res);
  },

  async addProgression(data: Partial<ProgressionItem>): Promise<ProgressionItem> {
    const res = await fetch(`${API_URL}/profile/progression`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ProgressionItem>(res);
  },

  async updateProgression(id: string, data: Partial<ProgressionItem>): Promise<ProgressionItem> {
    const res = await fetch(`${API_URL}/profile/progression/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ProgressionItem>(res);
  },

  async deleteProgression(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/profile/progression/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects`, { headers: { Accept: 'application/json' } });
    return handleResponse<Project[]>(res);
  },

  async getFeatured(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects/featured`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<Project[]>(res);
  },

  async getById(id: string): Promise<Project | null> {
    const res = await fetch(`${API_URL}/projects/${encodeURIComponent(id)}`);
    return handleResponse<Project>(res);
  },

  async create(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const skillsApi = {
  async getAll(): Promise<Skill[]> {
    const res = await fetch(`${API_URL}/skills`, { headers: { Accept: 'application/json' } });
    return handleResponse<Skill[]>(res);
  },

  async getSoft(): Promise<SoftSkill[]> {
    const res = await fetch(`${API_URL}/skills/soft`, { headers: { Accept: 'application/json' } });
    return handleResponse<SoftSkill[]>(res);
  },

  async create(data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },

  async createSoft(data: Partial<SoftSkill>): Promise<SoftSkill> {
    const res = await fetch(`${API_URL}/skills/soft`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SoftSkill>(res);
  },

  async updateSoft(id: string, data: Partial<SoftSkill>): Promise<SoftSkill> {
    const res = await fetch(`${API_URL}/skills/soft/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SoftSkill>(res);
  },

  async removeSoft(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/skills/soft/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const experiencesApi = {
  async getAll(): Promise<Experience[]> {
    const res = await fetch(`${API_URL}/experiences`, { headers: { Accept: 'application/json' } });
    return handleResponse<Experience[]>(res);
  },

  async create(data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_URL}/experiences`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  async update(id: string, data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const educationApi = {
  async getAll(): Promise<Education[]> {
    const res = await fetch(`${API_URL}/education`, { headers: { Accept: 'application/json' } });
    return handleResponse<Education[]>(res);
  },

  async create(data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_URL}/education`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  async update(id: string, data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_URL}/education/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/education/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const servicesApi = {
  async getAll(): Promise<Service[]> {
    const res = await fetch(`${API_URL}/services`, { headers: { Accept: 'application/json' } });
    return handleResponse<Service[]>(res);
  },

  async create(data: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(res);
  },

  async update(id: string, data: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const socialsApi = {
  async getAll(): Promise<SocialLink[]> {
    const res = await fetch(`${API_URL}/socials`, { headers: { Accept: 'application/json' } });
    return handleResponse<SocialLink[]>(res);
  },

  async create(data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_URL}/socials`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SocialLink>(res);
  },

  async update(id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_URL}/socials/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SocialLink>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/socials/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_URL}/gallery`, { headers: { Accept: 'application/json' } });
    return handleResponse<GalleryImage[]>(res);
  },

  async getByCategory(category: string): Promise<GalleryImage[]> {
    const res = await fetch(`${API_URL}/gallery/category/${encodeURIComponent(category)}`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse<GalleryImage[]>(res);
  },

  async getById(id: string): Promise<GalleryImage | null> {
    const res = await fetch(`${API_URL}/gallery/${encodeURIComponent(id)}`);
    return handleResponse<GalleryImage>(res);
  },

  async create(data: Partial<GalleryImage>): Promise<GalleryImage> {
    const res = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<GalleryImage>(res);
  },

  async update(id: string, data: Partial<GalleryImage>): Promise<GalleryImage> {
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<GalleryImage>(res);
  },

  async getAboutPreview(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_URL}/gallery/about-preview`, { headers: { Accept: 'application/json' } });
    return handleResponse<GalleryImage[]>(res);
  },

  async saveAboutPreview(item_ids: string[]): Promise<void> {
    const res = await fetch(`${API_URL}/gallery/about-preview`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ item_ids }),
    });
    await handleResponse(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const faqsApi = {
  async getAll(): Promise<Faq[]> {
    const res = await fetch(`${API_URL}/faqs`, { headers: { Accept: 'application/json' } });
    return handleResponse<Faq[]>(res);
  },

  async create(data: Partial<Faq>): Promise<Faq> {
    const res = await fetch(`${API_URL}/faqs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Faq>(res);
  },

  async update(id: string, data: Partial<Faq>): Promise<Faq> {
    const res = await fetch(`${API_URL}/faqs/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Faq>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/faqs/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};

export const navApi = {
  async getAll(): Promise<NavLink[]> {
    const res = await fetch(`${API_URL}/nav`, { headers: { Accept: 'application/json' } });
    return handleResponse<NavLink[]>(res);
  },

  async create(data: Partial<NavLink>): Promise<NavLink> {
    const res = await fetch(`${API_URL}/nav`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<NavLink>(res);
  },

  async update(id: string, data: Partial<NavLink>): Promise<NavLink> {
    const res = await fetch(`${API_URL}/nav/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<NavLink>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/nav/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    await handleResponse(res);
  },
};
