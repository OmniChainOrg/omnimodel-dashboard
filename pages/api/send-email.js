// pages/api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Free test key

export default async function handler(req, res) {
  await resend.emails.send({
    from: 'onboarding@resend.dev', // Pre-verified domain
    to: req.body.to || 'omnichain@icloud.com',
    subject: 'New Zone Generated',
    html: `<p>Zone created: ${JSON.stringify(req.body.zoneData)}</p>`
  });

  return res.status(200).json({ success: true });
}
