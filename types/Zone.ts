// types/Zone.ts
export type Zone = {
  id: string;               // Unique identifier for the zone
  name: string;             // Display name
  path: string;             // URL path or route
  depth?: number;           // Optional: zone depth in hierarchy
  approved?: boolean;       // Optional: approval status
  archetype?: string;       // Optional: base type of the zone
  parentId?: string | null; // Optional: parent zone ID for nesting
  metadata?: Record<string, any>; // Optional: flexible metadata for extensibility
  children?: Zone[];        // Optional: child zones
};
