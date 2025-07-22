// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Type-safe SendGrid initialization
let sgMail: typeof import('@sendgrid/mail') | null = null;

if (process.env.NODE_ENV === 'production') {
  sgMail = require('@sendgrid/mail');
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('Missing SENDGRID_API_KEY environment variable');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Development mode - safe email logging
  if (process.env.NODE_ENV !== 'production') {
    const { to, subject, text } = req.body;
    console.log(`
    ========== EMAIL PREVIEW ==========
    To: ${to || process.env.omnichain@icloud.com}
    Subject: ${subject}
    Body Preview: ${text?.substring(0, 100)}...
    ===================================
    `);
    return res.status(200).json({ success: true });
  }

  // Production mode - real sending
  try {
    if (!sgMail) throw new Error('SendGrid not initialized');
    
    await sgMail.send({
      to: req.body.to || process.env.omnichain@icloud.com,
      from: process.env.raphweninger@gmail.com as string,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
    });
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email send failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.response?.body?.errors || error.message 
    });
  }
}
