// hooks/useZoneArchetype.ts
import { useEffect, useState, useCallback } from 'react';

export type Zone = {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
};

interface UseZoneArchetypeOptions {
  archetypeId: string;
  archetypeName: string;
  depth?: number;
}

export function useZoneArchetype({
  archetypeId,
  archetypeName,
  depth = 3,
}: UseZoneArchetypeOptions) {
  const [tree, setTree] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ce2/zoneGen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetypeId, archetypeName, depth }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data: Zone = await res.json();
      setTree(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [archetypeId, archetypeName, depth]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  return { tree, loading, error, refresh: fetchTree };
}
