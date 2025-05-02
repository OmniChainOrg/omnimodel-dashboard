// Simulates metadata about the current model

export default function handler(req, res) {
  res.status(200).json({
    model_id: "omni-neo-2b",
    version: "v1.4.9",
    checksum: "a98c58d812dfe32ee21ef1",
    uploaded: Date.now(),
    tags: ["AI-enhanced", "Neoantigen", "GX21-compatible"]
  });
}
