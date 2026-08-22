import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.warn(' WARNING: SUPABASE_URL or SUPABASE_SERVICE_KEY is missing from environment variables!');
    console.warn(`Status -> SUPABASE_URL: ${process.env.SUPABASE_URL ? 'OK' : 'MISSING'}, SUPABASE_SERVICE_KEY: ${process.env.SUPABASE_SERVICE_KEY ? 'OK' : 'MISSING'}`);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});
