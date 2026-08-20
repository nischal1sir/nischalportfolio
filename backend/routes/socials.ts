import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { SocialLink } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as SocialLink[]);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { label, href, icon, order_index } = req.body;
    if (!label || !href) {
      res.status(400).json({ error: 'Label and href are required' });
      return;
    }

    const { data, error } = await supabase
      .from('social_links')
      .insert({
        label, href,
        icon: icon || 'link',
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as SocialLink);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { label, href, icon, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (label !== undefined) updateData.label = label;
    if (href !== undefined) updateData.href = href;
    if (icon !== undefined) updateData.icon = icon;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('social_links')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as SocialLink);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Social link deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
