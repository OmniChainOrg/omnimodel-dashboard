// utils/sendEmail.ts
import sgMail from '@sendgrid/mail';

// 1. Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// 2. Define the email interface
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

// 3. Create the send function
export const sendEmail = async (params: EmailParams) => {
  try {
    await sgMail.send(params);
    console.log('Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// 4. Helper for zone alerts
export const sendZoneAlertEmail = async (event: {
  id: string;
  zone: string;
  message: string;
}) => {
  return sendEmail({
    to: process.env.ALERT_RECIPIENT || 'admin@example.com',
    from: process.env.EMAIL_FROM || 'alerts@yourdomain.com',
    subject: `Zone Alert: ${event.zone.toUpperCase()} - ${event.id}`,
    text: `${event.message}\n\nZone ID: ${event.id}\nStatus: ${event.zone}`,
    html: `<p>${event.message}</p><p><strong>Zone ID:</strong> ${event.id}</p><p><strong>Status:</strong> ${event.zone}</p>`
  });
};
