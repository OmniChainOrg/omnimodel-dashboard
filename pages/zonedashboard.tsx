// pages/zonedashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useZoneArchetype } from '../hooks/useZoneArchetype';
import type { Zone } from '@/types/Zone';
import { 
  FiAlertTriangle, 
  FiInfo, 
  FiBell, 
  FiCheckCircle, 
  FiX, 
  FiChevronDown, 
  FiChevronUp, 
  FiSave, 
  FiTrash2,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiShare2,
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
  FiClock,
  FiCalendar,
  FiFilter,
  FiSearch,
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiCopy,
  FiEdit,
  FiExternalLink
} from 'react-icons/fi';

// ==================== TYPE DEFINITIONS ====================
type ZoneType = Zone & { 
  children?: ZoneType[];
  depth: number; // Make depth required
  status?: 'active' | 'archived' | 'draft';
  lastUpdated?: Date;
};

interface ZoneSettings {
  id: string;
  name: string;
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
    tags?: string[];
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
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
  accessControl?: {
    view: string[];
    edit: string[];
    admin: string[];
  };
  version?: number;
}

interface ZoneEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'critical' | 'warning' | 'normal' | 'info' | 'success';
  message: string;
  timestamp: Date;
  resolved?: boolean;
  acknowledged?: boolean;
  source?: 'system' | 'user' | 'guardian';
  actions?: {
    label: string;
    handler: (zoneId: string) => void;
  }[];
}

interface AlertState {
  alerts: ZoneEvent[];
  showAlertsPanel: boolean;
  unreadCount: number;
  filters: {
    types: string[];
    resolved: boolean;
    acknowledged: boolean;
  };
}

interface ZoneHistoryItem {
  id: string;
  zoneId: string;
  action: 'created' | 'updated' | 'deleted' | 'settings_changed' | 'access_modified';
  timestamp: Date;
  user: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

interface ZoneDashboardState {
  zones: ZoneType[];
  settings: Record<string, ZoneSettings>;
  selectedZone?: string;
  viewMode: 'tree' | 'list' | 'grid';
  searchQuery: string;
  filters: {
    confidentiality: string[];
    sensitivity: string[];
    intent: string[];
    status: string[];
  };
  history: ZoneHistoryItem[];
}

const CONFIDENTIALITY_OPTIONS = ['Public', 'Confidential', 'Private'] as const;
const SIM_PROFILE_OPTIONS = ['Exploratory', 'Defensive', 'Predictive', 'Ethical Validator', 'Custom'] as const;
const SIM_FREQUENCY_OPTIONS = ['Manual', 'Threshold-based', 'On Parent Drift', 'Weekly'] as const;
const IMPACT_DOMAIN_OPTIONS = ['Local Policy', 'Regional Healthcare', 'Global BioStrategy', 'Ethical'] as const;
const EPISTEMIC_INTENT_OPTIONS = ['Diagnostic', 'Forecasting', 'Moral Risk Evaluation', 'Policy Proposal', 'Unknown / Exploratory'] as const;
const ETHICAL_SENSITIVITY_OPTIONS = ['Low', 'Medium', 'High', 'Extreme'] as const;
const CREATED_BY_OPTIONS = ['user', 'system'] as const;

// ==================== DEFAULT SETTINGS ====================
const DEFAULT_ZONE_SETTINGS: ZoneSettings = {
  id: '',
  name: '',
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
    tags: [],
    attachments: []
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
  accessControl: {
    view: ['*'],
    edit: [],
    admin: []
  },
  version: 1
};

// ==================== ALERT SYSTEM ====================
class ZoneAlertSystem {
  private static instance: ZoneAlertSystem;
  private alerts: ZoneEvent[] = [];
  private subscribers: ((alert: ZoneEvent) => void)[] = [];
  private history: ZoneEvent[] = [];
  private maxAlerts = 100;

  private constructor() {}

