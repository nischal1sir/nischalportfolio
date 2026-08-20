import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
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

export default router;
