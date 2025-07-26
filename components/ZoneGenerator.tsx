// components/ZoneGenerator.tsx
import { useState } from 'react';

export default function ZoneGenerator() {
  const [zones, setZones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pure fetch function, handles API response and errors
  const fetchZones = async (): Promise<any> => {
    try {
      const response = await fetch('/api/ce2/zoneGen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archetypeId: 'example123',
          archetypeName: 'ExampleArchetype',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch zones');
      }

      return await response.json();
    } catch (err) {
      console.error('Fetch error:', err);
      throw err;
    }
  };

  // Handler to manage loading state and set data or errors
  const handleLoadZones = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchZones();
      setZones(data.children || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch zones');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>CE² Zone Dashboard for ExampleArchetype</h1>
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
