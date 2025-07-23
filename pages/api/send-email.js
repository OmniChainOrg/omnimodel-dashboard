// No API key needed - mock mode
export default async function handler(req, res) {
  console.log("WOULD SEND EMAIL:", {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  });
  
  return res.status(200).json({ 
    success: true,
    message: "Mock mode - email not actually sent" 
  });
}
