// pages/api/send-email.js

// Next.js automatically parses req.body; no body-parser needed
export default async function handler(req, res) {
  try {
   
    // Debug logs
    console.log('\n=== FULL REQUEST ===')
    console.log('Method:', req.method)
    console.log('Headers:', req.headers)
    console.log('Body:', req.body)

    return res.status(200).json({
      success: true,
      data: req.body || 'No body received',
      debug: {
        bodyType: typeof req.body,
        contentLength: req.headers['content-length']
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return res.status(400).json({ 
      error: 'Invalid request',
      details: error.message 
    })
  }
}
