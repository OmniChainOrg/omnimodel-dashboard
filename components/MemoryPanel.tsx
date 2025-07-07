import React, { useEffect, useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

interface MemoryRecord {
  id: string;
  timestamp: string;
  content: string;
}

interface MemoryPanelProps {
  zone: Zone;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone }) => {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/memory?zoneId=${encodeURIComponent(zone.id)}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data: MemoryRecord[] = await response.json();
        setRecords(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch memory records');
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [zone.id]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Memory Panel for {zone.name}</h2>

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
