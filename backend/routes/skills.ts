import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Skill, SoftSkill } from '../types.js';

const router = Router();

const validCategories = ['language', 'frontend', 'backend', 'database', 'tools', 'learning', 'exploring'];

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Skill[]);
  } catch (err) {
    next(err);
  }
});

router.get('/soft', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('soft_skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as SoftSkill[]);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, order_index } = req.body;
    if (!name || !category) {
      res.status(400).json({ error: 'Name and category are required' });
      return;
    }
    if (!validCategories.includes(category)) {
      res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
      return;
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({ name, category, order_index: order_index || 0 })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as Skill);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) {
      if (!validCategories.includes(category)) {
        res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
        return;
      }
      updateData.category = category;
    }
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as Skill);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/soft', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, order_index } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required' });
      return;
    }

    const { data, error } = await supabase
      .from('soft_skills')
      .insert({ name, description, order_index: order_index || 0 })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as SoftSkill);
  } catch (err) {
    next(err);
  }
});

router.put('/soft/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('soft_skills')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as SoftSkill);
  } catch (err) {
    next(err);
  }
});

router.delete('/soft/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('soft_skills')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Soft skill deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
