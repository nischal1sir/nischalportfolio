import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Profile, PhilosophyItem, ProgressionItem } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    res.json(data as Profile);
  } catch (err) {
    next(err);
  }
});

router.get('/philosophy', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('philosophy_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as PhilosophyItem[]);
  } catch (err) {
    next(err);
  }
});

router.get('/progression', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('progression_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as ProgressionItem[]);
  } catch (err) {
    next(err);
  }
});

router.put('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, taglines, headline, intro, about, resume_url, location, email } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (taglines !== undefined) updateData.taglines = taglines;
    if (headline !== undefined) updateData.headline = headline;
    if (intro !== undefined) updateData.intro = intro;
    if (about !== undefined) updateData.about = about;
    if (resume_url !== undefined) updateData.resume_url = resume_url;
    if (location !== undefined) updateData.location = location;
    if (email !== undefined) updateData.email = email;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .select()
      .single();

    if (error) throw error;
    res.json(data as Profile);
  } catch (err) {
    next(err);
  }
});

router.post('/philosophy', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, icon, order_index } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const { data, error } = await supabase
      .from('philosophy_items')
      .insert({
        profile_id: '00000000-0000-0000-0000-000000000001',
        title,
        description,
        icon: icon || 'book-open',
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as PhilosophyItem);
  } catch (err) {
    next(err);
  }
});

router.put('/philosophy/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, icon, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('philosophy_items')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as PhilosophyItem);
  } catch (err) {
    next(err);
  }
});

router.delete('/philosophy/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('philosophy_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Philosophy item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/progression', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { step, order_index } = req.body;
    if (!step) {
      res.status(400).json({ error: 'Step is required' });
      return;
    }

    const { data, error } = await supabase
      .from('progression_items')
      .insert({
        profile_id: '00000000-0000-0000-0000-000000000001',
        step,
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as ProgressionItem);
  } catch (err) {
    next(err);
  }
});

router.put('/progression/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { step, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (step !== undefined) updateData.step = step;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('progression_items')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as ProgressionItem);
  } catch (err) {
    next(err);
  }
});

router.delete('/progression/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('progression_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Progression item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
