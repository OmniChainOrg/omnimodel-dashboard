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
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse and validate request body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid request body');
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { archetypeId, archetypeName } = body;
  
  if (!archetypeId || !archetypeName) {
    return res.status(400).json({ 
      error: 'Missing required parameters: archetypeId and archetypeName'
    });
  }

  // Generate mock zone data
  try {
    const responseData: Zone = {
      id: archetypeId,
      name: archetypeName,
      depth: 1,
      children: [
        {
          id: `${archetypeId}-1`,
          name: `${archetypeName} Subzone 1`,
          depth: 2
        },
        {
          id: `${archetypeId}-2`,
          name: `${archetypeName} Subzone 2`,
          depth: 2
        }
      ]
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
