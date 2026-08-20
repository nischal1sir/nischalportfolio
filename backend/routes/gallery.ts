import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { GalleryImage } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as GalleryImage[]);
  } catch (err) {
    next(err);
  }
});

router.get('/category/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('category', req.params.category)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as GalleryImage[]);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }
    res.json(data as GalleryImage);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, title, description, image_url, category, tags, featured, order_index } = req.body;

    if (!title || !image_url || !category) {
      res.status(400).json({ error: 'Title, image_url, and category are required' });
      return;
    }

    const galleryId = id || `g-${Date.now()}`;

    const { data, error } = await supabase
      .from('gallery')
      .insert({
        id: galleryId,
        title,
        description: description || null,
        image_url,
        category,
        tags: tags || [],
        featured: featured || false,
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as GalleryImage);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, image_url, category, tags, featured, order_index } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (featured !== undefined) updateData.featured = featured;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as GalleryImage);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
