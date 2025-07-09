// components/MemoryPanel.tsx

import React, { useState, useEffect } from 'react';
import { Zone } from '../lib/zoneRegistry'; // Zone définit id, name, path, approved, depth

// Types pour les enregistrements et anchors
interface MemoryRecord {
  timestamp: string;
  message: string;
}
interface AnchorRecord {
  id: string;
  content: string;
  createdAt: string;
}

interface MemoryPanelProps {
  zone?: Zone;
}

// Mocks indexés par zone.id
const MockMemoryStore: Record<string, MemoryRecord[]> = {
  root: [
    { timestamp: new Date().toISOString(), message: 'Memory initialized for Root Zone Prototype' },
  ],
  omnitwin: [
    { timestamp: new Date().toISOString(), message: '🧬 OmniTwin memory cluster seeded.' },
  ],
  hopechain: [
    { timestamp: new Date().toISOString(), message: '💙 HOPEChain operational.' },
  ],
};
const MockAnchorRegistry: Record<string, AnchorRecord[]> = {
  root: [
    {
      id: 'l5anchor1',
      content: '🧠 L5 Anchor: System boot event recorded.',
      createdAt: new Date().toISOString(),
    },
  ],
  omnitwin: [
    {
      id: 'l5anchor2',
      content: '🔗 L5 Anchor: AI cluster ready for simulations.',
      createdAt: new Date().toISOString(),
    },
  ],
};

const MemoryPanel: React.FC<MemoryPanelProps> = ({ zone }) => {
  // Aucun crash si pas de zone
  if (!zone) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-gray-500">
        Aucune zone sélectionnée pour le moment.
      </div>
    );
  }

  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [anchors, setAnchors] = useState<AnchorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      // On lit les mocks via zone.id
      const key = zone.id;
      setRecords(MockMemoryStore[key] || []);
      setAnchors(MockAnchorRegistry[key] || []);
    } catch {
      setError('Échec du chargement des données.');
    } finally {
      setLoading(false);
    }
  }, [zone]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">
        🧠 Memory Panel for {zone.name} (level {zone.depth})
      </h2>

      {loading && <p className="text-gray-500">Chargement des mémoires…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {records.map((r, i) => (
            <div key={i} className="border p-3 mb-2 rounded text-gray-800">
              <div className="text-sm text-gray-500">
                {new Date(r.timestamp).toLocaleString()}
              </div>
              <div>{r.message}</div>
            </div>
          ))}

          {anchors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">🔗 Anchors (L5)</h3>
              {anchors.map(a => (
                <div key={a.id} className="border-l-4 border-indigo-500 pl-3 mb-2">
                  <div className="text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div className="font-mono">{a.content}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryPanel;
