import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Profile, PhilosophyItem, ProgressionItem,
  Skill, SoftSkill, Project, Experience, Education,
  Service, SocialLink, GalleryImage, Faq, NavLink,
} from '../types';

import { profile as fbProfile, philosophy as fbPhilosophy, progression as fbProgression } from '../data/profile';
import { skills as fbSkills } from '../data/skills';
import { projects as fbProjects } from '../data/projects';
import { experiences as fbExperiences } from '../data/experience';
import { education as fbEducation } from '../data/education';
import { services as fbServices } from '../data/services';
import { socials as fbSocials } from '../data/socials';
import { galleryImages as fbGallery } from '../data/gallery';
import { faqs as fbFaqs } from '../data/faqs';
import { navLinks as fbNav } from '../data/nav';

// Helper date
const now = new Date().toISOString();

// Construct clean typed fallbacks
const defaultProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: fbProfile.name,
  role: fbProfile.role,
  taglines: fbProfile.taglines,
  headline: fbProfile.headline,
  intro: fbProfile.intro,
  about: fbProfile.about,
  resume_url: fbProfile.resumeUrl || null,
  location: fbProfile.location,
  email: fbProfile.email,
  interests: fbProfile.interests || [],
  created_at: now,
  updated_at: now,
};

const defaultPhilosophy: PhilosophyItem[] = fbPhilosophy.map((p, idx) => ({
  id: `phil-${idx}`,
  profile_id: '00000000-0000-0000-0000-000000000001',
  title: p.title,
  description: p.description,
  icon: p.icon || 'book-open',
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultProgression: ProgressionItem[] = fbProgression.map((step, idx) => ({
  id: `prog-${idx}`,
  profile_id: '00000000-0000-0000-0000-000000000001',
  step,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultSkills: Skill[] = fbSkills.map((s, idx) => ({
  id: `skill-${idx}`,
  name: s.name,
  category: s.category as any,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultProjects: Project[] = fbProjects.map((p, idx) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  short_description: p.short_description || p.description.slice(0, 100),
  image_url: p.image_url,
  github_url: p.github_url || null,
  live_url: p.live_url || null,
  technologies: p.technologies,
  category: p.category,
  featured: p.featured,
  order_index: idx,
  created_at: p.created_at || now,
  updated_at: p.updated_at || now,
}));

const defaultExperiences: Experience[] = fbExperiences.map((e, idx) => ({
  id: e.id,
  type: e.type,
  role: e.role,
  company: e.company,
  company_url: e.companyUrl || null,
  period: e.period,
  location: e.location,
  description: e.description,
  highlights: e.highlights,
  technologies: e.technologies,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultEducation: Education[] = fbEducation.map((e, idx) => ({
  id: e.id,
  institution: e.institution,
  degree: e.degree,
  period: e.period,
  location: e.location,
  faculty: e.faculty || null,
  status: e.status || null,
  highlights: e.highlights,
  subjects: e.subjects || null,
  icon: typeof e.icon === 'string' ? e.icon : 'graduation-cap',
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultServices: Service[] = fbServices.map((s, idx) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  icon: s.icon,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultSocials: SocialLink[] = fbSocials.map((s, idx) => ({
  id: `soc-${idx}`,
  label: s.label,
  href: s.href,
  icon: s.icon,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultGallery: GalleryImage[] = fbGallery.map((g, idx) => ({
  id: g.id,
  title: g.title,
  description: g.description || null,
  image_url: g.image_url,
  category: g.category,
  tags: g.tags,
  featured: g.featured,
  order_index: g.order_index ?? idx,
  shape: (g as any).shape || (idx % 3 === 0 ? 'portrait' : idx % 3 === 1 ? 'landscape' : 'medium_square'),
  width: (g as any).width || 4,
  height: (g as any).height || (idx % 3 === 0 ? 4 : 2),
  position_x: (g as any).position_x ?? null,
  position_y: (g as any).position_y ?? null,
  z_index: (g as any).z_index || 1,
  object_fit: (g as any).object_fit || 'cover',
  object_position: (g as any).object_position || 'center',
  is_visible: (g as any).is_visible !== undefined ? (g as any).is_visible : true,
  created_at: g.created_at || now,
  updated_at: g.updated_at || now,
}));

const defaultFaqs: Faq[] = fbFaqs.map((f, idx) => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

const defaultNav: NavLink[] = fbNav.map((n, idx) => ({
  id: `nav-${idx}`,
  label: n.label,
  to: n.to,
  icon: n.icon,
  is_contact: false,
  order_index: idx,
  created_at: now,
  updated_at: now,
}));

// ============================================================================
// PUBLIC DATA FETCHING HOOKS
// ============================================================================

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProfile() {
      try {
        let fetchedData: Profile | null = null;
        const { data, error: selectErr } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (selectErr) {
          setError(selectErr.message);
          const { data: fbData } = await supabase
            .from('profiles')
            .select('id, name, role, taglines, headline, intro, about, resume_url, location, email, created_at, updated_at')
            .limit(1)
            .maybeSingle();
          fetchedData = fbData as Profile | null;
        } else {
          fetchedData = data as Profile | null;
        }

        if (cancelled) return;

        if (!fetchedData) {
          setProfile(defaultProfile);
        } else {
          let interests = fetchedData.interests;
          if (!interests || interests.length === 0) {
            try {
              const localStr = localStorage.getItem('nischal_portfolio_interests');
              if (localStr) {
                const parsed = JSON.parse(localStr);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  interests = parsed;
                }
              }
            } catch (_) {}
          }
          if (!interests || interests.length === 0) {
            interests = defaultProfile.interests;
          }

          setProfile({ ...fetchedData, interests });
        }
      } catch (err) {
        if (!cancelled) setProfile(defaultProfile);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  return { profile, loading, error };
}

export function usePhilosophy() {
  const [items, setItems] = useState<PhilosophyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPhilosophy() {
      try {
        const { data, error } = await supabase
          .from('philosophy_items')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setItems(defaultPhilosophy);
        } else if (!data) {
          setItems(defaultPhilosophy);
        } else {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) setItems(defaultPhilosophy);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPhilosophy();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}

export function useProgression() {
  const [items, setItems] = useState<ProgressionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProgression() {
      try {
        const { data, error } = await supabase
          .from('progression_items')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setItems(defaultProgression);
        } else if (!data) {
          setItems(defaultProgression);
        } else {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) setItems(defaultProgression);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProgression();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProjects() {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (featuredOnly) {
          query = query.eq('featured', true);
        }

        const { data, error } = await query;
        if (cancelled) return;
        if (error) {
          setError(error.message);
          const fb = featuredOnly ? defaultProjects.filter(p => p.featured) : defaultProjects;
          setProjects(fb);
        } else if (!data) {
          const fb = featuredOnly ? defaultProjects.filter(p => p.featured) : defaultProjects;
          setProjects(fb);
        } else {
          setProjects(data);
        }
      } catch (err) {
        if (!cancelled) {
          const fb = featuredOnly ? defaultProjects.filter(p => p.featured) : defaultProjects;
          setProjects(fb);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProjects();
    return () => { cancelled = true; };
  }, [featuredOnly]);

  return { projects, loading, error };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSkills() {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setSkills(defaultSkills);
        } else if (!data) {
          setSkills(defaultSkills);
        } else {
          setSkills(data);
        }
      } catch (err) {
        if (!cancelled) setSkills(defaultSkills);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSkills();
    return () => { cancelled = true; };
  }, []);

  return { skills, loading, error };
}

export function useSoftSkills() {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSoftSkills() {
      try {
        const { data, error } = await supabase
          .from('soft_skills')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
          setSkills([]);
        } else {
          setSkills(data);
        }
      } catch (err) {
        if (!cancelled) setSkills([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSoftSkills();
    return () => { cancelled = true; };
  }, []);

  return { skills, loading, error };
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setExperiences(defaultExperiences);
        } else if (!data) {
          setExperiences(defaultExperiences);
        } else {
          setExperiences(data);
        }
      } catch (err) {
        if (!cancelled) setExperiences(defaultExperiences);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchExperiences();
    return () => { cancelled = true; };
  }, []);

  return { experiences, loading, error };
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchEducation() {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setEducation(defaultEducation);
        } else if (!data) {
          setEducation(defaultEducation);
        } else {
          setEducation(data);
        }
      } catch (err) {
        if (!cancelled) setEducation(defaultEducation);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEducation();
    return () => { cancelled = true; };
  }, []);

  return { education, loading, error };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setServices(defaultServices);
        } else if (!data) {
          setServices(defaultServices);
        } else {
          setServices(data);
        }
      } catch (err) {
        if (!cancelled) setServices(defaultServices);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchServices();
    return () => { cancelled = true; };
  }, []);

  return { services, loading, error };
}

export function useSocials() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSocials() {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setSocials(defaultSocials);
        } else if (!data || data.length === 0) {
          setSocials(defaultSocials);
        } else {
          setSocials(data);
        }
      } catch (err) {
        if (!cancelled) setSocials(defaultSocials);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSocials();
    return () => { cancelled = true; };
  }, []);

  return { socials, loading, error };
}

export function useGallery(category?: string) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchGallery() {
      try {
        let query = supabase
          .from('gallery')
          .select('*')
          .order('order_index', { ascending: true });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (cancelled) return;
        if (error) {
          setError(error.message);
          const fb = category ? defaultGallery.filter(g => g.category === category) : defaultGallery;
          setImages(fb);
        } else if (!data) {
          const fb = category ? defaultGallery.filter(g => g.category === category) : defaultGallery;
          setImages(fb);
        } else {
          setImages(data);
        }
      } catch (err) {
        if (!cancelled) {
          const fb = category ? defaultGallery.filter(g => g.category === category) : defaultGallery;
          setImages(fb);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGallery();
    return () => { cancelled = true; };
  }, [category]);

  return { gallery: images, images, loading, error };
}

export function useAboutGalleryPreview() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPreview() {
      try {
        const { data: previewData, error: pErr } = await supabase
          .from('about_gallery_preview')
          .select('gallery_item_id, display_order')
          .order('display_order', { ascending: true });

        if (cancelled) return;

        if (!pErr && previewData && previewData.length > 0) {
          const itemIds = previewData.map(p => p.gallery_item_id);
          const { data: galleryData, error: gErr } = await supabase
            .from('gallery')
            .select('*')
            .in('id', itemIds);

          if (!cancelled && !gErr && galleryData && galleryData.length > 0) {
            const map = new Map(galleryData.map(item => [item.id, item]));
            const ordered = previewData
              .map(p => map.get(p.gallery_item_id))
              .filter((item): item is GalleryImage => Boolean(item));

            if (ordered.length > 0) {
              setItems(ordered);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback: top 3 gallery items
        const { data: fallback, error: fbErr } = await supabase
          .from('gallery')
          .select('*')
          .order('order_index', { ascending: true })
          .limit(3);

        if (cancelled) return;

        if (!fbErr && fallback && fallback.length > 0) {
          setItems(fallback);
        } else {
          setItems(defaultGallery.slice(0, 3));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error fetching preview');
          setItems(defaultGallery.slice(0, 3));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPreview();
    return () => { cancelled = true; };
  }, []);

  return { previewImages: items, loading, error };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchFaqs() {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setFaqs(defaultFaqs);
        } else if (!data) {
          setFaqs(defaultFaqs);
        } else {
          setFaqs(data);
        }
      } catch (err) {
        if (!cancelled) setFaqs(defaultFaqs);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFaqs();
    return () => { cancelled = true; };
  }, []);

  return { faqs, loading, error };
}

export function useNavLinks() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchNav() {
      try {
        const { data, error } = await supabase
          .from('nav_links')
          .select('*')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setNavLinks(defaultNav);
        } else if (!data) {
          setNavLinks(defaultNav);
        } else {
          setNavLinks(data);
        }
      } catch (err) {
        if (!cancelled) setNavLinks(defaultNav);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchNav();
    return () => { cancelled = true; };
  }, []);

  return { navLinks, loading, error };
}

export function useLearningItems() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchLearning() {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('name')
          .eq('category', 'learning')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
          const learningFromSkills = fbSkills.filter(s => s.category === 'learning').map(s => s.name);
          setItems(learningFromSkills.length > 0 ? learningFromSkills : ['TypeScript', 'Next.js 14', 'PostgreSQL', 'TailwindCSS']);
        } else {
          setItems(data.map(d => d.name));
        }
      } catch (err) {
        if (!cancelled) setItems(['TypeScript', 'Next.js 14', 'PostgreSQL', 'TailwindCSS']);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchLearning();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}

export function useExploringItems() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchExploring() {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('name')
          .eq('category', 'exploring')
          .order('order_index', { ascending: true });

        if (cancelled) return;
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
          const exploringFromSkills = fbSkills.filter(s => s.category === 'exploring').map(s => s.name);
          setItems(exploringFromSkills.length > 0 ? exploringFromSkills : ['GraphQL', 'Docker', 'AWS Lambda', 'WebSockets']);
        } else {
          setItems(data.map(d => d.name));
        }
      } catch (err) {
        if (!cancelled) setItems(['GraphQL', 'Docker', 'AWS Lambda', 'WebSockets']);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchExploring();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}