import type { GalleryImage } from '../types';

export const galleryImages: GalleryImage[] = [
  {
    id: 'g-1',
    title: 'Workspace setup',
    description: 'A clean developer desk with dual monitors and warm lighting.',
    image_url:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    category: 'Setup',
    tags: ['workspace', 'desk', 'monitors'],
    featured: true,
    order_index: 0,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'g-2',
    title: 'Late-night coding',
    description: 'Dark IDE theme at 2am — when the best ideas land.',
    image_url:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    category: 'Code',
    tags: ['coding', 'night', 'ide'],
    featured: false,
    order_index: 1,
    created_at: '2024-09-04T00:00:00Z',
    updated_at: '2024-09-04T00:00:00Z',
  },
  {
    id: 'g-3',
    title: 'Whiteboard session',
    description: 'Planning architecture before writing the first line.',
    image_url:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    category: 'Planning',
    tags: ['planning', 'architecture', 'whiteboard'],
    featured: true,
    order_index: 2,
    created_at: '2024-09-08T00:00:00Z',
    updated_at: '2024-09-08T00:00:00Z',
  },
];
