// pages/zonedashboard.tsx
import React, { useState, useEffect } from 'react';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';
import { addZone } from '@/lib/zoneRegistry';

// Settings type for each zone customization
interface ZoneSettings {
  info: string;
  confidentiality: 'Public' | 'Confidential' | 'Private';
}

// Recursive node with inline customization form
const ZoneNode: React.FC<{
  zone: Zone;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
}> = ({ zone, settings, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const currentSettings = settings[zone.id] || { info: '', confidentiality: 'Public' };
  const [info, setInfo] = useState(currentSettings.info);
  const [confidentiality, setConfidentiality] = useState<ZoneSettings['confidentiality']>(currentSettings.confidentiality);

  const handleSave = () => {
    onUpdate(zone.id, { info, confidentiality });
    setExpanded(false);
  };
  const handleCancel = () => {
    setInfo(currentSettings.info);
    setConfidentiality(currentSettings.confidentiality);
    setExpanded(false);
  };

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
            >
              <option>Public</option>
              <option>Confidential</option>
              <option>Private</option>
            </select>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {zone.children && zone.children.length > 0 && (
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
  
  React.useEffect(() => {
  if (!tree) return;
  // On aplatit l’arbre et on pousse chaque noeud dans le registry comme « pending »
  const flatten = (node: Zone): Zone[] => [node, ...node.children.flatMap(flatten)];
  flatten(tree).forEach(z => {
    addZone({
      id:    z.id,
      name:  z.name,
      path:  z.path,
      depth: z.depth
    });
  });
}, [tree]);

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
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Domain</label>
            <select
              value={zoneDomain}
              onChange={e => setZoneDomain(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Biotech</option>
              <option>MedTech</option>
              <option>Pharma Formulation</option>
              <option>Clinical Trials</option>
              <option>RegOps</option>
              <option>DeSci</option>
              <option>DeTrade</option>
              <option>DeInvest</option>
              <option>Nonprofit</option>
              <option>Philanthropy</option>
              <option>Humanitarian</option>
              <option>AI ethics</option>
              <option>dApps DevOps</option>
              <option>Investment</option>
              <option>Granting</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prototype Zone Name
              <span className="text-xs text-gray-500"> (shown in main dashboard)</span>
            </label>
            <input
              type="text"
              value={prototypeZoneName}
              onChange={e => setPrototypeZoneName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level of Recursion</label>
            <input
              type="number"
              min={1}
              max={6}
              value={recursionLevel}
              onChange={e => setRecursionLevel(Number(e.target.value))}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Generate Zones
          </button>
        </form>

        {loading && <p className="text-center text-gray-600">Generating zone tree...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {tree && <ZoneNode zone={tree} settings={zoneSettings} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
