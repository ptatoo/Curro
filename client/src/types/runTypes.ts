export type RunStatus = 'open' | 'active' | 'completed';

export interface RunGroup {
  id: number;
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
  removeRun: (runId: number) => void;
  updateRunStatus: (runId: number, status: RunStatus) => void;
  addRoute: (runRoute: RunRoute) => void;
}

export interface RunRoute {
  id: number;
  name: string;
  route: string;
  distance: number;
}