// components/ZoneGenerator.tsx
import { useState } from 'react';

export default function ZoneGenerator() {
  const [zones, setZones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ce2/zoneGen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archetypeId: 'example123',
          archetypeName: 'ExampleArchetype',
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setZones(data.children || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load zones');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>CE² Zone Dashboard for ExampleArchetype</h1>
      <p>Last updated: {new Date().toLocaleString()}</p>

      <button
        onClick={fetchZones}
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

      {zones.length > 0 ? (
        <div className="zones-list">
          {zones.map((zone) => (
            <div key={zone.id} className="zone-card">
              <h3>{zone.name}</h3>
              <p>Depth: {zone.depth}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No zones loaded</p>
      )}
    </div>
  );
}
