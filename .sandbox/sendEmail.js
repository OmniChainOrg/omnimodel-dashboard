// api/sendEmail.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { zones } = req.body;

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password', // Consider using environment variables for security
      },
    });

    // Mail options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'omnichain@icloud.com',
      subject: 'Generated Zones for Validation',
      text: JSON.stringify(zones, null, 2),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
