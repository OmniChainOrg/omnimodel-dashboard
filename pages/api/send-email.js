// pages/api/send-email.js
export default async function handler(req, res) {
  // Debugging: Log entire request
  console.log('\n=== RAW REQUEST ===');
  console.log({
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  // Parse body differently for dev vs production
  let parsedBody = null;
  try {
    parsedBody = req.body;
    
    // For production (Netlify) where body is already parsed
    if (typeof req.body === 'string') {
      parsedBody = JSON.parse(req.body);
    }
  } catch (e) {
    console.error('Parse error:', e);
  }

  console.log('Parsed body:', parsedBody);

  return res.status(200).json({
    success: true,
    data: parsedBody || 'No valid body received',
    debug: {
      rawBodyType: typeof req.body,
      parsedBodyType: typeof parsedBody
    }
  });
}
