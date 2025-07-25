// pages/api/ce2/zoneGen.ts
import { NextApiRequest, NextApiResponse } from 'next';

type Zone = {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  console.log('\n=== NEW REQUEST ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    console.log('Rejected: Method Not Allowed');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { archetypeId, archetypeName, depth = 3 } = req.body;
    
    if (!archetypeId || !archetypeName) {
      console.log('Rejected: Missing parameters');
      return res.status(400).json({ error: 'Missing archetypeId or archetypeName' });
    }

    console.log('Generating zone tree...');
    const root = generateZoneRecursive(archetypeId, archetypeName, 1, depth);
    console.log('Generation successful:', JSON.stringify(root, null, 2));
    
    return res.status(200).json(root);
  } catch (err) {
    console.error('Generation failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function generateZoneRecursive(id: string, name: string, depth: number, maxDepth: number): Zone {
  const zone: Zone = { id, name, depth };
  
  if (depth < maxDepth) {
    zone.children = [1, 2].map(i => 
      generateZoneRecursive(
        `${id}-${i}`,
        `${name} > SubZone ${i}`,
        depth + 1,
        maxDepth
      )
    );
  }
  
  return zone;
}
