// types/ConsensusEvent.ts
/**
 * Shared interface representing a consensus event returned from the API
 * and displayed in the OmniTwin Nexus panel.
 */
export interface ConsensusEvent {
  /** Unique numeric identifier */
  id: number;
  /** Zone that emitted the event */
  zone: string;
  /** Action performed */
  action: string;
  /** ISO timestamp string */
  timestamp: string;
  /** Arbitrary payload information */
  payload: Record<string, unknown>;
}
