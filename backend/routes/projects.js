import { Router } from 'express';
import { supabase } from '../config/supabase.js';
const router = Router();
router.get('/', async (_req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
router.get('/featured', async (_req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
export default router;
