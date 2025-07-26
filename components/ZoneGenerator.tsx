// components/ZoneGenerator.tsx
import { useState } from 'react';

// Define Zone interface matching API
interface Zone {
  id: string;
  name: string;
  depth: number;
  children?: Zone[];
}

export default function ZoneGenerator() {
  const [rootZone, setRootZone] = useState<Zone | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch zones from API and return the root Zone object
  const fetchZones = async (): Promise<Zone> => {
    try {
      const response = await fetch('/api/ce2/zoneGen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeId: 'example123',
          archetypeName: 'ExampleArchetype',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        // If API returns additional debugging fields, include them
        const msg = payload.error || 'Failed to fetch zones';
        const fields = (payload.missingFields || []).join(', ');
        throw new Error(fields ? `${msg}: missing ${fields}` : msg);
      }

      return payload as Zone;
    } catch (err) {
      console.error('Fetch error:', err);
      throw err;
    }
  };

  // Handle button click: manage loading, errors, and set state
  const handleLoadZones = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchZones();
      setRootZone(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch zones');
      setRootZone(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>CE² Zone Dashboard for {rootZone?.name || 'ExampleArchetype'}</h1>
      <p>Last updated: {new Date().toLocaleString()}</p>

      <button
        onClick={handleLoadZones}
        disabled={isLoading}
        className="generate-button"
      >
        {isLoading ? 'Loading...' : 'Load Zones'}
      </button>

      {error && (
        <div className="error-message">
          Error: {error.includes('404') ? 'Zones API endpoint not found' : error}
        </div>
      )}

      {rootZone ? (
        <div className="zones-list">
          {/* Display root zone */}
          <div key={rootZone.id} className="zone-card root-zone">
            <h3>{rootZone.name}</h3>
            <p>Depth: {rootZone.depth}</p>
          </div>

          {/* Display children if any */}
          {rootZone.children && rootZone.children.length > 0 ? (
            rootZone.children.map((zone) => (
              <div key={zone.id} className="zone-card">
                <h3>{zone.name}</h3>
                <p>Depth: {zone.depth}</p>
              </div>
            ))
          ) : (
            <p>No child zones available</p>
          )}
        </div>
      ) : (
        <p>No zones loaded</p>
      )}
    </div>
  );
}
