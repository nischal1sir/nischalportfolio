import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Skill, SoftSkill } from '../types.js';

const router = Router();

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
    const {
      name, description, category, level, proficiency, icon,
      image_url, is_active, is_featured, show_on_home, order_index,
    } = req.body;

    if (!name || !category) {
      res.status(400).json({ error: 'Name and category are required' });
      return;
    }

    const newSkill = {
      name,
      description: description || '',
      category,
      level: level || 'Intermediate',
      proficiency: proficiency !== undefined ? Number(proficiency) : 80,
      icon: icon || '',
      image_url: image_url || '',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      is_featured: is_featured !== undefined ? Boolean(is_featured) : false,
      show_on_home: show_on_home !== undefined ? Boolean(show_on_home) : true,
      order_index: order_index !== undefined ? Number(order_index) : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('skills')
      .insert(newSkill)
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
    const {
      name, description, category, level, proficiency, icon,
      image_url, is_active, is_featured, show_on_home, order_index,
    } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (proficiency !== undefined) updateData.proficiency = Number(proficiency);
    if (icon !== undefined) updateData.icon = icon;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    if (is_featured !== undefined) updateData.is_featured = Boolean(is_featured);
    if (show_on_home !== undefined) updateData.show_on_home = Boolean(show_on_home);
    if (order_index !== undefined) updateData.order_index = Number(order_index);

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
