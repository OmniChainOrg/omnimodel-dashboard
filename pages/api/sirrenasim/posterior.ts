// pages/api/sirrenasim/posterior.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // minimal response so your dashboard can render
  res.status(200).json({
    forecasts: [],
    confidenceTimeline: [],
    beliefPath: [],
    memoryTrace: []
  });
}
