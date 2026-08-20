export interface Project {
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

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}
