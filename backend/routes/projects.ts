import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Project } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Project[]);
  } catch (err) {
    next(err);
  }
});

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Project[]);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(data as Project);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index } = req.body;

    if (!title || !description || !short_description || !image_url) {
      res.status(400).json({ error: 'Missing required fields: title, description, short_description, image_url' });
      return;
    }

    const projectId = id || `p-${Date.now()}`;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        title,
        description,
        short_description,
        image_url,
        github_url: github_url || null,
        live_url: live_url || null,
        technologies: technologies || [],
        category: category || 'Web App',
        featured: featured || false,
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as Project);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (short_description !== undefined) updateData.short_description = short_description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (github_url !== undefined) updateData.github_url = github_url;
    if (live_url !== undefined) updateData.live_url = live_url;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (category !== undefined) updateData.category = category;
    if (featured !== undefined) updateData.featured = featured;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as Project);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
