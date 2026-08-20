import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase, requireAuth } from '../config/supabase.js';
import type { Faq } from '../types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data as Faq[]);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, answer, order_index } = req.body;
    if (!question || !answer) {
      res.status(400).json({ error: 'Question and answer are required' });
      return;
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question, answer,
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data as Faq);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, answer, order_index } = req.body;
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('faqs')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data as Faq);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