  public static getInstance(): ZoneAlertSystem {
    if (!ZoneAlertSystem.instance) {
      ZoneAlertSystem.instance = new ZoneAlertSystem();
    }
    return ZoneAlertSystem.instance;
  }

  subscribe(callback: (alert: ZoneEvent) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  async trigger(event: ZoneEvent): Promise<void> {
    try {
      console.log(`[ZoneAlert] ${event.type.toUpperCase()}: ${event.message}`);
      this.alerts = [event, ...this.alerts].slice(0, this.maxAlerts);
      this.history = [event, ...this.history].slice(0, this.maxAlerts * 3);

      await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      this.subscribers.forEach(sub => sub(event));
    } catch (error) {
      console.error('Alert dispatch failed:', error);
      const errorEvent: ZoneEvent = {
        ...event,
        id: `error-${Date.now()}`,
        type: 'critical',
        message: `Alert failed: ${event.message}`,
        source: 'system'
      };
      this.subscribers.forEach(sub => sub(errorEvent));
    }
  }

  resolveAlert(id: string): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.resolved = true;
      this.subscribers.forEach(sub => sub(alert));
    }
  }

  acknowledgeAlert(id: string): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      this.subscribers.forEach(sub => sub(alert));
    }
  }

  getActiveAlerts(): ZoneEvent[] {
    return this.alerts.filter(a => !a.resolved);
  }

  getAlertHistory(count = 20): ZoneEvent[] {
    return this.history.slice(0, count);
  }

  clearAlerts(): void {
    this.alerts = [];
    this.subscribers.forEach(sub => sub({
      id: 'clear-all',
      zoneId: 'system',
      zoneName: 'System',
      type: 'info',
      message: 'All alerts cleared',
      timestamp: new Date(),
      source: 'system'
    }));
  }
}

