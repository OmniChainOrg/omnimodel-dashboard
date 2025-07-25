// pages/api/ce2/zoneGen.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Zone = {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  // Log the incoming request
  console.log('\n=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { archetypeId, archetypeName, depth = 3 } = req.body;
    
    if (!archetypeId || !archetypeName) {
      return res.status(400).json({ 
        error: 'Missing required parameters: archetypeId and archetypeName' 
      });
    }

    // Generate zone tree
    const rootZone = generateZoneRecursive(archetypeId, archetypeName, 1, depth);
    
    console.log('Successfully generated zone:', JSON.stringify(rootZone, null, 2));
    return res.status(200).json(rootZone);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function generateZoneRecursive(
  id: string,
  name: string,
  currentDepth: number,
  maxDepth: number
): Zone {
  const zone: Zone = {
    id,
    name,
    depth: currentDepth
  };

  if (currentDepth < maxDepth) {
    zone.children = [1, 2].map(i => 
      generateZoneRecursive(
        `${id}-${i}`,
        `${name} > SubZone ${i}`,
        currentDepth + 1,
        maxDepth
      )
    );
  }

  return zone;
}
