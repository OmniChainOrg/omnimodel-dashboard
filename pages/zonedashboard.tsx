// pages/zonedashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useZoneArchetype } from '../hooks/useZoneArchetype';
import type { Zone } from '@/types/Zone';
import { FiAlertTriangle, FiInfo, FiBell, FiCheckCircle, FiX, FiChevronDown, FiChevronUp, FiSave, FiTrash2 } from 'react-icons/fi';

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

interface ZoneEvent {
  id: string;
  zone: 'critical' | 'warning' | 'normal' | 'info';
  message: string;
  timestamp: Date;
  resolved?: boolean;
}

interface AlertState {
  alerts: ZoneEvent[];
  showAlerts: boolean;
  unreadCount: number;
}

const DEFAULT_ZONE_SETTINGS: ZoneSettings = {
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

const ZoneAlertSystem = {
  alerts: [] as ZoneEvent[],
  subscribers: [] as ((alert: ZoneEvent) => void)[],

  subscribe(callback: (alert: ZoneEvent) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  },

  async trigger(event: ZoneEvent) {
    try {
      console.log('Zone Alert:', event);
      this.alerts.push(event);
      
      // Send to API endpoint
      await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      // Notify subscribers
      this.subscribers.forEach(sub => sub(event));
    } catch (error) {
      console.error('Alert failed:', error);
      this.subscribers.forEach(sub => sub({
        ...event,
        zone: 'critical',
        message: `Alert failed: ${event.message}`
      }));
    }
  },

  resolveAlert(id: string) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.resolved = true;
    }
  },

  getUnresolvedAlerts() {
    return this.alerts.filter(a => !a.resolved);
  }
};

const AlertBanner: React.FC<{ alert: ZoneEvent; onDismiss: (id: string) => void }> = ({ alert, onDismiss }) => {
  const bgColor = {
    critical: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    normal: 'bg-blue-100 border-blue-400 text-blue-700',
    info: 'bg-gray-100 border-gray-400 text-gray-700',
  }[alert.zone];

  const icon = {
    critical: <FiAlertTriangle className="mr-2" />,
    warning: <FiAlertTriangle className="mr-2" />,
    normal: <FiInfo className="mr-2" />,
    info: <FiInfo className="mr-2" />,
  }[alert.zone];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`border-l-4 p-4 mb-2 rounded ${bgColor} flex justify-between items-center`}
    >
      <div className="flex items-center">
        {icon}
        <span>{alert.message}</span>
      </div>
      <button onClick={() => onDismiss(alert.id)} className="ml-4">
        <FiX />
      </button>
    </motion.div>
  );
};

