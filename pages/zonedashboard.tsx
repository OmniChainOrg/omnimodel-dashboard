// pages/zonedashboard.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useZoneArchetype } from '../hooks/useZoneArchetype';
import type { Zone } from '@/types/Zone';

// Define types
type ZoneType = Zone & { children?: ZoneType[] };

interface ZoneSettings {
  info: string;
  confidentiality: 'Public' | 'Confidential' | 'Private';
  simAgentProfile: 'Exploratory' | 'Defensive' | 'Predictive' | 'Ethical Validator' | 'Custom';
  autoSimFrequency: 'Manual' | 'Threshold-based' | 'On Parent Drift' | 'Weekly';
  impactDomain: 'Local Policy' | 'Regional Healthcare' | 'Global BioStrategy' | 'Ethical';
  epistemicIntent: 'Diagnostic' | 'Forecasting' | 'Moral Risk Evaluation' | 'Policy Proposal' | 'Unknown / Exploratory';
  ethicalSensitivity: 'Low' | 'Medium' | 'High' | 'Extreme';
  createdBy: 'user' | 'system';
  guardianId: string;
  metadata?: {
    sharedWithDAO: boolean;
    confidentiality: 'Public' | 'Confidential' | 'Private';
    userNotes: string;
  };
  ce2?: {
    intent: 'Diagnostic' | 'Forecasting' | 'Moral Risk Evaluation' | 'Policy Proposal' | 'Unknown / Exploratory';
    sensitivity: 'Low' | 'Medium' | 'High' | 'Extreme';
    createdBy: 'user' | 'system';
    guardianId: string;
    guardianTrigger: {
      drift: number;
      entropy: number;
      ethicalFlag: boolean;
    };
  };
  guardianTrigger?: {
    drift: number;
    entropy: number;
    ethicalFlag: boolean;
  };
}

