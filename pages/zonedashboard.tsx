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

// Email sending function
const sendZoneDataEmail = async (email: string, data: any) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'New Zone Data Submission',
        text: `Zone data collected:\n\n${JSON.stringify(data, null, 2)}`,
        html: `
          <h1>Zone Data Collected</h1>
          <h2>User: ${data.user}</h2>
          <h3>Timestamp: ${new Date(data.timestamp).toLocaleString()}</h3>
          <h3>Archetype: ${data.archetypeName} (${data.archetypeId})</h3>
          <h3>Total Zones: ${data.zones.length}</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Zone Node Component (unchanged from previous implementation)
const ZoneNode: React.FC<{
  zone: ZoneType;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
}> = ({ zone, settings, onUpdate }) => {
  // ... (keep the exact same ZoneNode implementation as before)
};

// Main Dashboard Component with email functionality
const ZoneDashboardPage = () => {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  
  const [formState, setFormState] = useState({
    userEmail: 'omnichain@icloud.com',
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: formState.recursionLevel,
  });

  const collectAllZones = (zoneTree: ZoneType): Zone[] => {
    const allZones: Zone[] = [];
    
    const collect = (z: ZoneType) => {
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
      z.children?.forEach(child => collect(child as ZoneType));
    };

    collect(zoneTree);
    return allZones;
  };

  useEffect(() => {
    if (!tree) return;
    
    const allZones = collectAllZones(tree as ZoneType);
    localStorage.setItem('zoneRegistry', JSON.stringify(allZones));
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }, [tree, archetypeId, formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setEmailSent(false);
    
    try {
      // First generate the zones
      await refresh();
      
      if (tree) {
        const allZones = collectAllZones(tree as ZoneType);
        
        // Send email with all collected data
        await sendZoneDataEmail(formState.userEmail, {
          user: formState.userEmail,
          timestamp: new Date().toISOString(),
          archetypeId,
          archetypeName,
          zones: allZones,
          settings: settings,
          formData: formState,
        });
        
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating zones or sending report');
    } finally {
      setIsSendingEmail(false);
    }
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
          {/* Email Collection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email for Report Delivery
              <span className="text-xs text-gray-500 ml-1">(required)</span>
            </label>
            <input
              type="email"
              value={formState.userEmail}
              onChange={e => handleChange('userEmail', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your email for report delivery"
            />
          </div>

          {/* Rest of the form inputs (unchanged from previous implementation) */}
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

          {/* ... include all other form fields exactly as in the previous implementation ... */}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || isSendingEmail}
              className={`w-full py-2 px-4 text-white rounded-md transition
                ${loading || isSendingEmail 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSendingEmail ? 'Sending Report...' : 
               loading ? 'Generating Zones...' : 
               'Generate Zones & Send Report'}
            </button>
            
            {emailSent && (
              <p className="mt-2 text-center text-green-600">
                Report successfully sent to {formState.userEmail}
              </p>
            )}
          </div>
        </form>

        {loading && <p className="text-center text-gray-600">Generating zone tree...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        
        {tree && <ZoneNode zone={tree} settings={settings} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
