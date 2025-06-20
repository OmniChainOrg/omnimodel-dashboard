import React from "react";

interface DivergenceData {
  zone: string;
  divergenceLevel: number; // between 0 and 1
}

interface L8BloomGraphProps {
  divergences: DivergenceData[];
}

export default function L8BloomGraph({ divergences }: L8BloomGraphProps) {
  return (
    <div className="relative mt-8">
      <h4 className="text-sm font-semibold mb-2 text-emerald-700">🧬 L8 Divergence Bloom</h4>
      <div className="flex flex-wrap gap-6 justify-center">
        {divergences.map((d) => (
          <div
            key={d.zone}
            className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-emerald-500"
            style={{
              boxShadow: `0 0 ${d.divergenceLevel * 50}px ${d.divergenceLevel * 20}px rgba(34,197,94,0.6)`,
              backgroundColor: `rgba(34,197,94,${0.2 + d.divergenceLevel * 0.4})`,
            }}
          >
            <div className="text-xs text-center font-semibold text-emerald-900">
              {d.zone}
              <br />
              {Math.round(d.divergenceLevel * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
