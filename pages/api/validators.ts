// Simulates a list of validators and their status
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([
    {
      moniker: "Validator-22",
      last_heartbeat: "just now",
      status: "active"
    },
    {
      moniker: "Validator-8",
      last_heartbeat: "2 mins ago",
      status: "active"
    },
    {
      moniker: "Validator-X",
      last_heartbeat: "1 hour ago",
      status: "inactive"
    }
  ]);
}
