// pages/api/send-email.js
export default function handler(req, res) {
  console.log("Email request:", req.body);
  res.status(200).json({ 
    success: true,
    message: "Mock email sent",
    data: req.body 
  });
}
