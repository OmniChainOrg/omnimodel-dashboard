import type { NextApiRequest, NextApiResponse } from 'next';

interface Zone {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Body parsing
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // 3. Parameter validation
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Request body must be JSON' });
  }

  const { archetypeId, archetypeName, depth = 3 } = body;
  
  if (!archetypeId || !archetypeName) {
    return res.status(400).json({ 
      error: `Missing required parameters: archetypeId and archetypeName. Received: ${Object.keys(body).join(', ')}`
    });
  }

  // 4. Generate response
  try {
    const rootZone: Zone = {
      id: archetypeId,
      name: archetypeName,
      depth: 1,
      children: [1, 2].map(i => ({
        id: `${archetypeId}-${i}`,
        name: `${archetypeName} > SubZone ${i}`,
        depth: 2
      }))
    };

    return res.status(200).json(rootZone);
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
