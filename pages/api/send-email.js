// pages/api/send-email.js
import bodyParser from 'body-parser'

// Configure body parsing middleware
const jsonParser = bodyParser.json()

export default async function handler(req, res) {
  try {
    // Apply JSON body parser
    await new Promise((resolve, reject) => {
      jsonParser(req, res, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

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
