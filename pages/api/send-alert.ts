// pages/api/send-alert.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/sendEmail'; // Fixed path
import fs from 'fs/promises';
import path from 'path';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'alerts.log');

async function ensureLogsDir() {
  try {
    await fs.mkdir(logDir, { recursive: true });
  } catch (err) {
    console.error('Could not create logs dir:', err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await ensureLogsDir();

  try {
    const event = req.body;
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(event)}\n`;

    // 1. Log to file
    await fs.appendFile(logFile, logEntry);

    // 2. Send email
    const emailResult = await sendEmail({
      to: process.env.ALERT_RECIPIENT!,
      subject: `Zone Alert: ${event.zone?.toUpperCase() || 'UNKNOWN'}`,
      text: `Alert: ${event.message || 'No message'}\nZone: ${event.id || 'UNKNOWN'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #dc3545;">Zone Alert</h2>
          <p><strong>ID:</strong> ${event.id || 'N/A'}</p>
          <p><strong>Level:</strong> ${event.zone || 'unknown'}</p>
          <p><strong>Message:</strong> ${event.message || 'No details'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    res.status(200).json({
      logged: true,
      emailSent: emailResult.success,
      emailError: emailResult.error
    });

  } catch (error) {
    console.error('Alert processing failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
