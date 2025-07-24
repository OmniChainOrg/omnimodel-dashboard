// utils/sendEmail.ts
import sgMail from '@sendgrid/mail';

// 1. Define the interface
interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// 2. Implement the function (must use 'export')
export async function sendEmail({
  to,
  subject,
  text,
  html
}: EmailParams) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Email Mock]', { to, subject, text });
    return { success: true };
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    await sgMail.send({
      to,
      from: process.env.SENDGRID_SENDER!,
      subject,
      text,
      html: html || `<p>${text}</p>`
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// 3. Verify export type (for TypeScript)
export type { EmailParams };