// Zone Node Component
const ZoneNode: React.FC<{
  zone: ZoneType;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
}> = ({ zone, settings, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const currentSettings = settings[zone.id] || {
    info: '',
    confidentiality: 'Public',
    simAgentProfile: 'Exploratory',
    autoSimFrequency: 'Manual',
    impactDomain: 'Local Policy',
    epistemicIntent: 'Diagnostic',
    ethicalSensitivity: 'Low',
    createdBy: 'user',
    guardianId: '',
    metadata: {
      sharedWithDAO: false,
      confidentiality: 'Public',
      userNotes: '',
    },
    ce2: {
      intent: 'Diagnostic',
      sensitivity: 'Low',
      createdBy: 'user',
      guardianId: '',
      guardianTrigger: {
        drift: 0.5,
        entropy: 0.7,
        ethicalFlag: false,
      },
    },
    guardianTrigger: {
      drift: 0.5,
      entropy: 0.7,
      ethicalFlag: false,
    },
  };

  const [formState, setFormState] = useState(currentSettings);

  const handleSave = () => {
    if (!formState.info.trim()) {
      alert('Please enter information to share.');
      return;
    }

    const updatedSettings: ZoneSettings = {
      ...formState,
      metadata: {
        sharedWithDAO: formState.metadata?.sharedWithDAO || false,
        confidentiality: formState.confidentiality,
        userNotes: formState.info,
      },
      ce2: {
        intent: formState.epistemicIntent,
        sensitivity: formState.ethicalSensitivity,
        createdBy: formState.createdBy,
        guardianId: formState.guardianId,
        guardianTrigger: {
          drift: formState.guardianTrigger?.drift || 0.5,
          entropy: formState.guardianTrigger?.entropy || 0.7,
          ethicalFlag: formState.guardianTrigger?.ethicalFlag || false,
        },
      },
      guardianTrigger: {
        drift: formState.guardianTrigger?.drift || 0.5,
        entropy: formState.guardianTrigger?.entropy || 0.7,
        ethicalFlag: formState.guardianTrigger?.ethicalFlag || false,
      },
    };

    onUpdate(zone.id, updatedSettings);
    setExpanded(false);
  };

  const handleCancel = () => {
    setFormState(currentSettings);
    setExpanded(false);
  };

  const handleChange = (field: keyof ZoneSettings, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
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
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded-full mr-2 ${
                  formState.ethicalSensitivity === 'Low' ? 'bg-green-500' :
                  formState.ethicalSensitivity === 'Medium' ? 'bg-yellow-500' :
                  formState.ethicalSensitivity === 'High' ? 'bg-red-500' :
                  'bg-black'
                }`}
              ></span>
              <h3 className="text-xl font-semibold text-blue-600">{zone.name}</h3>
            </div>
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
              value={formState.info}
              onChange={e => handleChange('info', e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />

            {zone.depth !== 1 && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">Confidentiality Level</label>
                <select
                  value={formState.confidentiality}
                  onChange={e => handleChange('confidentiality', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Public', 'Confidential', 'Private'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Share with DAO</label>
                <input
                  type="checkbox"
                  checked={formState.metadata?.sharedWithDAO || false}
                  onChange={e => handleChange('metadata', {
                    ...formState.metadata,
                    sharedWithDAO: e.target.checked
                  })}
                  className="mt-1"
                />

                <label className="block text-sm font-medium text-gray-700 mt-4">Simulation Profile</label>
                <select
                  value={formState.simAgentProfile}
                  onChange={e => handleChange('simAgentProfile', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Exploratory', 'Defensive', 'Predictive', 'Ethical Validator', 'Custom'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Sim Trigger Mode</label>
                <select
                  value={formState.autoSimFrequency}
                  onChange={e => handleChange('autoSimFrequency', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Manual', 'Threshold-based', 'On Parent Drift', 'Weekly'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Impact Domain</label>
                <select
                  value={formState.impactDomain}
                  onChange={e => handleChange('impactDomain', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Local Policy', 'Regional Healthcare', 'Global BioStrategy', 'Ethical'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Epistemic Intent</label>
                <select
                  value={formState.epistemicIntent}
                  onChange={e => handleChange('epistemicIntent', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Diagnostic', 'Forecasting', 'Moral Risk Evaluation', 'Policy Proposal', 'Unknown / Exploratory'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Ethical Sensitivity</label>
                <select
                  value={formState.ethicalSensitivity}
                  onChange={e => handleChange('ethicalSensitivity', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Low', 'Medium', 'High', 'Extreme'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Created by</label>
                <select
                  value={formState.createdBy}
                  onChange={e => handleChange('createdBy', e.target.value)}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {['user', 'system'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Guardian ID</label>
                <input
                  type="text"
                  value={formState.guardianId}
                  onChange={e => handleChange('guardianId', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </>
            )}

            <label className="block text-sm font-medium text-gray-700 mt-4">Guardian Trigger Level</label>
            <div className="flex space-x-2">
              <div>
                <label className="text-sm text-gray-700">Drift</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formState.guardianTrigger?.drift || 0.5}
                  onChange={e => handleChange('guardianTrigger', {
                    ...formState.guardianTrigger,
                    drift: Number(e.target.value)
                  })}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Entropy</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formState.guardianTrigger?.entropy || 0.7}
                  onChange={e => handleChange('guardianTrigger', {
                    ...formState.guardianTrigger,
                    entropy: Number(e.target.value)
                  })}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ethical Flag</label>
                <input
                  type="checkbox"
                  checked={formState.guardianTrigger?.ethicalFlag || false}
                  onChange={e => handleChange('guardianTrigger', {
                    ...formState.guardianTrigger,
                    ethicalFlag: e.target.checked
                  })}
                  className="mt-1"
                />
              </div>
            </div>

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

// Main Dashboard Component
const ZoneDashboardPage = () => {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  const [formState, setFormState] = useState({
    zoneDomain: 'Biotech',
    prototypeZoneName: 'Root Zone Prototype',
    recursionLevel: Number(depth) || 1,
    simAgentProfile: 'Exploratory' as const,
    autoSimFrequency: 'Manual' as const,
    impactDomain: 'Local Policy' as const,
    confidentiality: 'Public' as const,
    sharedWithDAO: false,
    epistemicIntent: 'Diagnostic' as const,
    ethicalSensitivity: 'Low' as const,
    createdBy: 'user' as const,
    guardianId: '',
    drift: 0.5,
    entropy: 0.7,
    ethicalFlag: false,
  });
  const [settings, setSettings] = useState<Record<string, ZoneSettings>>({});

  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: formState.recursionLevel,
  });

  useEffect(() => {
    if (!tree) return;
    
    const allZones: Zone[] = [];
    const collectZones = (z: ZoneType) => {
      allZones.push({
        id: z.id,
        name: z.name,
        path: z.path || `/default/path/${z.id}`,
        depth: z.depth,
        approved: false,
        archetype: archetypeId as string,
        metadata: {
          sharedWithDAO: formState.sharedWithDAO,
          confidentiality: formState.confidentiality,
          userNotes: z.metadata?.userNotes || '',
        },
        ce2: {
          intent: formState.epistemicIntent,
          sensitivity: formState.ethicalSensitivity,
          createdBy: formState.createdBy,
          guardianId: formState.guardianId,
          guardianTrigger: {
            drift: formState.drift,
            entropy: formState.entropy,
            ethicalFlag: formState.ethicalFlag,
          },
        },
        guardianTrigger: {
          drift: formState.drift,
          entropy: formState.entropy,
          ethicalFlag: formState.ethicalFlag,
        },
        children: [],
      });
      z.children?.forEach(child => collectZones(child as ZoneType));
    };
    
    collectZones(tree as ZoneType);
    localStorage.setItem('zoneRegistry', JSON.stringify(allZones));
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }, [tree, archetypeId, formState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  const handleChange = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = (zoneId: string, updatedSettings: ZoneSettings) => {
    setSettings(prev => ({
      ...prev,
      [zoneId]: updatedSettings,
    }));
  };

  if (!router.isReady) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (!archetypeId || !archetypeName) {
    return <p className="text-center mt-8 text-red-600">Missing archetype parameters.</p>;
  }

  const domainOptions = [
    'Biotech', 'MedTech', 'Pharma Formulation', 'Clinical Trials', 'RegOps',
    'DeSci', 'DeTrade', 'DeInvest', 'Nonprofit', 'Philanthropy',
    'Humanitarian', 'AI ethics', 'dApps DevOps', 'Investment', 'Granting', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CE² Zone Prototype Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Domain of Interest</label>
            <select
              value={formState.zoneDomain}
              onChange={e => handleChange('zoneDomain', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {domainOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prototype Zone Name <span className="text-xs text-gray-500">(shown in main dashboard)</span>
            </label>
            <input
              type="text"
              value={formState.prototypeZoneName}
              onChange={e => handleChange('prototypeZoneName', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Level of Recursion / Depth</label>
            <input
              type="number"
              min={1}
              max={5}
              value={formState.recursionLevel}
              onChange={e => handleChange('recursionLevel', Number(e.target.value))}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Simulation Profile</label>
            <select
              value={formState.simAgentProfile}
              onChange={e => handleChange('simAgentProfile', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Exploratory', 'Defensive', 'Predictive', 'Ethical Validator', 'Custom'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sim Trigger Mode</label>
            <select
              value={formState.autoSimFrequency}
              onChange={e => handleChange('autoSimFrequency', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Manual', 'Threshold-based', 'On Parent Drift', 'Weekly'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Impact Domain</label>
            <select
              value={formState.impactDomain}
              onChange={e => handleChange('impactDomain', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Local Policy', 'Regional Healthcare', 'Global BioStrategy', 'Ethical'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confidentiality Level</label>
            <select
              value={formState.confidentiality}
              onChange={e => handleChange('confidentiality', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Public', 'Confidential', 'Private'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Share with DAO</label>
            <input
              type="checkbox"
              checked={formState.sharedWithDAO}
              onChange={e => handleChange('sharedWithDAO', e.target.checked)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Epistemic Intent</label>
            <select
              value={formState.epistemicIntent}
              onChange={e => handleChange('epistemicIntent', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Diagnostic', 'Forecasting', 'Moral Risk Evaluation', 'Policy Proposal', 'Unknown / Exploratory'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ethical Sensitivity</label>
            <select
              value={formState.ethicalSensitivity}
              onChange={e => handleChange('ethicalSensitivity', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['Low', 'Medium', 'High', 'Extreme'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Created by</label>
            <select
              value={formState.createdBy}
              onChange={e => handleChange('createdBy', e.target.value)}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {['user', 'system'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian ID</label>
            <input
              type="text"
              value={formState.guardianId}
              onChange={e => handleChange('guardianId', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian Trigger Level</label>
            <div className="flex space-x-2">
              <div>
                <label className="text-sm text-gray-700">Drift</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formState.drift}
                  onChange={e => handleChange('drift', Number(e.target.value))}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Entropy</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formState.entropy}
                  onChange={e => handleChange('entropy', Number(e.target.value))}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ethical Flag</label>
                <input
                  type="checkbox"
                  checked={formState.ethicalFlag}
                  onChange={e => handleChange('ethicalFlag', e.target.checked)}
                  className="mt-1"
                />
              </div>
            </div>
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
        
        {tree && <ZoneNode zone={tree} settings={settings} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
