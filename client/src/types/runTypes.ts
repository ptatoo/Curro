export type RunStatus = 'open' | 'active' | 'completed';

export interface RunGroup {
  id: string; // Added an ID for React list keys
  creatorId: string;
  routeId: string;
  targetPace: number;
  maxPlayers: number;
  isPrivate: boolean;
  status: RunStatus;
}

export interface RunContextType {
  publicRuns: RunGroup[];
  privateRuns: RunGroup[];
  setPublicRuns: (runs: RunGroup[]) => void;
  setPrivateRuns: (runs: RunGroup[]) => void;
  addRun: (run: RunGroup) => void;
  updateRunStatus: (runId: string, status: RunStatus) => void;
}