const AlertCenter: React.FC<{ alerts: ZoneEvent[]; onDismiss: (id: string) => void }> = ({ alerts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <AnimatePresence>
        {alerts.slice(0, 3).map(alert => (
          <AlertBanner key={alert.id} alert={alert} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ZoneNode: React.FC<{
  zone: ZoneType;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
  onAlert: (event: ZoneEvent) => void;
}> = ({ zone, settings, onUpdate, onAlert }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentSettings = settings[zone.id] || { ...DEFAULT_ZONE_SETTINGS };

  const [formState, setFormState] = useState(currentSettings);

  useEffect(() => {
    // Check for critical conditions when zone is loaded or updated
    if (zone.depth > 3) {
      const event: ZoneEvent = {
        id: `depth-${zone.id}`,
        zone: 'critical',
        message: `Zone "${zone.name}" exceeds depth threshold (depth: ${zone.depth})`,
        timestamp: new Date()
      };
      onAlert(event);
      ZoneAlertSystem.trigger(event);
    }

    if (formState.ethicalSensitivity === 'Extreme' && formState.confidentiality === 'Public') {
      const event: ZoneEvent = {
        id: `confidentiality-${zone.id}`,
        zone: 'warning',
        message: `Zone "${zone.name}" has extreme sensitivity but public confidentiality`,
        timestamp: new Date()
      };
      onAlert(event);
      ZoneAlertSystem.trigger(event);
    }
  }, [zone, formState]);

  const handleSave = () => {
    if (!formState.info.trim()) {
      const event: ZoneEvent = {
        id: `validation-${zone.id}`,
        zone: 'warning',
        message: `Please enter information to share for zone "${zone.name}"`,
        timestamp: new Date()
      };
      onAlert(event);
      ZoneAlertSystem.trigger(event);
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
    setIsEditing(false);
    
    const event: ZoneEvent = {
      id: `save-${zone.id}-${Date.now()}`,
      zone: 'normal',
      message: `Zone "${zone.name}" settings saved successfully`,
      timestamp: new Date()
    };
    onAlert(event);
    ZoneAlertSystem.trigger(event);
  };

  const handleChange = (field: keyof ZoneSettings, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    const event: ZoneEvent = {
      id: `delete-${zone.id}`,
      zone: 'warning',
      message: `Zone "${zone.name}" has been deleted`,
      timestamp: new Date()
    };
    onAlert(event);
    ZoneAlertSystem.trigger(event);
    
    // Actual deletion logic would go here
    setConfirmDelete(false);
    setIsEditing(false);
    setExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className={`p-6 rounded-2xl shadow-lg ${formState.ethicalSensitivity === 'Extreme' ? 'bg-red-50 border border-red-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span
              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                formState.ethicalSensitivity === 'Low' ? 'bg-green-500' :
                formState.ethicalSensitivity === 'Medium' ? 'bg-yellow-500' :
                formState.ethicalSensitivity === 'High' ? 'bg-red-500' :
                'bg-black'
              }`}
            ></span>
            <div>
              <h3 className="text-xl font-semibold text-blue-600">{zone.name}</h3>
              <div className="flex space-x-3 text-sm text-gray-500">
                <span>Level: {zone.depth}</span>
                <span>|</span>
                <span>Intent: {formState.epistemicIntent}</span>
                <span>|</span>
                <span>Confidentiality: {formState.confidentiality}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1 rounded transition ${isEditing ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
              >
                <FiSave className="mr-1" /> Save
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 space-y-4">
            {/* Expanded editing form with all fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields remain the same as before */}
              {/* ... */}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded transition flex items-center ${
                  confirmDelete 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <FiTrash2 className="mr-1" />
                {confirmDelete ? 'Confirm Delete' : 'Delete Zone'}
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
                >
                  <FiSave className="mr-1" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {zone.children && zone.children.length > 0 && (
        <div className="ml-10 mt-4 border-l-2 border-blue-200 pl-8">
          {zone.children.map(child => (
            <ZoneNode 
              key={child.id} 
              zone={child} 
              settings={settings} 
              onUpdate={onUpdate}
              onAlert={onAlert}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

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
  const [alerts, setAlerts] = useState<AlertState>({
    alerts: [],
    showAlerts: false,
    unreadCount: 0
  });

  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: formState.recursionLevel,
  });

  const handleAlert = useCallback((event: ZoneEvent) => {
    setAlerts(prev => ({
      ...prev,
      alerts: [event, ...prev.alerts].slice(0, 20), // Keep max 20 alerts
      unreadCount: prev.showAlerts ? 0 : prev.unreadCount + 1
    }));
  }, []);

  useEffect(() => {
    const unsubscribe = ZoneAlertSystem.subscribe(handleAlert);
    return () => unsubscribe();
  }, [handleAlert]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => ({
      ...prev,
      alerts: prev.alerts.filter(a => a.id !== id)
    }));
    ZoneAlertSystem.resolveAlert(id);
  };

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

      if (z.depth > formState.recursionLevel - 1) {
        const event: ZoneEvent = {
          id: `recursion-${z.id}`,
          zone: 'warning',
          message: `Zone "${z.name}" depth approaching recursion limit`,
          timestamp: new Date()
        };
        handleAlert(event);
        ZoneAlertSystem.trigger(event);
      }

      z.children?.forEach(child => collectZones(child as ZoneType));
    };
    
    collectZones(tree as ZoneType);
    localStorage.setItem('zoneRegistry', JSON.stringify(allZones));
    window.dispatchEvent(new Event('zoneRegistryChange'));

    // Success alert
    const event: ZoneEvent = {
      id: `generation-${Date.now()}`,
      zone: 'normal',
      message: `Successfully generated zone tree with ${allZones.length} zones`,
      timestamp: new Date()
    };
    handleAlert(event);
    ZoneAlertSystem.trigger(event);
  }, [tree, archetypeId, formState, handleAlert]);

  // ... rest of the component remains the same ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Alert notification bell */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setAlerts(prev => ({
              ...prev,
              showAlerts: !prev.showAlerts,
              unreadCount: 0
            }))}
            className="relative p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <FiBell className="text-gray-700" />
            {alerts.unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alerts.unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          {/* Form and other existing content */}
          {/* ... */}
        </div>

        {tree && (
          <ZoneNode 
            zone={tree} 
            settings={settings} 
            onUpdate={handleUpdate}
            onAlert={handleAlert}
          />
        )}
      </div>

      {/* Alert center */}
      {alerts.showAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end items-start pt-16 pr-4">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Zone Alerts</h3>
              <button onClick={() => setAlerts(prev => ({ ...prev, showAlerts: false }))}>
                <FiX />
              </button>
            </div>
            <div className="p-4">
              {alerts.alerts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No active alerts</div>
              ) : (
                alerts.alerts.map(alert => (
                  <div key={alert.id} className="mb-3 last:mb-0">
                    <AlertBanner alert={alert} onDismiss={dismissAlert} />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating alerts */}
      <AlertCenter 
        alerts={alerts.alerts.filter(a => !alerts.showAlerts)} 
        onDismiss={dismissAlert} 
      />
    </div>
  );
};

export default ZoneDashboardPage;
