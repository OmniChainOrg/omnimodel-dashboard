// types/Zone.ts
export type Zone = {
  id: string;               // Unique identifier for the zone
  name: string;             // Display name
  path: string;             // URL path or route
  depth?: number;           // Optional: zone depth in hierarchy
  approved?: boolean;       // Optional: approval status
  archetype?: string;       // Optional: base type of the zone
  parentId?: string | null; // Optional: parent zone ID for nesting
  metadata?: {
    sharedWithDAO: boolean;
    confidentiality: 'Public' | 'Confidential' | 'Private';
    userNotes: string;
  };
  children?: Zone[];        // Optional: child zones
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
};
