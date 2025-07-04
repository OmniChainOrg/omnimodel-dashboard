import { NextApiRequest, NextApiResponse } from 'next';

type Zone = {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
};

generateZoneRecursive(
  id: string,
  name: string,
  depth: number,
  maxDepth: number
): Zone {
  const zone: Zone = { id, name, depth };
  if (depth < maxDepth) {
    // generate 2 sub-zones per zone for demo
    zone.children = [1, 2].map((i) =>
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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { archetypeId, archetypeName, depth = 3 } = req.body;
  if (!archetypeId || !archetypeName) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const root: Zone = generateZoneRecursive(
      archetypeId,
      archetypeName,
      1,
      depth
    );
    return res.status(200).json(root);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
