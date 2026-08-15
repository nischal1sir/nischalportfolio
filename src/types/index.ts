export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
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
