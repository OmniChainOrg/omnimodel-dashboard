import React, { useEffect, useState } from 'react';
import { ZoneRegistry } from '../lib/zoneRegistry';
import { MemoryRecord, AnchorRecord } from '../types';

interface MemoryPanelProps {
  zone: string;
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
};

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone }) => {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [anchors, setAnchors] = useState<AnchorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [zoneTitle, setZoneTitle] = useState<string>('');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError(null);

        const zonePath = `/dashboard/${zone}`;
        const activeZone = ZoneRegistry.find(z => z.path === zonePath);

        if (!activeZone) {
          setError(`Zone not found for path: ${zonePath}`);
          setRecords([]);
          return;
        }

        setZoneTitle(activeZone.name);
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
        <h2 className="text-xl font-semibold mb-2">🧠 Memory Panel for {zoneTitle || 'Unknown Zone'}</h2>
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
