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
  // Log the request for debugging
  console.log(`\n[${new Date().toISOString()}] Received ${req.method} request to ${req.url}`);
  
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    console.log('Method not allowed - returning 405');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Validate request body
  if (!req.body) {
    console.log('Missing body - returning 400');
    return res.status(400).json({ error: 'Request body is required' });
  }

  const { archetypeId, archetypeName, depth = 3 } = req.body;
  
  if (!archetypeId || !archetypeName) {
    console.log('Missing parameters - returning 400');
    return res.status(400).json({ 
      error: 'Missing required parameters: archetypeId and archetypeName' 
    });
  }

  // 3. Generate the zone structure
  try {
    console.log(`Generating zone for ${archetypeName} (ID: ${archetypeId})`);
    
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

    console.log('Successfully generated zone:', JSON.stringify(rootZone, null, 2));
    return res.status(200).json(rootZone);

  } catch (error) {
    console.error('Generation failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
