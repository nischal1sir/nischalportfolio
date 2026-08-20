import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export const supabaseAnon = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY || '',
  { auth: { persistSession: false } }
);

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
