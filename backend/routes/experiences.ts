import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Experience } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Experience[]);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, role, company, company_url, period, location, description, highlights, technologies, order_index } = req.body;

    if (!type || !role || !company || !period || !location || !description) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        type, role, company,
        company_url: company_url || null,
        period, location, description,
        highlights: highlights || [],
        technologies: technologies || [],
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as Experience);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, role, company, company_url, period, location, description, highlights, technologies, order_index } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (type !== undefined) updateData.type = type;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (company_url !== undefined) updateData.company_url = company_url;
    if (period !== undefined) updateData.period = period;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as Experience);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
