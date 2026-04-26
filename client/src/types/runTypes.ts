  import type { Dispatch } from "react";
  import type { SetStateAction } from "react";

  export type RunStatus = 'open' | 'active' | 'completed';

  export interface Lobby {
    id: number; // Changed to string for SQLite TEXT
    creatorId: number
    routeId: number;
    startTime: Date; // Dates often arrive as ISO strings from JSON
    targetPace: number;
    maxPlayers: number;
    playerIds: number[];
    isPrivate: boolean;
    status: RunStatus;
    // Added from your getPublic() JOIN
    route_name?: string;
    distance?: number;
    current_players?: number;
}

  export interface LobbyContextType {
    publicRuns: Lobby[];
    privateLobbiess: Lobby[];
    myPublicLobbies: Lobby[];
    myPrivateLobbiess: Lobby[];
    runRoutes: RunRoute[];
    setPublicLobbies: Dispatch<SetStateAction<Lobby[]>>
    setPrivateLobbiess: Dispatch<SetStateAction<Lobby[]>>
    addLobby: (run: Lobby) => void;
    removeLobby: (runId: number) => void;
    updateLobbyStatus: (runId: number, status: RunStatus) => void;
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