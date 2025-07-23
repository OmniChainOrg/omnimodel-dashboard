// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  // Development mode - log email instead of sending
  if (process.env.NODE_ENV !== 'production') {
    console.log(`
========== EMAIL PREVIEW ==========
To: ${to}
Subject: ${subject}
Body Preview: ${text?.substring(0, 100)}...
===================================
`);
    return res.status(200).json({ 
      success: true,
      message: 'In development - email logged to console'
    });
  }

  // Production mode - use SendGrid
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject,
      text,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.response?.body?.errors || error.message 
    });
  }
}
