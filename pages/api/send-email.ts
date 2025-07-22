import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const msg = {
    to: req.body.to,
    from: process.env.omnichaingenerator@gmail.com!,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html
  };
  
  try {
    await sgMail.send(msg);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
