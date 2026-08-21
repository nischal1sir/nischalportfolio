import nodemailer from 'nodemailer';
import type { ContactInput } from '../types.js';

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendContactEmail(input: ContactInput): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] Email config not set - skipping email send');
    return { sent: false, error: 'Email not configured' };
  }

  const emailTo = process.env.EMAIL_TO || process.env.SMTP_USER;
  let emailFrom = process.env.EMAIL_FROM;

  if (!emailFrom || emailFrom.includes('your_gmail')) {
    emailFrom = `"Portfolio Contact" <${process.env.SMTP_USER}>`;
  }

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      replyTo: `"${input.name}" <${input.email}>`,
      subject: `Portfolio Contact: ${input.subject}`,
      text: `
New contact form submission from your portfolio:

Name: ${input.name}
Email: ${input.email}
Subject: ${input.subject}

Message:
${input.message}
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; border: 1px solid #e9ecef;">
    <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1a;">New Contact Form Submission</h2>
    
    <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #e9ecef;">
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}" style="color: #0066cc;">${escapeHtml(input.email)}</a></p>
      <p style="margin: 0;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
    </div>
    
    <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e9ecef;">
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 16px 0;">
    <p style="margin: 0; font-size: 12px; color: #6c757d;">Sent from your portfolio contact form</p>
  </div>
</body>
</html>
      `.trim(),
    });
    
    console.log('[email] Contact email sent successfully to', emailTo);
    return { sent: true };
  } catch (err) {
    console.error('[email] Failed to send contact email:', err);
    return { sent: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}