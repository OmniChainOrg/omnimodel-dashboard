// pages/api/send-email.js
export default async function handler(req, res) {
  try {
    console.log("Received request:", req.method, req.body);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Mock response
    const response = {
      success: true,
      mock: process.env.NODE_ENV !== 'production',
      data: req.body
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