// ==================== UI COMPONENTS ====================
const AlertBanner: React.FC<{ 
  alert: ZoneEvent; 
  onDismiss: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  showActions?: boolean;
}> = ({ alert, onDismiss, onAcknowledge, showActions = true }) => {
  const alertStyles = {
    critical: 'bg-red-50 border-l-4 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
    normal: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
    info: 'bg-gray-50 border-l-4 border-gray-500 text-gray-800',
    success: 'bg-green-50 border-l-4 border-green-500 text-green-800'
  };

  const alertIcons = {
    critical: <FiAlertCircle className="text-red-500" />,
    warning: <FiAlertTriangle className="text-yellow-500" />,
    normal: <FiInfo className="text-blue-500" />,
    info: <FiInfo className="text-gray-500" />,
    success: <FiCheckCircle className="text-green-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`p-4 mb-3 rounded-r ${alertStyles[alert.type]} shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            {alertIcons[alert.type]}
          </div>
          <div>
            <div className="font-medium">{alert.message}</div>
            <div className="text-xs mt-1 opacity-75 flex items-center">
              <FiClock className="mr-1" size={12} />
              {new Date(alert.timestamp).toLocaleString()}
              {alert.zoneName && (
                <>
                  <span className="mx-2">•</span>
                  <FiActivity className="mr-1" size={12} />
                  {alert.zoneName}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          {showActions && onAcknowledge && !alert.acknowledged && (
            <button 
              onClick={() => onAcknowledge(alert.id)}
              className="text-xs bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              title="Acknowledge"
            >
              <FiCheckCircle size={14} />
            </button>
          )}
          <button 
            onClick={() => onDismiss(alert.id)}
            className="text-xs bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
            title="Dismiss"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>
      {alert.actions && alert.actions.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
          {alert.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.handler(alert.zoneId)} // Pass zoneId here
              className="text-xs bg-white px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const AlertCenterPanel: React.FC<{
  alerts: ZoneEvent[];
  onDismiss: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onClearAll: () => void;
  filters: AlertState['filters'];
  onFilterChange: (filters: Partial<AlertState['filters']>) => void;
}> = ({ alerts, onDismiss, onAcknowledge, onClearAll, filters, onFilterChange }) => {
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const typeMatch = filters.types.length === 0 || filters.types.includes(alert.type);
      const resolvedMatch = filters.resolved ? true : !alert.resolved;
      const acknowledgedMatch = filters.acknowledged ? true : !alert.acknowledged;
      return typeMatch && resolvedMatch && acknowledgedMatch;
    });
  }, [alerts, filters]);

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center">
          <FiAlertTriangle className="mr-2" /> Zone Alerts Center
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={onClearAll}
            className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 flex items-center"
          >
            <FiTrash2 size={14} className="mr-1" /> Clear All
          </button>
          <button 
            onClick={() => onFilterChange({ acknowledged: !filters.acknowledged })}
            className={`text-sm px-3 py-1 rounded flex items-center ${
              filters.acknowledged ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FiEye size={14} className="mr-1" /> Show Ack
          </button>
          <button 
            onClick={() => onFilterChange({ resolved: !filters.resolved })}
            className={`text-sm px-3 py-1 rounded flex items-center ${
              filters.resolved ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FiCheckCircle size={14} className="mr-1" /> Show Resolved
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['critical', 'warning', 'normal', 'info', 'success'].map(type => (
            <button
              key={type}
              onClick={() => {
                const newTypes = filters.types.includes(type)
                  ? filters.types.filter(t => t !== type)
                  : [...filters.types, type];
                onFilterChange({ types: newTypes });
              }}
              className={`text-xs px-3 py-1 rounded-full capitalize flex items-center ${
                filters.types.includes(type)
                  ? type === 'critical' ? 'bg-red-100 text-red-800' :
                    type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    type === 'normal' ? 'bg-blue-100 text-blue-800' :
                    type === 'info' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'critical' && <FiAlertTriangle size={12} className="mr-1" />}
              {type === 'warning' && <FiAlertTriangle size={12} className="mr-1" />}
              {type === 'normal' && <FiInfo size={12} className="mr-1" />}
              {type === 'info' && <FiInfo size={12} className="mr-1" />}
              {type === 'success' && <FiCheckCircle size={12} className="mr-1" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiBell className="mx-auto mb-2" size={24} />
            <p>No alerts match your current filters</p>
          </div>
        ) : (
          <div className="p-4">
            <AnimatePresence>
              {filteredAlerts.map(alert => (
                <AlertBanner
                  key={alert.id}
                  alert={alert}
                  onDismiss={onDismiss}
                  onAcknowledge={onAcknowledge}
                  showActions={true}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        Showing {filteredAlerts.length} of {alerts.length} total alerts
      </div>
    </div>
  );
};

const AlertNotificationBell: React.FC<{
  unreadCount: number;
  onClick: () => void;
}> = ({ unreadCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
      aria-label="Alerts"
    >
      <div className="relative">
        <FiBell className="text-gray-700" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

// ==================== ZONE NODE COMPONENT ====================
const ZoneNode: React.FC<{
  zone: ZoneType;
  settings: Record<string, ZoneSettings>;
  onUpdate: (zoneId: string, settings: ZoneSettings) => void;
  onAlert: (event: ZoneEvent) => void;
  onSelect?: (zoneId: string) => void;
  selected?: boolean;
  depth?: number;
}> = ({ zone, settings, onUpdate, onAlert, onSelect, selected = false, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const currentSettings = settings[zone.id] || { ...DEFAULT_ZONE_SETTINGS, id: zone.id, name: zone.name };

  const [formState, setFormState] = useState<ZoneSettings>(currentSettings);
  const [localAttachments, setLocalAttachments] = useState(currentSettings.metadata?.attachments || []);
  const [localTags, setLocalTags] = useState(currentSettings.metadata?.tags || []);

  // Handle alerts for zone conditions
  useEffect(() => {
    // Safely handle depth check
    const zoneDepth = zone.depth || 0; // Fallback to 0 if undefined
    if (zone.depth > 3) {
      
      const event: ZoneEvent = {
        id: `depth-${zone.id}-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        type: 'warning',
        message: `Zone depth exceeds recommended limit (current: ${zone.depth})`,
        timestamp: new Date(),
        source: 'system',
        actions: [{
          label: 'View Zone',
          handler: () => onSelect?.(zone.id)
        }]
      };
      onAlert(event);
      ZoneAlertSystem.getInstance().trigger(event);
    }

    const currentSensitivity = formState.ethicalSensitivity || 'Low';
    const currentConfidentiality = formState.confidentiality || 'Public';
    
    if (currentSensitivity === 'Extreme' && currentConfidentiality === 'Public') {
      const event: ZoneEvent = {
        id: `conflict-${zone.id}-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        type: 'critical',
        message: `Extreme sensitivity with public confidentiality in zone "${zone.name}"`,
        timestamp: new Date(),
        source: 'system',
        actions: [
          {
            label: 'Make Confidential',
            handler: (zoneId: string) => {
              handleChange('confidentiality', 'Confidential');
              ZoneAlertSystem.getInstance().resolveAlert(`conflict-${zone.id}-${Date.now()}`);
            }
          },
          {
            label: 'View Settings',
            handler: (zoneId: string) => {
              setIsEditing(true);
              onSelect?.(zone.id);
            }
          }
        ]
      };
      onAlert(event);
      ZoneAlertSystem.getInstance().trigger(event);
    }
  }, [zone, formState.ethicalSensitivity, formState.confidentiality]);

  // ... rest of the ZoneNode implementation ...

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 * depth }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`mb-3 ${selected ? 'ring-2 ring-blue-400 rounded-lg' : ''}`}
    >
      {/* Zone header */}
      <div 
        className={`p-4 rounded-lg shadow-sm ${getZoneBackground(zone, formState)} border ${selected ? 'border-blue-300' : 'border-gray-200'} hover:border-blue-200 transition-colors cursor-pointer`}
        onClick={() => onSelect?.(zone.id)}
      >
        {/* Header content */}
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              {expanded ? <FiChevronDown /> : <FiChevronUp />}
            </button>
            
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getSensitivityColor(formState.ethicalSensitivity)}`}></div>
            
            <div>
              <h3 className="font-medium text-gray-900 flex items-center">
                {zone.name}
                {formState.confidentiality !== 'Public' && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center">
                    {formState.confidentiality === 'Confidential' ? <FiLock size={12} className="mr-1" /> : <FiLock size={12} className="mr-1" />}
                    {formState.confidentiality}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                <span>Depth: {zone.depth}</span>
                <span>•</span>
                <span>Intent: {formState.epistemicIntent}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.5 rounded ${getSensitivityBadge(formState.ethicalSensitivity)}`}>
                  {formState.ethicalSensitivity} Sensitivity
                </span>
                {zone.status && (
                  <>
                    <span>•</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      zone.status === 'active' ? 'bg-green-100 text-green-800' :
                      zone.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {zone.status}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
              className={`p-2 rounded-full ${isEditing ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title={isEditing ? 'Cancel Editing' : 'Edit Zone'}
            >
              <FiEdit size={18} />
            </button>
            {zone.children && zone.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <FiMinus size={18} /> : <FiPlus size={18} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Expanded content */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {formState.info || <span className="text-gray-400">No description provided</span>}
            </div>
            
            {/* Metadata preview */}
            <div className="mt-2 flex flex-wrap gap-2">
              {localTags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Quick actions */}
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-xs bg-white px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center"
              >
                <FiEdit size={14} className="mr-1" /> Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share action
                }}
                className="text-xs bg-white px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center"
              >
                <FiShare2 size={14} className="mr-1" /> Share
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle simulate action
                }}
                className="text-xs bg-white px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center"
              >
                <FiActivity size={14} className="mr-1" /> Simulate
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Editing panel */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {/* Full editing form implementation */}
          {/* ... */}
        </motion.div>
      )}
      
      {/* Child zones */}
      {expanded && zone.children && zone.children.length > 0 && (
        <div className="ml-8 mt-2 pl-4 border-l-2 border-gray-200">
          {zone.children.map(child => (
            <ZoneNode
              key={child.id}
              zone={child}
              settings={settings}
              onUpdate={onUpdate}
              onAlert={onAlert}
              onSelect={onSelect}
              selected={selected === child.id}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
const ZoneDashboardPage: React.FC = () => {
  const router = useRouter();
  const { archetypeId, archetypeName, depth } = router.query;
  
  // State management
  const [state, setState] = useState<ZoneDashboardState>({
    zones: [],
    settings: {},
    viewMode: 'tree',
    searchQuery: '',
    filters: {
      confidentiality: [],
      sensitivity: [],
      intent: [],
      status: []
    },
    history: []
  });
  
  const [alertState, setAlertState] = useState<AlertState>({
    alerts: [],
    showAlertsPanel: false,
    unreadCount: 0,
    filters: {
      types: [],
      resolved: false,
      acknowledged: false
    }
  });
  
  const [generationForm, setGenerationForm] = useState({
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

  // Data hooks
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: archetypeId as string,
    archetypeName: archetypeName as string,
    depth: generationForm.recursionLevel,
  });

  // Effect hooks
  useEffect(() => {
    const alertSystem = ZoneAlertSystem.getInstance();
    const unsubscribe = alertSystem.subscribe((alert) => {
      setAlertState(prev => ({
        ...prev,
        alerts: [alert, ...prev.alerts].slice(0, 100),
        unreadCount: prev.showAlertsPanel ? 0 : prev.unreadCount + 1
      }));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!tree) return;
    
    const processZoneTree = (zone: ZoneType): ZoneType => {
      return {
        ...zone,
        children: zone.children?.map(processZoneTree),
        lastUpdated: new Date(),
        status: zone.depth === 0 ? 'active' : 
                zone.depth >= generationForm.recursionLevel - 1 ? 'draft' : 
                'active'
      };
    };
    
    const processedTree = processZoneTree(tree);
    setState(prev => ({
      ...prev,
      zones: [processedTree],
      selectedZone: processedTree.id
    }));
    
    // Generate initial settings
    const initialSettings: Record<string, ZoneSettings> = {};
    const generateSettings = (z: ZoneType) => {
      initialSettings[z.id] = {
        ...DEFAULT_ZONE_SETTINGS,
        id: z.id,
        name: z.name,
        confidentiality: generationForm.confidentiality,
        simAgentProfile: generationForm.simAgentProfile,
        autoSimFrequency: generationForm.autoSimFrequency,
        impactDomain: generationForm.impactDomain,
        epistemicIntent: generationForm.epistemicIntent,
        ethicalSensitivity: generationForm.ethicalSensitivity,
        createdBy: generationForm.createdBy,
        guardianId: generationForm.guardianId,
        guardianTrigger: {
          drift: generationForm.drift,
          entropy: generationForm.entropy,
          ethicalFlag: generationForm.ethicalFlag,
        },
        metadata: {
          ...DEFAULT_ZONE_SETTINGS.metadata,
          sharedWithDAO: generationForm.sharedWithDAO,
          confidentiality: generationForm.confidentiality,
        },
        ce2: {
          ...DEFAULT_ZONE_SETTINGS.ce2,
          intent: generationForm.epistemicIntent,
          sensitivity: generationForm.ethicalSensitivity,
          createdBy: generationForm.createdBy,
          guardianId: generationForm.guardianId,
          guardianTrigger: {
            drift: generationForm.drift,
            entropy: generationForm.entropy,
            ethicalFlag: generationForm.ethicalFlag,
          },
        }
      };
      z.children?.forEach(generateSettings);
    };
    
    generateSettings(processedTree);
    setState(prev => ({ ...prev, settings: initialSettings }));
    
    // Record in history
    const historyItem: ZoneHistoryItem = {
      id: `gen-${Date.now()}`,
      zoneId: processedTree.id,
      action: 'created',
      timestamp: new Date(),
      user: 'system',
      changes: [
        { field: 'recursionLevel', oldValue: null, newValue: generationForm.recursionLevel },
        { field: 'zoneCount', oldValue: null, newValue: countZones(processedTree) }
      ]
    };
    setState(prev => ({ ...prev, history: [historyItem, ...prev.history] }));
    
    // Success alert
    const alert: ZoneEvent = {
      id: `gen-success-${Date.now()}`,
      zoneId: processedTree.id,
      zoneName: processedTree.name,
      type: 'success',
      message: `Successfully generated zone tree with ${countZones(processedTree)} zones`,
      timestamp: new Date(),
      source: 'system'
    };
    ZoneAlertSystem.getInstance().trigger(alert);
  }, [tree, generationForm]);

  // Helper functions
  const countZones = (zone: ZoneType): number => {
    return 1 + (zone.children?.reduce((sum, child) => sum + countZones(child), 0) || 0);
  };

  const handleUpdateSettings = (zoneId: string, updatedSettings: ZoneSettings) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [zoneId]: updatedSettings
      }
    }));
    
    // Record in history
    const zone = findZone(state.zones, zoneId);
    if (zone) {
      const historyItem: ZoneHistoryItem = {
        id: `update-${Date.now()}`,
        zoneId,
        action: 'settings_changed',
        timestamp: new Date(),
        user: 'user',
        changes: Object.entries(updatedSettings)
          .filter(([key]) => key !== 'id' && key !== 'name')
          .map(([field, newValue]) => ({
            field,
            oldValue: state.settings[zoneId]?.[field as keyof ZoneSettings],
            newValue
          }))
      };
      setState(prev => ({ ...prev, history: [historyItem, ...prev.history] }));
    }
  };

  const findZone = (zones: ZoneType[], id: string): ZoneType | undefined => {
    for (const zone of zones) {
      if (zone.id === id) return zone;
      if (zone.children) {
        const found = findZone(zone.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Event handlers
  const handleAlert = useCallback((event: ZoneEvent) => {
    setAlertState(prev => ({
      ...prev,
      alerts: [event, ...prev.alerts].slice(0, 100),
      unreadCount: prev.showAlertsPanel ? 0 : prev.unreadCount + 1
    }));
  }, []);

  const handleDismissAlert = useCallback((id: string) => {
    ZoneAlertSystem.getInstance().resolveAlert(id);
    setAlertState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(a => a.id !== id)
    }));
  }, []);

  const handleAcknowledgeAlert = useCallback((id: string) => {
    ZoneAlertSystem.getInstance().acknowledgeAlert(id);
    setAlertState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    }));
  }, []);

  const handleClearAlerts = useCallback(() => {
    ZoneAlertSystem.getInstance().clearAlerts();
    setAlertState(prev => ({
      ...prev,
      alerts: []
    }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<AlertState['filters']>) => {
    setAlertState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters
      }
    }));
  }, []);

  const handleSelectZone = useCallback((zoneId: string) => {
    setState(prev => ({ ...prev, selectedZone: zoneId }));
  }, []);

  // Render
  if (!router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!archetypeId || !archetypeName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <FiAlertCircle className="mx-auto text-red-500" size={48} />
          <h2 className="text-xl font-bold mt-4 text-gray-800">Missing Parameters</h2>
          <p className="mt-2 text-gray-600">
            The dashboard requires both archetypeId and archetypeName to be specified in the URL.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert notification bell */}
      <div className="fixed top-4 right-4 z-50">
        <AlertNotificationBell
          unreadCount={alertState.unreadCount}
          onClick={() => setAlertState(prev => ({
            ...prev,
            showAlertsPanel: !prev.showAlertsPanel,
            unreadCount: 0
          }))}
        />
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            CE² Zone Dashboard
            {archetypeName && (
              <span className="text-xl font-normal text-gray-600 ml-2">
                for {archetypeName}
              </span>
            )}
          </h1>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FiClock className="mr-1" />
            Last updated: {new Date().toLocaleString()}
            <span className="mx-2">•</span>
            <FiActivity className="mr-1" />
            {state.zones.length > 0 ? `${countZones(state.zones[0])} zones` : 'No zones loaded'}
          </div>
        </header>

        {/* Alert center panel */}
        {alertState.showAlertsPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end items-start pt-16 pr-4">
            <AlertCenterPanel
              alerts={alertState.alerts}
              onDismiss={handleDismissAlert}
              onAcknowledge={handleAcknowledgeAlert}
              onClearAll={handleClearAlerts}
              filters={alertState.filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Controls and filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Generation form */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-3 flex items-center">
                <FiSettings className="mr-2" /> Zone Generator
              </h2>
              {/* Form implementation */}
              {/* ... */}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-3 flex items-center">
                <FiFilter className="mr-2" /> Filters
              </h2>
              {/* Filter controls implementation */}
              {/* ... */}
            </div>

            {/* History */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-3 flex items-center">
                <FiClock className="mr-2" /> Recent Activity
              </h2>
              {/* History list implementation */}
              {/* ... */}
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Zone tree/list view */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg flex items-center">
                  <FiTrendingUp className="mr-2" />
                  {state.viewMode === 'tree' ? 'Zone Hierarchy' : 'Zone List'}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setState(prev => ({ ...prev, viewMode: 'tree' }))}
                    className={`p-2 rounded ${state.viewMode === 'tree' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Tree View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))}
                    className={`p-2 rounded ${state.viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, viewMode: 'grid' }))}
                    className={`p-2 rounded ${state.viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Zone display */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Generating zone structure...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <FiAlertCircle className="mx-auto mb-2" size={24} />
                  <p>Error loading zones: {error}</p>
                </div>
              ) : state.zones.length > 0 ? (
                <div className="space-y-3">
                  {state.zones.map(zone => (
                    <ZoneNode
                      key={zone.id}
                      zone={zone}
                      settings={state.settings}
                      onUpdate={handleUpdateSettings}
                      onAlert={handleAlert}
                      onSelect={handleSelectZone}
                      selected={state.selectedZone === zone.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiInfo className="mx-auto mb-2" size={24} />
                  <p>No zones generated yet. Configure and generate your first zone.</p>
                </div>
              )}
            </div>

            {/* Selected zone details */}
            {state.selectedZone && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold text-lg mb-3">Zone Details</h2>
                {/* Detailed zone view implementation */}
                {/* ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for styles
const getZoneBackground = (zone: ZoneType, settings: ZoneSettings): string => {
  if (settings.ethicalSensitivity === 'Extreme') return 'bg-red-50';
  if (settings.ethicalSensitivity === 'High') return 'bg-orange-50';
  if (settings.ethicalSensitivity === 'Medium') return 'bg-yellow-50';
  if (zone.status === 'archived') return 'bg-gray-100';
  if (zone.status === 'draft') return 'bg-blue-50';
  return 'bg-white';
};

const getSensitivityColor = (sensitivity: string): string => {
  switch (sensitivity) {
    case 'Extreme': return 'bg-red-500';
    case 'High': return 'bg-orange-500';
    case 'Medium': return 'bg-yellow-500';
    default: return 'bg-green-500';
  }
};

const getSensitivityBadge = (sensitivity: string): string => {
  switch (sensitivity) {
    case 'Extreme': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-green-100 text-green-800';
  }
};

export default ZoneDashboardPage;
