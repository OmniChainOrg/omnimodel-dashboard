// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await sgMail.send({
      to: req.body.to || process.env.NEXT_PUBLIC_EMAIL_RECIPIENT!, // Fallback to icloud
      from: process.env.SENDGRID_VERIFIED_SENDER!,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.response?.body?.errors || error.message 
    });
  }
}
