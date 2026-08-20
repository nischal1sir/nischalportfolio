import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Education } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Education[]);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { institution, degree, period, location, faculty, status, highlights, subjects, icon, order_index } = req.body;

    if (!institution || !degree || !period || !location) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('education')
      .insert({
        institution, degree, period, location,
        faculty: faculty || null,
        status: status || null,
        highlights: highlights || [],
        subjects: subjects || null,
        icon: icon || 'GraduationCap',
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as Education);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { institution, degree, period, location, faculty, status, highlights, subjects, icon, order_index } = req.body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (institution !== undefined) updateData.institution = institution;
    if (degree !== undefined) updateData.degree = degree;
    if (period !== undefined) updateData.period = period;
    if (location !== undefined) updateData.location = location;
    if (faculty !== undefined) updateData.faculty = faculty;
    if (status !== undefined) updateData.status = status;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (subjects !== undefined) updateData.subjects = subjects;
    if (icon !== undefined) updateData.icon = icon;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('education')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as Education);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Education entry deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
