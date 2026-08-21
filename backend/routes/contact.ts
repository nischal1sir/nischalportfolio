import { Router, type Request, type Response, type NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import type { ContactInput } from '../types.js';
import { sendContactEmail, isEmailConfigured } from '../services/email.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 100, email: 200, subject: 200, message: 5000 } as const;

function validateContact(input: Partial<ContactInput>): string[] {
  const errors: string[] = [];
  const name = (input.name ?? '').toString().trim();
  const email = (input.email ?? '').toString().trim();
  const subject = (input.subject ?? '').toString().trim();
  const message = (input.message ?? '').toString().trim();

  if (!name) errors.push('Name is required.');
  else if (name.length > MAX.name) errors.push(`Name must be at most ${MAX.name} characters.`);

  if (!email) errors.push('Email is required.');
  else if (!EMAIL_RE.test(email)) errors.push('Email is invalid.');
  else if (email.length > MAX.email) errors.push(`Email must be at most ${MAX.email} characters.`);

  if (!subject) errors.push('Subject is required.');
  else if (subject.length > MAX.subject) errors.push(`Subject must be at most ${MAX.subject} characters.`);

  if (!message) errors.push('Message is required.');
  else if (message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  else if (message.length > MAX.message) errors.push(`Message must be at most ${MAX.message} characters.`);

  return errors;
}

router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const input = req.body as Partial<ContactInput>;
    const errors = validateContact(input);
    if (errors.length > 0) {
      return res.status(200).json({
        _code: 400,
        _codeMessage: errors[0],
      });
    }

    const createdAt = new Date().toISOString();

    const clean: ContactInput = {
      name: String(input.name).trim().slice(0, MAX.name),
      email: String(input.email).trim().slice(0, MAX.email),
      subject: String(input.subject).trim().slice(0, MAX.subject),
      message: String(input.message).trim().slice(0, MAX.message),
    };

    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: clean.name,
      email: clean.email,
      subject: clean.subject,
      message: clean.message,
      created_at: createdAt,
    });

    if (dbError) {
      console.warn('[contact] Supabase DB insert error (message will still attempt email send):', dbError.message);
    }

    // Send email notification
    let emailSent = false;
    if (isEmailConfigured()) {
      const emailResult = await sendContactEmail(clean);
      emailSent = emailResult.sent;
      if (!emailResult.sent) {
        console.warn('[contact] Email not sent:', emailResult.error);
      }
    } else {
      console.warn('[contact] Email not configured - message saved to database only');
    }

    return res.status(200).json({
      name: clean.name,
      email: clean.email,
      subject: clean.subject,
      message: clean.message,
      createdAt: createdAt,
      _code: 200,
      _codeMessage: 'Message received.',
    });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(200).json({
      _code: 500,
      _codeMessage: 'Something went wrong while sending your message. Please try again.',
    });
  }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
