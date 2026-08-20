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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (cancelled) return;
        if (error || !data) {
          if (error) setError(error.message);
          setProfile(defaultProfile);
        } else {
          setProfile(data);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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

  return { images, loading, error };
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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
        if (error || !data || data.length === 0) {
          if (error) setError(error.message);
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