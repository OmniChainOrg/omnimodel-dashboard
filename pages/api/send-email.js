// pages/api/send-email.js
export default function handler(req, res) {
  // Enable full request logging
  console.log('\n=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Raw Body:', req.body);
  
  try {
    const data = req.body ? JSON.parse(req.body) : null;
    console.log('Parsed Body:', data);
    
    res.status(200).json({ 
      success: true,
      data: data || "No body received"
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: "Invalid JSON" });
  }
}
