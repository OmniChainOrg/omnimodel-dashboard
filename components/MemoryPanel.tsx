import React, { useState, useEffect } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

interface MemoryRecord {
  id: string;
  timestamp: string;
  content: string;
}

interface MemoryPanelProps {
  zone?: Zone;
}

export default function MemoryPanel({ zone }: MemoryPanelProps) {
  //  ➡️ Si zone est undefined, on ne tente pas d'accéder à zone.name
  if (!zone) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-gray-500">
        Aucune zone sélectionnée pour le moment.
      </div>
    );
  }

// Inlined types previously imported from '../types'
type MemoryRecord = {
  timestamp: string;
  message: string;
};

type AnchorRecord = {
  id: string;
  content: string;
  createdAt: string;
};

type Zone = {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
};

interface MemoryPanelProps {
  zone: Zone;
}

const MockMemoryStore: Record<string, MemoryRecord[]> = {
  '/dashboard/root': [
    {
      timestamp: new Date().toISOString(),
      message: 'Memory initialized for Root Zone Prototype',
    },
  ],
  '/dashboard/omnitwin': [
    {
      timestamp: new Date().toISOString(),
      message: '🧬 OmniTwin memory cluster seeded successfully.',
    },
  ],
  '/dashboard/biotech-lab': [
    {
      timestamp: new Date().toISOString(),
      message: '🧪 BioTech Lab active: R&D program launched.',
    },
  ],
  '/dashboard/regops/interop': [
    {
      timestamp: new Date().toISOString(),
      message: '🔐 RegOps Interop layer bootstrapped (FHIR, HL7 sync).',
    },
  ],
};

const MockAnchorRegistry: Record<string, AnchorRecord[]> = {
  '/dashboard/root': [
    {
      id: 'l5anchor1',
      content: '🧠 L5 Anchor: System boot event recorded.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'l5anchor2',
      content: '📌 L5 Anchor: Prototype zone touched by developer.',
      createdAt: new Date().toISOString(),
    },
  ],
  '/dashboard/biotech-lab': [
    {
      id: 'anchor-bio1',
      content: '🔬 Anchor: Protein synthesis memory checkpoint.',
      createdAt: new Date().toISOString(),
    },
  ],
  '/dashboard/regops/interop': [
    {
      id: 'anchor-reg1',
      content: '⚙️ Anchor: RegOps engine linked to EHR backbone.',
      createdAt: new Date().toISOString(),
    },
  ],
};

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone }) => {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [anchors, setAnchors] = useState<AnchorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError(null);

        const zonePath = zone.path;
        setRecords(MockMemoryStore[zonePath] || []);
        setAnchors(MockAnchorRegistry[zonePath] || []);
      } catch (err) {
        setError('Failed to load memory data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [zone]);

  return (
    <div>
      <h1>Memory Panel</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">🧠 Memory Panel for {zone.name || 'Unknown Zone'}</h2>
        {error && <p className="text-red-500">Error: {error}</p>}
        {!error && (
          <>
            {records.map((record, index) => (
              <div
                key={index}
                className="border p-3 mb-2 rounded-md text-gray-800"
              >
                <div className="text-sm text-gray-500">{new Date(record.timestamp).toLocaleString()}</div>
                <div>{record.message}</div>
              </div>
            ))}

            {anchors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-bold mb-2">🔗 Anchors (L5)</h3>
                {anchors.map((anchor) => (
                  <div key={anchor.id} className="border-l-4 border-indigo-500 pl-3 mb-2">
                    <div className="text-sm text-gray-500">{new Date(anchor.createdAt).toLocaleString()}</div>
                    <div className="font-mono">{anchor.content}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MemoryPanel;
