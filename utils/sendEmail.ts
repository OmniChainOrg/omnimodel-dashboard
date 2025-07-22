import type { NextApiResponse } from 'next';

type EmailData = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendZoneDataEmail = async (email: string, data: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `New Zone Data - ${new Date().toLocaleDateString()}`,
        text: `Zone data:\n\n${JSON.stringify(data, null, 2)}`,
        html: buildEmailHtml(data),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

const buildEmailHtml = (data: any): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Zone Data Generated</h1>
          </div>
          <div class="content">
            <p><strong>User:</strong> ${data.user}</p>
            <p><strong>Generated at:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
            <p><strong>Total Zones:</strong> ${data.zones.length}</p>
            <h3>Full Data:</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </body>
    </html>
  `;
};
