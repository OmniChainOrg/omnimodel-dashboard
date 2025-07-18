import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useZoneArchetype } from '../hooks/useZoneArchetype';
import { loadRegistryFromStorage, addZone } from '@/lib/zoneRegistry';
import type { Zone } from '@/types/Zone';
import { motion } from 'framer-motion';

type ZoneType = Zone & { children?: ZoneType[] };

// Settings type for each zone customization
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
  guardianTrigger: {
    drift: number;
    entropy: number;
    ethicalFlag: boolean;
  };
}

// Recursive node with inline customization form
const ZoneNode: React.FC<{
  zone: Zone;
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

  const [info, setInfo] = useState(currentSettings.info);
  const [confidentiality, setConfidentiality] = useState<ZoneSettings['confidentiality']>(currentSettings.confidentiality);
  const [simAgentProfile, setSimAgentProfile] = useState<ZoneSettings['simAgentProfile']>(currentSettings.simAgentProfile);
  const [autoSimFrequency, setAutoSimFrequency] = useState<ZoneSettings['autoSimFrequency']>(currentSettings.autoSimFrequency);
  const [impactDomain, setImpactDomain] = useState<ZoneSettings['impactDomain']>(currentSettings.impactDomain);
  const [epistemicIntent, setEpistemicIntent] = useState<ZoneSettings['epistemicIntent']>(currentSettings.epistemicIntent);
  const [ethicalSensitivity, setEthicalSensitivity] = useState<ZoneSettings['ethicalSensitivity']>(currentSettings.ethicalSensitivity);
  const [createdBy, setCreatedBy] = useState<ZoneSettings['createdBy']>(currentSettings.createdBy);
  const [guardianId, setGuardianId] = useState(currentSettings.guardianId);
  const [sharedWithDAO, setSharedWithDAO] = useState(currentSettings.metadata?.sharedWithDAO || false);
  const [drift, setDrift] = useState(currentSettings.guardianTrigger?.drift || 0.5);
  const [entropy, setEntropy] = useState(currentSettings.guardianTrigger?.entropy || 0.7);
  const [ethicalFlag, setEthicalFlag] = useState(currentSettings.guardianTrigger?.ethicalFlag || false);

  const handleSave = () => {
    onUpdate(zone.id, {
      info,
      confidentiality,
      simAgentProfile,
      autoSimFrequency,
      impactDomain,
      epistemicIntent,
      ethicalSensitivity,
      createdBy,
      guardianId,
      metadata: {
        sharedWithDAO,
        confidentiality,
        userNotes: info,
      },
      ce2: {
        intent: epistemicIntent,
        sensitivity: ethicalSensitivity,
        createdBy,
        guardianId,
        guardianTrigger: {
          drift,
          entropy,
          ethicalFlag,
        },
      },
      guardianTrigger: {
        drift,
        entropy,
        ethicalFlag,
      },
    });
    setExpanded(false);
  };

  const handleCancel = () => {
    setInfo(currentSettings.info);
    setConfidentiality(currentSettings.confidentiality);
    setSimAgentProfile(currentSettings.simAgentProfile);
    setAutoSimFrequency(currentSettings.autoSimFrequency);
    setImpactDomain(currentSettings.impactDomain);
    setEpistemicIntent(currentSettings.epistemicIntent);
    setEthicalSensitivity(currentSettings.ethicalSensitivity);
    setCreatedBy(currentSettings.createdBy);
    setGuardianId(currentSettings.guardianId);
    setSharedWithDAO(currentSettings.metadata?.sharedWithDAO || false);
    setDrift(currentSettings.guardianTrigger?.drift || 0.5);
    setEntropy(currentSettings.guardianTrigger?.entropy || 0.7);
    setEthicalFlag(currentSettings.guardianTrigger?.ethicalFlag || false);
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
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded-full mr-2 ${
                  ethicalSensitivity === 'Low' ? 'bg-green-500' :
                  ethicalSensitivity === 'Medium' ? 'bg-yellow-500' :
                  ethicalSensitivity === 'High' ? 'bg-red-500' :
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
            <label className="block text-sm font-medium text-gray-700 mt-4">Share with DAO</label>
            <input
              type="checkbox"
              checked={sharedWithDAO}
              onChange={e => setSharedWithDAO(e.target.checked)}
              className="mt-1"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Simulation Profile</label>
            <select
              value={simAgentProfile}
              onChange={e => setSimAgentProfile(e.target.value as ZoneSettings['simAgentProfile'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Exploratory</option>
              <option>Defensive</option>
              <option>Predictive</option>
              <option>Ethical Validator</option>
              <option>Custom</option>
            </select>
            <label className="block text-sm font-medium text-gray-700 mt-4">Sim Trigger Mode</label>
            <select
              value={autoSimFrequency}
              onChange={e => setAutoSimFrequency(e.target.value as ZoneSettings['autoSimFrequency'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Manual</option>
              <option>Threshold-based</option>
              <option>On Parent Drift</option>
              <option>Weekly</option>
            </select>

            {/* Conditional Fields for Root Zone Only */}
            {zone.depth === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">Impact Domain</label>
                <select
                  value={impactDomain}
                  onChange={e => setImpactDomain(e.target.value as ZoneSettings['impactDomain'])}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Local Policy</option>
                  <option>Regional Healthcare</option>
                  <option>Global BioStrategy</option>
                  <option>Ethical</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Epistemic Intent</label>
                <select
                  value={epistemicIntent}
                  onChange={e => setEpistemicIntent(e.target.value as ZoneSettings['epistemicIntent'])}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Diagnostic</option>
                  <option>Forecasting</option>
                  <option>Moral Risk Evaluation</option>
                  <option>Policy Proposal</option>
                  <option>Unknown / Exploratory</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Ethical Sensitivity</label>
                <select
                  value={ethicalSensitivity}
                  onChange={e => setEthicalSensitivity(e.target.value as ZoneSettings['ethicalSensitivity'])}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Extreme</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Created by</label>
                <select
                  value={createdBy}
                  onChange={e => setCreatedBy(e.target.value as ZoneSettings['createdBy'])}
                  className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>user</option>
                  <option>system</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Guardian ID</label>
                <input
                  type="text"
                  value={guardianId}
                  onChange={e => setGuardianId(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </>
            )}

            {/* Guardian Trigger Level (Always Present) */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Guardian Trigger Level</label>
            <div className="flex space-x-2">
              <div>
                <label className="text-sm text-gray-700">Drift</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={drift}
                  onChange={e => setDrift(Number(e.target.value))}
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
                  value={entropy}
                  onChange={e => setEntropy(Number(e.target.value))}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ethical Flag</label>
                <input
                  type="checkbox"
                  checked={ethicalFlag}
                  onChange={e => setEthicalFlag(e.target.checked)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Save/Cancel Buttons */}
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

export default function ZoneDashboardPage() {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  const [zoneDomain, setZoneDomain] = useState('Biotech');
  const [prototypeZoneName, setPrototypeZoneName] = useState('Root Zone Prototype');
  const [recursionLevel, setRecursionLevel] = useState(1);
  const [simAgentProfile, setSimAgentProfile] = useState('Exploratory');
  const [autoSimFrequency, setAutoSimFrequency] = useState('Manual');
  const [impactDomain, setImpactDomain] = useState('Local Policy');
  const [confidentiality, setConfidentiality] = useState<ZoneSettings['confidentiality']>('Public');
  const [sharedWithDAO, setSharedWithDAO] = useState(false);
  const [epistemicIntent, setEpistemicIntent] = useState<ZoneSettings['epistemicIntent']>('Diagnostic');
  const [ethicalSensitivity, setEthicalSensitivity] = useState<ZoneSettings['ethicalSensitivity']>('Low');
  const [createdBy, setCreatedBy] = useState<ZoneSettings['createdBy']>('user');
  const [guardianId, setGuardianId] = useState('');
  const [drift, setDrift] = useState(0.5);
  const [entropy, setEntropy] = useState(0.7);
  const [ethicalFlag, setEthicalFlag] = useState(false);
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: Number(depth) || 2,
  });

  useEffect(() => {
    if (!tree) return;
    const allZones: Zone[] = [];
    const collectZones = (z: ZoneType) => {
      allZones.push({
        id: z.id,
        name: z.name,
        path: z.path || `/default/path/${z.id}`, // Provide a default path if necessary
        depth: z.depth,
        approved: false,
        archetype: archetypeId as string,
        metadata: {
          sharedWithDAO,
          confidentiality,
          userNotes: '',
        },
        ce2: {
          intent: epistemicIntent,
          sensitivity: ethicalSensitivity,
          createdBy,
          guardianId,
          guardianTrigger: {
            drift,
            entropy,
            ethicalFlag,
          },
        },
        children: [],
      });
      z.children?.forEach(child => collectZones(child as ZoneType));
    };
    collectZones(tree as ZoneType);
    // Atomic update
    console.log('Persisting zoneRegistry to localStorage:', allZones);
    localStorage.setItem('zoneRegistry', JSON.stringify(allZones));
    console.log('Dispatching zoneRegistryChange event');
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }, [tree, archetypeId, confidentiality, sharedWithDAO, epistemicIntent, ethicalSensitivity, createdBy, guardianId, drift, entropy, ethicalFlag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  const dummyTree: ZoneType = {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '/dashboard/root',
    approved: false,
    depth: 1,
    archetype: 'Biotech',
    metadata: {
      sharedWithDAO: false,
      confidentiality: 'Public',
      userNotes: '',
    },
    ce2: {
      intent: 'Diagnostic',
      sensitivity: 'Low',
      createdBy: 'user',
      guardianId: 'default_guardian',
      guardianTrigger: {
        drift: 0.5,
        entropy: 0.7,
        ethicalFlag: false,
      },
    },
    children: [],
  };

  const displayTree = (tree as ZoneType) ?? dummyTree;
  const [settings, setSettings] = useState<Record<string, ZoneSettings>>({});

  const handleUpdate = (zoneId: string, updatedSettings: ZoneSettings) => {
    setSettings(prev => ({
      ...prev,
      [zoneId]: updatedSettings,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CE² Zone Prototype Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Domain of Interest</label>
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
              Prototype Zone Name <span className="text-xs text-gray-500">(shown in main dashboard)</span>
            </label>
            <input
              type="text"
              value={prototypeZoneName}
              onChange={e => setPrototypeZoneName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level of Recursion / Depth</label>
            <input
              type="number"
              min={1}
              max={3}
              value={recursionLevel}
              onChange={e => setRecursionLevel(Number(e.target.value))}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Simulation Profile</label>
            <select
              value={simAgentProfile}
              onChange={e => setSimAgentProfile(e.target.value as ZoneSettings['simAgentProfile'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Exploratory</option>
              <option>Defensive</option>
              <option>Predictive</option>
              <option>Ethical Validator</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sim Trigger Mode</label>
            <select
              value={autoSimFrequency}
              onChange={e => setAutoSimFrequency(e.target.value as ZoneSettings['autoSimFrequency'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Manual</option>
              <option>Threshold-based</option>
              <option>On Parent Drift</option>
              <option>Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Impact Domain</label>
            <select
              value={impactDomain}
              onChange={e => setImpactDomain(e.target.value as ZoneSettings['impactDomain'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Local Policy</option>
              <option>Regional Healthcare</option>
              <option>Global BioStrategy</option>
              <option>Ethical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confidentiality Level</label>
            <select
              value={confidentiality}
              onChange={e => setConfidentiality(e.target.value as ZoneSettings['confidentiality'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Public</option>
              <option>Confidential</option>
              <option>Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Share with DAO</label>
            <input
              type="checkbox"
              checked={sharedWithDAO}
              onChange={e => setSharedWithDAO(e.target.checked)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Epistemic Intent</label>
            <select
              value={epistemicIntent}
              onChange={e => setEpistemicIntent(e.target.value as ZoneSettings['epistemicIntent'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Diagnostic</option>
              <option>Forecasting</option>
              <option>Moral Risk Evaluation</option>
              <option>Policy Proposal</option>
              <option>Unknown / Exploratory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ethical Sensitivity</label>
            <select
              value={ethicalSensitivity}
              onChange={e => setEthicalSensitivity(e.target.value as ZoneSettings['ethicalSensitivity'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Extreme</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created by</label>
            <select
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value as ZoneSettings['createdBy'])}
              className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>user</option>
              <option>system</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian ID</label>
            <input
              type="text"
              value={guardianId}
              onChange={e => setGuardianId(e.target.value)}
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
                  value={drift}
                  onChange={e => setDrift(Number(e.target.value))}
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
                  value={entropy}
                  onChange={e => setEntropy(Number(e.target.value))}
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ethical Flag</label>
                <input
                  type="checkbox"
                  checked={ethicalFlag}
                  onChange={e => setEthicalFlag(e.target.checked)}
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
        <ZoneNode zone={displayTree} settings={settings} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
