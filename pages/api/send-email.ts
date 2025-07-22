// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Dynamic import to handle development/production environments
let sgMail: any;
if (process.env.NODE_ENV === 'production') {
  sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.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!);
}

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
    console.log('\n📧 Dev Email Output:');
    console.log('To:', to || process.env.omnichain@icloud.com);
    console.log('Subject:', subject);
    console.log('Body:', text);
    console.log('----------------------\n');
    return res.status(200).json({ success: true, message: 'Dev mode - email logged' });
  }

  // Production mode - send real email
  try {
    await sgMail.send({
      to: to || process.env.omnichain@icloud.com,
      from: process.env.raphweninger@gmail.com!,
      subject,
      text,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body?.errors || error.message);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.response?.body?.errors || error.message 
    });
  }
}
