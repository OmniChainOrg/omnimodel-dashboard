// hooks/useZoneArchetype.ts
import { useEffect, useState, useCallback } from 'react';
import type { Zone } from '@/types/Zone';

export interface UseZoneArchetypeOptions {
  archetypeId: string;
  archetypeName: string;
  depth?: number;
}

export interface UseZoneArchetypeResult {
  tree: Zone | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useZoneArchetype({
  archetypeId,
  archetypeName,
  depth = 3,
}: UseZoneArchetypeOptions): UseZoneArchetypeResult {
  const [tree, setTree] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching zone tree with parameters:', { archetypeId, archetypeName, depth });
      const res = await fetch('/api/ce2/zoneGen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetypeId, archetypeName, depth }),
      });
      console.log('API Response:', res); // Log the response object
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      console.log('Zone tree fetched successfully:', data);

      // Ensure path is set for all zones
      const ensurePath = (z: Zone): Zone => ({
        ...z,
        path: z.path || `/default/path/${z.id}`,
        children: z.children?.map(child => ensurePath(child)),
      });

      const treeWithPaths = ensurePath(data);
      setTree(treeWithPaths);
    } catch (e) {
      console.error('Error fetching zone tree:', e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [archetypeId, archetypeName, depth]);

  useEffect(() => {
    if (archetypeId && archetypeName) {
      fetchTree();
    }
  }, [fetchTree, archetypeId, archetypeName]);

  return { tree, loading, error, refresh: fetchTree };
}
