import type {
  Project, GalleryImage, Profile, PhilosophyItem, ProgressionItem,
  Skill, SoftSkill, Experience, Education, Service, SocialLink, Faq, NavLink,
} from '../types';
import { supabase } from '../lib/supabase';

async function handleResponse<T>(data: T | null, error: Error | null): Promise<T> {
  if (error) {
    throw new Error(error.message);
  }
  return data as T;
}

// ============================================================================
// REORDER & STORAGE HELPERS
// ============================================================================
export async function reorderItems(tableName: string, items: { id: string; order_index: number }[]): Promise<void> {
  const validItems = items.filter(item => !item.id.startsWith('temp-'));
  if (validItems.length === 0) return;

  const updates = validItems.map((item) =>
    supabase
      .from(tableName)
      .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
      .eq('id', item.id)
  );

  const results = await Promise.all(updates);
  for (const res of results) {
    if (res.error) throw new Error(res.error.message);
  }
}

export async function deleteStorageFileFromUrl(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes('/storage/v1/object/public/')) return;
  try {
    const parts = url.split('/storage/v1/object/public/')[1];
    if (!parts) return;
    const slashIdx = parts.indexOf('/');
    if (slashIdx === -1) return;
    const bucket = parts.substring(0, slashIdx);
    const filePath = decodeURIComponent(parts.substring(slashIdx + 1));
    if (bucket && filePath) {
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (err) {
    console.warn('Failed to delete storage file:', err);
  }
}

export async function uploadGalleryImage(file: File, id?: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `gallery/${id || Date.now()}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('gallery-images').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) {
    const fallbackPath = `gallery/${id || Date.now()}_${Date.now()}.${ext}`;
    const { error: fallbackErr } = await supabase.storage.from('project-images').upload(fallbackPath, file, {
      upsert: true,
      contentType: file.type,
    });
    if (fallbackErr) throw new Error(error.message);
    const { data } = supabase.storage.from('project-images').getPublicUrl(fallbackPath);
    return data.publicUrl;
  }
  const { data } = supabase.storage.from('gallery-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadResumeFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `resumes/resume_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('resumes').upload(path, file, {
    upsert: true,
    contentType: file.type || 'application/pdf',
  });
  if (error) {
    const fallbackPath = `resumes/resume_${Date.now()}.${ext}`;
    const { error: fallbackErr } = await supabase.storage.from('project-images').upload(fallbackPath, file, {
      upsert: true,
      contentType: file.type || 'application/pdf',
    });
    if (fallbackErr) throw new Error(error.message);
    const { data } = supabase.storage.from('project-images').getPublicUrl(fallbackPath);
    return data.publicUrl;
  }
  const { data } = supabase.storage.from('resumes').getPublicUrl(path);
  return data.publicUrl;
}


// ============================================================================
// PROFILE API
// ============================================================================
export const profileApi = {
  async get(): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle();
    return handleResponse<Profile>(data, error);
  },

  async update(data: Partial<Profile>): Promise<Profile> {
    const profileId = data.id || '00000000-0000-0000-0000-000000000001';
    try {
      const { data: result, error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', profileId)
        .select()
        .single();
      if (error) throw error;
      return result as Profile;
    } catch (err: any) {
      if (err?.message && (err.message.includes("'interests'") || err.message.includes("schema cache"))) {
        const { interests, ...dataWithoutInterests } = data;
        const { data: fallbackResult, error: fallbackErr } = await supabase
          .from('profiles')
          .update({ ...dataWithoutInterests, updated_at: new Date().toISOString() })
          .eq('id', profileId)
          .select()
          .single();
        if (fallbackErr) throw new Error(fallbackErr.message);
        return { ...(fallbackResult as Profile), interests: data.interests || [] };
      }
      throw err;
    }
  },

  async uploadResume(file: File): Promise<string> {
    return uploadResumeFile(file);
  },

  async deleteResume(url: string): Promise<void> {
    return deleteStorageFileFromUrl(url);
  },

  async getPhilosophy(): Promise<PhilosophyItem[]> {
    const { data, error } = await supabase
      .from('philosophy_items')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<PhilosophyItem[]>(data || [], error);
  },

  async addPhilosophy(data: Partial<PhilosophyItem>): Promise<PhilosophyItem> {
    const profileId = data.profile_id || '00000000-0000-0000-0000-000000000001';
    const { data: result, error } = await supabase
      .from('philosophy_items')
      .insert({ ...data, profile_id: profileId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<PhilosophyItem>(result, error);
  },

  async updatePhilosophy(id: string, data: Partial<PhilosophyItem>): Promise<PhilosophyItem> {
    const { data: result, error } = await supabase
      .from('philosophy_items')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<PhilosophyItem>(result, error);
  },

  async deletePhilosophy(id: string): Promise<void> {
    const { error } = await supabase
      .from('philosophy_items')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getProgression(): Promise<ProgressionItem[]> {
    const { data, error } = await supabase
      .from('progression_items')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<ProgressionItem[]>(data || [], error);
  },

  async addProgression(data: Partial<ProgressionItem>): Promise<ProgressionItem> {
    const profileId = data.profile_id || '00000000-0000-0000-0000-000000000001';
    const { data: result, error } = await supabase
      .from('progression_items')
      .insert({ ...data, profile_id: profileId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<ProgressionItem>(result, error);
  },

  async updateProgression(id: string, data: Partial<ProgressionItem>): Promise<ProgressionItem> {
    const { data: result, error } = await supabase
      .from('progression_items')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<ProgressionItem>(result, error);
  },

  async deleteProgression(id: string): Promise<void> {
    const { error } = await supabase
      .from('progression_items')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ============================================================================
// PROJECTS API
// ============================================================================
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Project[]>(data || [], error);
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true });
    return handleResponse<Project[]>(data || [], error);
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    return handleResponse<Project | null>(data, error);
  },

  async create(data: Partial<Project>): Promise<Project> {
    const { data: result, error } = await supabase
      .from('projects')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Project>(result, error);
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const { data: result, error } = await supabase
      .from('projects')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Project>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ============================================================================
// SKILLS API
// ============================================================================
export const skillsApi = {
  async getAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Skill[]>(data || [], error);
  },

  async getSoft(): Promise<SoftSkill[]> {
    const { data, error } = await supabase
      .from('soft_skills')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<SoftSkill[]>(data || [], error);
  },

  async create(data: Partial<Skill>): Promise<Skill> {
    const { data: result, error } = await supabase
      .from('skills')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Skill>(result, error);
  },

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    const { data: result, error } = await supabase
      .from('skills')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Skill>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async createSoft(data: Partial<SoftSkill>): Promise<SoftSkill> {
    const { data: result, error } = await supabase
      .from('soft_skills')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<SoftSkill>(result, error);
  },

  async updateSoft(id: string, data: Partial<SoftSkill>): Promise<SoftSkill> {
    const { data: result, error } = await supabase
      .from('soft_skills')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<SoftSkill>(result, error);
  },

  async removeSoft(id: string): Promise<void> {
    const { error } = await supabase
      .from('soft_skills')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getLearning(): Promise<string[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('name')
      .eq('category', 'learning')
      .order('order_index', { ascending: true });
    if (error || !data) return [];
    return data.map(d => d.name);
  },

  async getExploring(): Promise<string[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('name')
      .eq('category', 'exploring')
      .order('order_index', { ascending: true });
    if (error || !data) return [];
    return data.map(d => d.name);
  },
};

// ============================================================================
// EXPERIENCES API
// ============================================================================
export const experiencesApi = {
  async getAll(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Experience[]>(data || [], error);
  },

  async create(data: Partial<Experience>): Promise<Experience> {
    const { data: result, error } = await supabase
      .from('experiences')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Experience>(result, error);
  },

  async update(id: string, data: Partial<Experience>): Promise<Experience> {
    const { data: result, error } = await supabase
      .from('experiences')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Experience>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('experiences', items);
  },
};

// ============================================================================
// EDUCATION API
// ============================================================================
export const educationApi = {
  async getAll(): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Education[]>(data || [], error);
  },

  async create(data: Partial<Education>): Promise<Education> {
    const { data: result, error } = await supabase
      .from('education')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Education>(result, error);
  },

  async update(id: string, data: Partial<Education>): Promise<Education> {
    const { data: result, error } = await supabase
      .from('education')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Education>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('education', items);
  },
};

// ============================================================================
// SERVICES API
// ============================================================================
export const servicesApi = {
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Service[]>(data || [], error);
  },

  async create(data: Partial<Service>): Promise<Service> {
    const { data: result, error } = await supabase
      .from('services')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Service>(result, error);
  },

  async update(id: string, data: Partial<Service>): Promise<Service> {
    const { data: result, error } = await supabase
      .from('services')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Service>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('services', items);
  },
};

// ============================================================================
// SOCIALS API
// ============================================================================
export const socialsApi = {
  async getAll(): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<SocialLink[]>(data || [], error);
  },

  async create(data: Partial<SocialLink>): Promise<SocialLink> {
    const { data: result, error } = await supabase
      .from('social_links')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<SocialLink>(result, error);
  },

  async update(id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    const { data: result, error } = await supabase
      .from('social_links')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<SocialLink>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('social_links', items);
  },
};

// ============================================================================
// GALLERY API
// ============================================================================
export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<GalleryImage[]>(data || [], error);
  },

  async getByCategory(category: string): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true });
    return handleResponse<GalleryImage[]>(data || [], error);
  },

  async getById(id: string): Promise<GalleryImage | null> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();
    return handleResponse<GalleryImage | null>(data, error);
  },

  async create(data: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data: result, error } = await supabase
      .from('gallery')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<GalleryImage>(result, error);
  },

  async update(id: string, data: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data: result, error } = await supabase
      .from('gallery')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<GalleryImage>(result, error);
  },

  async remove(id: string): Promise<void> {
    const item = await galleryApi.getById(id);
    if (item?.image_url) {
      await deleteStorageFileFromUrl(item.image_url);
    }
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('gallery', items);
  },

  async uploadImage(file: File): Promise<string> {
    return uploadGalleryImage(file);
  },

  async getAboutPreviewItemIds(): Promise<string[]> {
    const { data, error } = await supabase
      .from('about_gallery_preview')
      .select('gallery_item_id')
      .order('display_order', { ascending: true });
    if (error || !data) return [];
    return data.map(d => d.gallery_item_id);
  },

  async saveAboutPreviewItemIds(itemIds: string[]): Promise<void> {
    // Delete old selections
    const { error: delErr } = await supabase
      .from('about_gallery_preview')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (delErr) throw new Error(delErr.message);

    if (itemIds.length === 0) return;

    const rows = itemIds.slice(0, 3).map((id, index) => ({
      gallery_item_id: id,
      display_order: index,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: insErr } = await supabase
      .from('about_gallery_preview')
      .insert(rows);
    if (insErr) throw new Error(insErr.message);
  },

  async saveAllLayout(items: GalleryImage[]): Promise<GalleryImage[]> {
    const results: GalleryImage[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { id, created_at, updated_at, ...rest } = item;
      if (id.startsWith('temp-')) {
        const created = await galleryApi.create({ ...rest, order_index: i });
        results.push(created);
      } else {
        const updated = await galleryApi.update(id, { ...rest, order_index: i });
        results.push(updated);
      }
    }
    return results;
  },
};

// ============================================================================
// FAQs API
// ============================================================================
export const faqsApi = {
  async getAll(): Promise<Faq[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<Faq[]>(data || [], error);
  },

  async create(data: Partial<Faq>): Promise<Faq> {
    const { data: result, error } = await supabase
      .from('faqs')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<Faq>(result, error);
  },

  async update(id: string, data: Partial<Faq>): Promise<Faq> {
    const { data: result, error } = await supabase
      .from('faqs')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<Faq>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    return reorderItems('faqs', items);
  },
};

// ============================================================================
// NAVIGATION API
// ============================================================================
export const navApi = {
  async getAll(): Promise<NavLink[]> {
    const { data, error } = await supabase
      .from('nav_links')
      .select('*')
      .order('order_index', { ascending: true });
    return handleResponse<NavLink[]>(data || [], error);
  },

  async create(data: Partial<NavLink>): Promise<NavLink> {
    const { data: result, error } = await supabase
      .from('nav_links')
      .insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    return handleResponse<NavLink>(result, error);
  },

  async update(id: string, data: Partial<NavLink>): Promise<NavLink> {
    const { data: result, error } = await supabase
      .from('nav_links')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return handleResponse<NavLink>(result, error);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('nav_links')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ============================================================================
// LEARNING/EXPLORING (stored as simple string arrays in localStorage or separate tables)
// ============================================================================
export const learningApi = {
  async getLearning(): Promise<string[]> {
    const { data, error } = await supabase
      .from('learning_items')
      .select('name')
      .order('order_index', { ascending: true });
    return handleResponse<string[]>(data?.map(d => d.name) || [], error);
  },

  async getExploring(): Promise<string[]> {
    const { data, error } = await supabase
      .from('exploring_items')
      .select('name')
      .order('order_index', { ascending: true });
    return handleResponse<string[]>(data?.map(d => d.name) || [], error);
  },

  async addLearning(name: string): Promise<void> {
    const { error } = await supabase
      .from('learning_items')
      .insert({ name, created_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  },

  async removeLearning(name: string): Promise<void> {
    const { error } = await supabase
      .from('learning_items')
      .delete()
      .eq('name', name);
    if (error) throw new Error(error.message);
  },

  async addExploring(name: string): Promise<void> {
    const { error } = await supabase
      .from('exploring_items')
      .insert({ name, created_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  },

  async removeExploring(name: string): Promise<void> {
    const { error } = await supabase
      .from('exploring_items')
      .delete()
      .eq('name', name);
    if (error) throw new Error(error.message);
  },
};