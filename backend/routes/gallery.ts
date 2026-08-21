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

router.get('/about-preview', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: previewData, error: previewErr } = await supabase
      .from('about_gallery_preview')
      .select('gallery_item_id, display_order')
      .order('display_order', { ascending: true });

    if (previewErr || !previewData || previewData.length === 0) {
      // Fallback to top 3 gallery items
      const { data: fallback, error: fbErr } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(3);
      if (fbErr) throw fbErr;
      res.json(fallback as GalleryImage[]);
      return;
    }

    const itemIds = previewData.map(p => p.gallery_item_id);
    const { data: galleryItems, error: itemsErr } = await supabase
      .from('gallery')
      .select('*')
      .in('id', itemIds);

    if (itemsErr) throw itemsErr;

    // Order items according to display_order in previewData
    const itemsMap = new Map((galleryItems || []).map(item => [item.id, item]));
    const orderedItems = previewData
      .map(p => itemsMap.get(p.gallery_item_id))
      .filter((item): item is GalleryImage => Boolean(item));

    res.json(orderedItems);
  } catch (err) {
    next(err);
  }
});

router.put('/about-preview', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item_ids } = req.body as { item_ids: string[] };
    if (!Array.isArray(item_ids)) {
      res.status(400).json({ error: 'item_ids array is required' });
      return;
    }

    // Delete existing selections
    await supabase.from('about_gallery_preview').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new selections
    const newRecords = item_ids.slice(0, 3).map((id, index) => ({
      gallery_item_id: id,
      display_order: index,
    }));

    if (newRecords.length > 0) {
      const { error } = await supabase.from('about_gallery_preview').insert(newRecords);
      if (error) throw error;
    }

    res.json({ success: true, message: 'About page preview selection updated' });
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
    const {
      id, title, description, image_url, category, tags, featured, order_index,
      shape, width, height, position_x, position_y, z_index, object_fit, object_position, is_visible
    } = req.body;

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
        shape: shape || 'medium_square',
        width: width || 4,
        height: height || 3,
        position_x: position_x ?? null,
        position_y: position_y ?? null,
        z_index: z_index || 1,
        object_fit: object_fit || 'cover',
        object_position: object_position || 'center',
        is_visible: is_visible !== undefined ? is_visible : true,
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
    const {
      title, description, image_url, category, tags, featured, order_index,
      shape, width, height, position_x, position_y, z_index, object_fit, object_position, is_visible
    } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (featured !== undefined) updateData.featured = featured;
    if (order_index !== undefined) updateData.order_index = order_index;
    if (shape !== undefined) updateData.shape = shape;
    if (width !== undefined) updateData.width = width;
    if (height !== undefined) updateData.height = height;
    if (position_x !== undefined) updateData.position_x = position_x;
    if (position_y !== undefined) updateData.position_y = position_y;
    if (z_index !== undefined) updateData.z_index = z_index;
    if (object_fit !== undefined) updateData.object_fit = object_fit;
    if (object_position !== undefined) updateData.object_position = object_position;
    if (is_visible !== undefined) updateData.is_visible = is_visible;

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
