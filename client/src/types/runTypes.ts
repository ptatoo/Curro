export type RunStatus = 'open' | 'active' | 'completed';

export interface RunGroup {
  id: number; // Added an ID for React list keys
  creatorId: string;
  routeId: number;
  startTime: Date;
  targetPace: number;
  maxPlayers: number;
  numPlayers: number;
  isPrivate: boolean;
  status: RunStatus;
}

export interface RunContextType {
  publicRuns: RunGroup[];
  privateRuns: RunGroup[];
  runRoutes: RunRoute[];
  setPublicRuns: (runs: RunGroup[]) => void;
  setPrivateRuns: (runs: RunGroup[]) => void;
  addRun: (run: RunGroup) => void;
  updateRunStatus: (runId: number, status: RunStatus) => void;
  addRoute: (runRoute: RunRoute) => void;
}

export interface RunRoute {
  id: number,
  name: string;
  route: string;
  distance: number; //miles
}