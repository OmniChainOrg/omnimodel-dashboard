import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useZoneArchetype } from '../hooks/useZoneArchetype';
import type { Zone, ZoneSettings } from '@/types/Zone';

type ZoneType = Zone & { children?: ZoneType[] };

interface FormState {
  userEmail: string;
  zoneDomain: string;
  prototypeZoneName: string;
  recursionLevel: number; // Added missing property
  simAgentProfile: string;
  autoSimFrequency: string;
  impactDomain: string;
  confidentiality: string;
  sharedWithDAO: boolean;
  epistemicIntent: string;
  ethicalSensitivity: string;
  createdBy: string;
  guardianId: string;
  drift: number;
  entropy: number;
  ethicalFlag: boolean;
}

const ZoneDashboardPage = () => {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  
  const [formState, setFormState] = useState<FormState>({
    userEmail: 'omnichain@icloud.com',
    zoneDomain: 'Biotech',
    prototypeZoneName: 'Root Zone Prototype',
    recursionLevel: Number(depth) || 1, // Now properly typed
    simAgentProfile: 'Exploratory',
    autoSimFrequency: 'Manual',
    impactDomain: 'Local Policy',
    confidentiality: 'Public',
    sharedWithDAO: false,
    epistemicIntent: 'Diagnostic',
    ethicalSensitivity: 'Low',
    createdBy: 'user',
    guardianId: '',
    drift: 0.5,
    entropy: 0.7,
    ethicalFlag: false
  });

  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: formState.recursionLevel // Now works correctly
  });

// Form configuration
const FORM_FIELDS = [
  { name: 'zoneDomain', label: 'Zone Domain of Interest', type: 'select', options: [
    'Biotech', 'MedTech', 'Pharma Formulation', 'Clinical Trials', 'RegOps',
    'DeSci', 'DeTrade', 'DeInvest', 'Nonprofit', 'Philanthropy',
    'Humanitarian', 'AI ethics', 'dApps DevOps', 'Investment', 'Granting', 'Other'
  ]},
  { name: 'prototypeZoneName', label: 'Prototype Zone Name', type: 'text' },
  { name: 'recursionLevel', label: 'Level of Recursion / Depth', type: 'number', min: 1, max: 5 },
  { name: 'simAgentProfile', label: 'Simulation Profile', type: 'select', options: [
    'Exploratory', 'Defensive', 'Predictive', 'Ethical Validator', 'Custom'
  ]},
  { name: 'autoSimFrequency', label: 'Sim Trigger Mode', type: 'select', options: [
    'Manual', 'Threshold-based', 'On Parent Drift', 'Weekly'
  ]},
  { name: 'impactDomain', label: 'Impact Domain', type: 'select', options: [
    'Local Policy', 'Regional Healthcare', 'Global BioStrategy', 'Ethical'
  ]},
  { name: 'confidentiality', label: 'Confidentiality Level', type: 'select', options: [
    'Public', 'Confidential', 'Private'
  ]},
  { name: 'epistemicIntent', label: 'Epistemic Intent', type: 'select', options: [
    'Diagnostic', 'Forecasting', 'Moral Risk Evaluation', 'Policy Proposal', 'Unknown / Exploratory'
  ]},
  { name: 'ethicalSensitivity', label: 'Ethical Sensitivity', type: 'select', options: [
    'Low', 'Medium', 'High', 'Extreme'
  ]},
  { name: 'createdBy', label: 'Created by', type: 'select', options: ['user', 'system'] },
  { name: 'guardianId', label: 'Guardian ID', type: 'text' }
];

// Form Field Component (DRY implementation)
const FormField = ({ field, value, onChange }: {
  field: typeof FORM_FIELDS[0];
  value: any;
  onChange: (name: string, value: any) => void;
}) => {
  const commonProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
      onChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value),
    className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.type === 'number' && (
          <span className="text-xs text-gray-500 ml-1">({field.min}-{field.max})</span>
        )}
      </label>
      {field.type === 'select' ? (
        <select {...commonProps}>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          min={field.min}
          max={field.max}
          {...commonProps}
        />
      )}
    </div>
  );
};

