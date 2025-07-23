// pages/api/send-email.js
export default function handler(req, res) {
  // Parse JSON body if content-type is application/json
  let body = null;
  try {
    if (req.headers['content-type'] === 'application/json') {
      body = req.body ? JSON.parse(req.body) : null;
    }
  } catch (e) {
    console.error("JSON parse error:", e);
  }

  console.log("Full request:", {
    method: req.method,
    headers: req.headers,
    body: body
  });

  res.status(200).json({ 
    success: true,
    message: "API is working",
    data: body || "No valid JSON body received"
  });
}
