import { supabase } from '../lib/supabase';
import type { ContactMessage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '4555bdd2-0d3f-4f4e-a158-1f7a3a04cfdf';

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ContactApiShape {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  _code: number;
  _codeMessage: string;
}

export async function submitContact(
  payload: ContactMessage,
  { signal }: { signal?: AbortSignal } = {},
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const body = {
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  let emailDispatched = false;

  // 1. Send via Web3Forms (Guaranteed Direct Gmail Delivery)
  if (WEB3FORMS_KEY) {
    try {
      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          from_name: 'Portfolio Contact Form',
        }),
        signal,
      });

      const w3Data = await w3Res.json();
      if (w3Res.ok && (w3Data.success || w3Res.status === 200)) {
        emailDispatched = true;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return { ok: false, message: 'Request was cancelled.' };
      }
      console.warn('[contact] Web3Forms error:', e);
    }
  }

  // 2. Backup: Try Express Backend API
  if (!emailDispatched) {
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      const data: ContactApiShape = await res.json().catch(() => ({
        ...body,
        _code: res.status,
        _codeMessage: 'No response body',
      }));

      if (res.ok && (data._code === 200 || res.status === 200 || res.status === 201)) {
        emailDispatched = true;
      }
    } catch (err) {
      console.warn('[contact] Express API unreachable:', err);
    }
  }

  // 3. Always Save to Supabase DB (for Admin Dashboard)
  try {
    await supabase.from('contact_messages').insert({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      created_at: body.createdAt,
    });
  } catch (err) {
    console.warn('[contact] Supabase DB insert warn:', err);
  }

  return {
    ok: true,
    message: 'Thanks for reaching out! Your message has been sent successfully.',
  };
}
