import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Lobby, LobbyContextType, RunStatus } from "../types/runTypes.ts";
import type { RunRoute } from "../types/runTypes.ts";
import { useUser } from "./UserContext.tsx";
import type { UserProfile } from "../types/authTypes.ts";

const RunContext = createContext<LobbyContextType | undefined>(undefined);

export const RunProvider = ({ children }: { children: ReactNode }) => {
  const [publicRuns, setPublicLobbies] = useState<Lobby[]>([]);
  const [privateLobbiess, setPrivateLobbiess] = useState<Lobby[]>([]);
  const [myPublicLobbies, setMyPublicLobbies] = useState<Lobby[]>([]);
  const [myPrivateLobbiess, setMyPrivateLobbiess] = useState<Lobby[]>([]);
  const [routes, setRoutes] = useState<RunRoute[]>([]);
  const { profile } = useUser();

  useEffect(() => {
    // 1. Safety check: Ensure profile and UID exist before filtering
    if (!profile?.uid) return;

    // 2. Filter Public Runs
    const userPublic = publicRuns.filter((run) =>
      run.playerIds.includes(profile.uid),
    );

    // 3. Filter Private Runs
    const userPrivate = privateLobbiess.filter((run) =>
      run.playerIds.includes(profile.uid),
    );

    // 4. Update the "My Runs" states
    setMyPublicLobbies(userPublic);
    setMyPrivateLobbiess(userPrivate);
  }, [publicRuns, privateLobbiess, profile?.uid]);

  const addLobby = (run: Lobby) => {
    if (run.isPrivate) {
      setPrivateLobbiess((prev) => {
        const exists = prev.some((r) => r.id === run.id);
        if (exists) return prev;
        return [...prev, run];
      });
    } else {
      setPublicLobbies((prev) => {
        const exists = prev.some((r) => r.id === run.id);
        if (exists) return prev;
        return [...prev, run];
      });
    }
  };

  const removeLobby = (runId: number) => {
    setPublicLobbies((prev) => prev.filter((r) => r.id !== runId));
    setPrivateLobbiess((prev) => prev.filter((r) => r.id !== runId));
  };

  const addRoute = (runRoute: RunRoute) => {
    setRoutes((prev) => {
      const exists = prev.some((r) => r.id === runRoute.id);
      if (exists) return prev;
      return [...prev, runRoute];
    });
  };

  const updateLobbyStatus = (runId: number, status: RunStatus) => {
    const updater = (runs: Lobby[]) =>
      runs.map((r) => (r.id === runId ? { ...r, status } : r));
    setPublicLobbies(updater);
    setPrivateLobbiess(updater);
  };

  return (
    <RunContext.Provider
      value={{
        publicRuns,
        privateLobbiess,
        runRoutes: routes,
        myPublicLobbies,
        myPrivateLobbiess,
        setPublicLobbies,
        setPrivateLobbiess,
        addLobby,
        removeLobby,
        updateLobbyStatus,
        addRoute,
      }}
    >
      {children}
    </RunContext.Provider>
  );
};

export const useRuns = () => {
  const context = useContext(RunContext);
  if (!context) throw new Error("useRuns must be used within a RunProvider");
  return context;
};