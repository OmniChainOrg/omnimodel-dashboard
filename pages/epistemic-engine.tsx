import React from 'react';
import { Zone } from '../hooks/useZoneArchetype';
import EpistemicEngine from '../components/EpistemicEngine';

// Define a dummy zone to satisfy the Zone type
const dummyZone: Zone = {
  id: 'root',
  name: 'Root Zone Prototype',
  depth: 1,
  children: [],
};

// Page component rendering the EpistemicEngine with the dummy zone
export default function EpistemicEnginePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Epistemic Engine</h1>
      <EpistemicEngine zone={dummyZone} />
    </div>
  );
}
