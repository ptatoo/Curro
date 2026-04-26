import type { Dispatch } from "react";
import type { SetStateAction } from "react";

export type RunStatus = 'open' | 'active' | 'completed';

export interface RunGroup {
  id: number;
  creatorId: number;
  routeId: number;
  startTime: Date;
  targetPace: number;
  maxPlayers: number;
  playerIds: number[];
  isPrivate: boolean;
  status: RunStatus;
}

export interface RunContextType {
  publicRuns: RunGroup[];
  privateRuns: RunGroup[];
  myPublicRuns: RunGroup[];
  myPrivateRuns: RunGroup[];
  runRoutes: RunRoute[];
  setPublicRuns: Dispatch<SetStateAction<RunGroup[]>>
  setPrivateRuns: Dispatch<SetStateAction<RunGroup[]>>
  addRun: (run: RunGroup) => void;
  removeRun: (runId: number) => void;
  updateRunStatus: (runId: number, status: RunStatus) => void;
  addRoute: (runRoute: RunRoute) => void;
}

export interface Coord {
  lat: number,
  lng: number,
}

export interface RunRoute {
  id: number;
  name: string;
  route: Coord[];
  distance: number; //miles
}