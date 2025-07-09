// pages/zonedashboard.tsx
import React, { useState } from 'react';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';

// Settings type for each zone
interface ZoneSettings {
  info: string;
  confidentiality: 'Public' | 'Confidential' | 'Private';
}

// Form to customize a single zone, with Save/Cancel
const ZoneCustomizationForm: React.FC<{
  zone: Zone;
  settings: ZoneSettings;
  onSave: (zoneId: string, newSettings: ZoneSettings) => void;
  onCancel: () => void;
}> = ({ zone, settings, onSave, onCancel }) => {
  const [info, setInfo] = useState(settings.info);
  const [confidentiality, setConfidentiality] = useState<ZoneSettings['confidentiality']>(settings.confidentiality);

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
      <label className="block text-sm font-medium text-gray-700">Info to Share</label>
      <textarea
        placeholder="Enter information to share..."
        value={info}
        onChange={e => setInfo(e.target.value)}
        className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        rows={3}
      />
      <label className="block text-sm font-medium text-gray-700 mt-4">Confidentiality Level</label>
      <select
        value={confidentiality}
        onChange={e => setConfidentiality(e.target.value as ZoneSettings['confidentiality'])}
        className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >à 152
        <option>Public</option>
        <option>Confidential</option>
        <option>Private</option>
      </select>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onSave(zone.id, { info, confidentiality })}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Recursive node with customization controls
const ZoneNode: React.FC<{
  zone: Zone;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
}> = ({ zone, settings, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const currentSettings = settings[zone.id] || { info: '', confidentiality: 'Public' };

  // Handlers
  const handleSave = (id: string, newSet: ZoneSettings) => {
    onUpdate(id, newSet);
    setExpanded(false);
  };
  const handleCancel = () => setExpanded(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-600">{zone.name.replace(/SubZone/g, 'Zone')}</h3>
            <p className="text-sm text-gray-500">Level: {zone.depth}</p>
          </div>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            {expanded ? 'Close' : 'Customize'}
          </button>
        </div>
        {expanded && (
          <ZoneCustomizationForm
            zone={zone}
            settings={currentSettings}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
      {zone.children?.length && (
        <div className="ml-10 mt-4 border-l-2 border-blue-200 pl-8">
          {zone.children.map(child => (
            <ZoneNode key={child.id} zone={child} settings={settings} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ZoneDashboardPage: React.FC = () => {
  const [zoneDomain, setZoneDomain] = useState('Biotech');
  const [prototypeZoneName, setPrototypeZoneName] = useState('Root Zone Prototype');
  const [recursionLevel, setRecursionLevel] = useState(4);
  const [zoneSettings, setZoneSettings] = useState<Record<string, ZoneSettings>>({});

  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: zoneDomain,
    archetypeName: prototypeZoneName,
    depth: recursionLevel,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  const handleUpdate = (zoneId: string, settings: ZoneSettings) => {
    setZoneSettings(prev => ({ ...prev, [zoneId]: settings }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CE² Zone Prototype Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Form fields unchanged... */}
        </form>

        {loading && <p className="text-center text-gray-600">Generating zone tree...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {tree && <ZoneNode zone={tree} settings={zoneSettings} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
