// pages/api/ce2/zoneGen.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Zone {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  // Debugging log
  console.log('Incoming request:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body with multiple fallbacks
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    body = body || {}; // Ensure body exists
  } catch (e) {
    console.error('Body parsing error:', e);
    return res.status(400).json({ error: 'Invalid request format' });
  }

  // Validate required fields with helpful error
  if (!body.archetypeId || !body.archetypeName) {
    const missing = [];
    if (!body.archetypeId) missing.push('archetypeId');
    if (!body.archetypeName) missing.push('archetypeName');
    
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields: missing,
      received: Object.keys(body)
    });
  }

  // Generate response
  try {
    const response = {
      id: body.archetypeId,
      name: body.archetypeName,
      depth: 1,
      children: [
        {
          id: `${body.archetypeId}-1`,
          name: `${body.archetypeName} Child 1`,
          depth: 2
        },
        {
          id: `${body.archetypeId}-2`,
          name: `${body.archetypeName} Child 2`,
          depth: 2
        }
      ]
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
