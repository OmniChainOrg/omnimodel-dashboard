// pages/api/send-email.js
const { Resend } = require('resend');

export default async function handler(req, res) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: req.body.to || 'omnichain@icloud.com',
      subject: req.body.subject || 'Zone Notification',
      html: `<p>${req.body.text || 'New zone generated'}</p>`
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: error.message });
  }
}
