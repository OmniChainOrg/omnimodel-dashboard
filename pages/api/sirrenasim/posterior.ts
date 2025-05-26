// pages/api/sirrenasim/posterior.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // smoke-test response
  res.status(200).json({ ok: true })
}
