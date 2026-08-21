export interface Profile {
  id: string;
  name: string;
  role: string;
  taglines: string[];
  headline: string;
  intro: string;
  about: string;
  resume_url: string | null;
  location: string;
  email: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface PhilosophyItem {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProgressionItem {
  id: string;
  profile_id: string;
  step: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SkillCategory = string;
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category: SkillCategory;
  level?: SkillLevel;
  proficiency?: number;
  icon?: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  show_on_home?: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface SoftSkill {
  id: string;
  name: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  github_url: string | null;
  live_url: string | null;
  technologies: string[];
  category: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type ExperienceType = 'freelance' | 'internship' | 'role';

export interface Experience {
  id: string;
  type: ExperienceType;
  role: string;
  company: string;
  company_url: string | null;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  faculty: string | null;
  status: string | null;
  highlights: string[];
  subjects: string[] | null;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type GalleryShape =
  | 'small_square'
  | 'medium_square'
  | 'large_square'
  | 'portrait'
  | 'tall_portrait'
  | 'landscape'
  | 'wide_landscape'
  | 'large_feature'
  | 'custom';

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  tags: string[];
  featured: boolean;
  order_index: number;
  shape?: GalleryShape;
  width?: number; // 1 to 12 col span
  height?: number; // 1 to 6 row span
  position_x?: number | null; // col start
  position_y?: number | null; // row start
  z_index?: number;
  object_fit?: 'cover' | 'contain';
  object_position?: string;
  is_visible?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutGalleryPreviewItem {
  id: string;
  gallery_item_id: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  gallery_item?: GalleryImage;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface NavLink {
  id: string;
  label: string;
  to: string;
  icon: string;
  is_contact: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

export interface SubmitContactResult {
  ok: boolean;
  message: string;
}