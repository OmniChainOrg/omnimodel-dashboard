import React, { useEffect, useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';
import { ZoneRegistry } from '@/lib/zoneRegistry';
import { approveZone as someOtherName } from '@/lib/updateRegistry';

interface MemoryRecord {
  id: string;
  timestamp: string;
  content: string;
}

interface MemoryPanelProps {
  zone: Zone;
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function approveZone(zoneData) {
  ZoneRegistry.push({
    id: zoneData.id || generateUUID(),
    name: zoneData.name,
    path: `/dashboard/${zoneData.slug}`,
    approved: true,
    depth: zoneData.depth ?? 0
  });
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone: inputZone }) => {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate fetch from registry or memory DB
        const zonePath = `/dashboard/${inputZone.id}`;

        const activeZone = ZoneRegistry.find(z => z.path === zonePath);

        if (!activeZone) {
          setError(`Zone not found for path: ${zonePath}`);
          return;
        }

        // Simulate memory fetch
        const dummyRecords: MemoryRecord[] = [
          {
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            content: `Memory initialized for ${activeZone.name}`
          }
        ];

        setRecords(dummyRecords);
      } catch (err) {
        setError("Unexpected error while loading memory.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [inputZone.id]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">🧠 Memory Panel for {inputZone.name}</h2>

      {loading && <p className="text-gray-500">Loading memory records...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <ul className="space-y-3">
          {records.length === 0 ? (
            <li className="text-gray-600">No memory records found for this zone.</li>
          ) : (
            records.map(record => (
              <li key={record.id} className="border border-gray-200 p-3 rounded-lg">
                <div className="text-sm text-gray-500">
                  {new Date(record.timestamp).toLocaleString()}
                </div>
                <div className="mt-1 text-gray-800">{record.content}</div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MemoryPanel;
