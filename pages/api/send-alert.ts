import { sendEmail } from '../../utils/sendEmail';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const event = req.body;

  try {
    // 1. Validate required fields
    if (!process.env.ALERT_RECIPIENT || !process.env.EMAIL_FROM) {
      throw new Error('Missing email configuration');
    }

    // 2. Send email with required 'from' field
    const emailResult = await sendEmail({
      to: process.env.ALERT_RECIPIENT,
      from: process.env.EMAIL_FROM, // <-- This was missing
      subject: `Zone Alert: ${event.zone?.toUpperCase() || 'UNKNOWN'}`,
      text: `Alert: ${event.message || 'No message'}\nZone: ${event.id || 'UNKNOWN'}`,
      html: `<p>Alert: ${event.message || 'No message'}</p><p>Zone: ${event.id || 'UNKNOWN'}</p>`
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error as string);
    }

    return res.status(200).json({ message: 'Alert sent' });
  } catch (error) {
    console.error('Alert failed:', error);
    return res.status(500).json({ 
      message: 'Failed to send alert',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
