import { supabase } from '../lib/supabase';
import type { ContactMessage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      return {
        ok: true,
        message: "Thanks for reaching out! Your message has been sent successfully.",
      };
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, message: 'Request was cancelled.' };
    }
  }

  // Fallback direct to Supabase
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        created_at: body.createdAt,
      });

    if (!error) {
      return {
        ok: true,
        message: "Thanks for reaching out! Your message has been sent successfully.",
      };
    }
  } catch {
    // Ignore error
  }

  return {
    ok: false,
    message:
      'Could not reach the server. Your message was not sent. Please try again or email me directly.',
  };
}
