// pages/api/ce2/zoneGen.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Zone } from '@/types/Zone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Zone | { error: string }>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { archetype, depth } = req.body;
    
    if (!archetype || typeof depth !== 'number') {
      return res.status(400).json({ 
        error: 'Missing required fields: archetype (string) and depth (number)' 
      });
    }

    // Create new zone with all required fields
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: `${archetype} Zone`,
      path: `/ce2/${archetype.toLowerCase().replace(/\s+/g, '-')}`,
      depth: Math.max(1, Math.min(depth, 5)), // Clamp depth between 1-5
      archetype,
      approved: false,
      metadata: {
        sharedWithDAO: false,
        confidentiality: 'Public',
        userNotes: `Generated at ${new Date().toISOString()}`
      },
      ce2: {
        intent: 'Unknown / Exploratory',
        sensitivity: 'Medium',
        createdBy: 'system',
        guardianId: `guardian-${Math.floor(Math.random() * 1000)}`,
        guardianTrigger: {
          drift: 0.5,
          entropy: 0.7,
          ethicalFlag: false
        }
      },
      guardianTrigger: {
        drift: 0.5,
        entropy: 0.7,
        ethicalFlag: false
      }
    };

    return res.status(201).json(newZone);
  } catch (error) {
    console.error('Zone generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
