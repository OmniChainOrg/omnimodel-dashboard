// pages/api/ce2/zoneGen.ts
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
  // Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Body parsing
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object') throw new Error('Invalid body');
  } catch (e) {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }

  // Parameter validation
  const { archetypeId, archetypeName, depth = 3 } = body;
  if (!archetypeId || !archetypeName) {
    return res.status(400).json({ 
      error: `Missing required parameters. Received: ${JSON.stringify(body)}`
    });
  }

  // Zone generation
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