// Zone Node Component
const ZoneNode = React.memo(({ 
  zone, 
  settings = {}, 
  onUpdate 
}: {
  zone: ZoneType;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
}) => {
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
    metadata: { sharedWithDAO: false, confidentiality: 'Public', userNotes: '' },
    guardianTrigger: { drift: 0.5, entropy: 0.7, ethicalFlag: false }
  };

  const [form, setForm] = useState(currentSettings);

  const handleSave = () => {
    onUpdate(zone.id, {
      ...form,
      metadata: {
        ...form.metadata,
        confidentiality: form.confidentiality,
        userNotes: form.info
      }
    });
    setExpanded(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full mr-2 ${
              form.ethicalSensitivity === 'Low' ? 'bg-green-500' :
              form.ethicalSensitivity === 'Medium' ? 'bg-yellow-500' :
              form.ethicalSensitivity === 'High' ? 'bg-red-500' : 'bg-black'
            }`} />
            <h3 className="text-xl font-semibold text-blue-600">{zone.name}</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            {expanded ? 'Close' : 'Customize'}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4">
            <FormField 
              field={{ name: 'info', label: 'Info to Share', type: 'text' }}
              value={form.info}
              onChange={(name, value) => setForm(prev => ({ ...prev, [name]: value }))}
            />

            {zone.depth !== 1 && FORM_FIELDS.slice(3).map(field => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name as keyof typeof form]}
                onChange={(name, value) => setForm(prev => ({ ...prev, [name]: value }))}
              />
            ))}

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => { setForm(currentSettings); setExpanded(false); }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {zone.children?.length > 0 && (
        <div className="ml-10 mt-4 border-l-2 border-blue-200 pl-8">
          {zone.children.map(child => (
            <ZoneNode key={child.id} zone={child} settings={settings} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </motion.div>
  );
});

// Main Dashboard Component
const ZoneDashboardPage = () => {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  const [formState, setFormState] = useState({
    userEmail: 'omnichain@icloud.com',
    ...Object.fromEntries(FORM_FIELDS.map(f => [f.name, 
      f.type === 'number' ? Number(depth) || 1 : 
      f.options ? f.options[0] : ''
    ])),
    sharedWithDAO: false,
    drift: 0.5,
    entropy: 0.7,
    ethicalFlag: false
  });

  const [settings, setSettings] = useState<Record<string, ZoneSettings>>({});
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: formState.recursionLevel
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await refresh();
    
    if (tree) {
      const allZones: Zone[] = [];
      const collectZones = (z: ZoneType) => {
        allZones.push({
          id: z.id,
          name: z.name,
          path: z.path || `/zone/${z.id}`,
          depth: z.depth,
          archetype: archetypeId as string,
          metadata: {
            sharedWithDAO: formState.sharedWithDAO,
            confidentiality: formState.confidentiality,
            userNotes: z.metadata?.userNotes || ''
          },
          guardianTrigger: {
            drift: formState.drift,
            entropy: formState.entropy,
            ethicalFlag: formState.ethicalFlag
          }
        });
        z.children?.forEach(collectZones);
      };
      collectZones(tree);

      localStorage.setItem('zoneRegistry', JSON.stringify(allZones));
      await sendZoneDataEmail(formState.userEmail, {
        user: formState.userEmail,
        timestamp: new Date().toISOString(),
        archetypeId,
        archetypeName,
        zones: allZones,
        settings
      });
    }
  };

  if (!router.isReady) return <div className="text-center mt-8">Loading...</div>;
  if (!archetypeId || !archetypeName) {
    return <div className="text-center mt-8 text-red-600">Missing archetype parameters.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CE² Zone Prototype Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <FormField 
            field={{ name: 'userEmail', label: 'Email for Report Delivery', type: 'text' }}
            value={formState.userEmail}
            onChange={(name, value) => setFormState(prev => ({ ...prev, [name]: value }))}
          />

          {FORM_FIELDS.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={formState[field.name as keyof typeof formState]}
              onChange={(name, value) => setFormState(prev => ({ ...prev, [name]: value }))}
            />
          ))}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formState.sharedWithDAO}
              onChange={e => setFormState(prev => ({ ...prev, sharedWithDAO: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Share with DAO</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md transition ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Zones & Send Report'}
          </button>
        </form>

        {loading && <p className="text-center text-gray-600">Generating zone tree...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {tree && <ZoneNode zone={tree} settings={settings} onUpdate={(id, s) => setSettings(p => ({ ...p, [id]: s }))} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
