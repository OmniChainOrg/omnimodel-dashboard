import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/sendEmail';
import fs from 'fs/promises';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;

  // 1. Log to file system
  await fs.appendFile(
    './logs/alerts.log',
    `${new Date().toISOString()} - ${JSON.stringify(event)}\n`
  );

  // 2. Send email alert
  const emailResult = await sendEmail({
    to: process.env.ALERT_RECIPIENT!,
    subject: `Zone Alert: ${event.zone.toUpperCase()}`,
    text: `Zone ${event.id} triggered alert: ${event.message}`,
    html: `
      <div>
        <h2>Zone Alert</h2>
        <p><strong>Zone ID:</strong> ${event.id}</p>
        <p><strong>Level:</strong> ${event.zone}</p>
        <p><strong>Message:</strong> ${event.message}</p>
        <p><strong>Time:</strong> ${new Date(event.timestamp).toLocaleString()}</p>
      </div>
    `
  });

  res.status(emailResult.success ? 200 : 500).json({
    logged: true,
    emailSent: emailResult.success,
    emailError: emailResult.error
  });
}
