// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Type declaration for SendGrid to avoid import issues
type SendGridMail = {
  setApiKey: (key: string) => void;
  send: (msg: any) => Promise<any>;
};

let sgMail: SendGridMail | null = null;

if (process.env.NODE_ENV === 'production') {
  // Dynamic require to prevent dev dependency issues
  sgMail = require('@sendgrid/mail') as unknown as SendGridMail;
  
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Missing SENDGRID_API_KEY');
    process.exit(1);
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

  const { to, subject, text, html } = req.body;

  // Development mode - safe email logging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`
    ========== EMAIL PREVIEW ==========
    To: ${to || process.env.omnichain@icloud.com}
    Subject: ${subject}
    Body Preview: ${text?.substring(0, 100)}...
    ===================================
    `);
    return res.status(200).json({ success: true });
  }

  // Production mode
  try {
    if (!sgMail) throw new Error('SendGrid not initialized');
    
    await sgMail.send({
      to: to || process.env.omnichain@icloud.com,
      from: process.env.raphweninger@gmail.com as string,
      subject,
      text,
      html,
    });
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.response?.body?.errors || error.message 
    });
  }
}
