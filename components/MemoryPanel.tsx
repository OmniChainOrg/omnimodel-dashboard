import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zone } from '../hooks/useZoneArchetype';
import { ZoneRegistry } from '@/lib/zoneRegistry';
import { approveZone as someOtherName } from '@/lib/updateRegistry';

interface MemoryRecord {
  id: string;
  timestamp: string;
  content: string;
}

interface MemoryAnchor {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  importance: number;
  tags: string[];
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

// 🔁 Mock anchor database
const mockAnchorsByZone: Record<string, MemoryAnchor[]> = {
  omnitwin: [
    {
      id: 'L5-1',
      title: '🧬 Twin Engine v2 Deployment',
      summary: 'Released new predictive model for digital twin orchestration in Q2.',
      createdAt: '2025-06-10T09:30:00Z',
      importance: 5,
      tags: ['deployment', 'prediction', 'biotech']
    }
  ],
  hopechain: [
    {
      id: 'L5-2',
      title: '🌐 Cross-border Compliance Mesh',
      summary: 'RegOps achieved interoperability between EU/US regulatory nodes.',
      createdAt: '2025-06-18T16:00:00Z',
      importance: 5,
      tags: ['compliance', 'mesh', 'interop']
    }
  ]
};

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone: inputZone }) => {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [anchors, setAnchors] = useState<MemoryAnchor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError(null);

        const zonePath = `/dashboard/${inputZone.id}`;
        const activeZone = ZoneRegistry.find(z => z.path === zonePath);

        if (!activeZone) {
          setError(`Zone not found for path: ${zonePath}`);
          return;
        }

        const dummyRecords: MemoryRecord[] = [
          {
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            content: `Memory initialized for ${activeZone.name}`
          }
        ];

        const zoneAnchors = mockAnchorsByZone[inputZone.id] || [];

        setRecords(dummyRecords);
        setAnchors(zoneAnchors.filter(a => a.importance >= 5));
      } catch (err) {
        setError('Unexpected error while loading memory.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [inputZone.id]);

  const subZones = ZoneRegistry.filter(
    z => z.depth > inputZone.depth && z.path.startsWith(`/dashboard/${inputZone.id}`)
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">🧠 Memory Panel for {inputZone.name}</h2>

      {loading && <p className="text-gray-500">Loading memory records...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          <ul className="space-y-3 mb-6">
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

          {anchors.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-2">📌 Level 5 Anchors</h3>
              <ul className="space-y-2 mb-6">
                {anchors.map(anchor => (
                  <li key={anchor.id} className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                    <div className="font-semibold">{anchor.title}</div>
                    <div className="text-sm text-gray-700">{anchor.summary}</div>
                    <div className="text-xs text-gray-500">
                      ⏱ {new Date(anchor.createdAt).toLocaleString()} • {anchor.tags.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {inputZone.depth === 0 && subZones.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-2">🧭 Sub-Zones</h3>
              <ul className="list-disc pl-5 space-y-1">
                {subZones.map(z => (
                  <li key={z.id}>
                    <Link href={z.path}>
                      <span className="text-blue-600 hover:underline">{z.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryPanel;
