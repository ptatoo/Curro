import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Lobby, LobbyContextType, RunStatus } from "../types/runTypes.ts";
import type { RunRoute } from "../types/runTypes.ts";
import { useUser } from "./UserContext.tsx";
import type { UserProfile } from "../types/authTypes.ts";

const RunContext = createContext<LobbyContextType | undefined>(undefined);

export const RunProvider = ({ children }: { children: ReactNode }) => {
  const [publicRuns, setPublicRuns] = useState<Lobby[]>([]);
  const [privateRuns, setPrivateRuns] = useState<Lobby[]>([]);
  const [myPublicRuns, setMyPublicRuns] = useState<Lobby[]>([]);
  const [myPrivateRuns, setMyPrivateRuns] = useState<Lobby[]>([]);
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
    const userPrivate = privateRuns.filter((run) =>
      run.playerIds.includes(profile.uid),
    );

    // 4. Update the "My Runs" states
    setMyPublicRuns(userPublic);
    setMyPrivateRuns(userPrivate);
  }, [publicRuns, privateRuns, profile?.uid]);

  const addRun = (run: Lobby) => {
    if (run.isPrivate) {
      setPrivateRuns((prev) => {
        const exists = prev.some((r) => r.id === run.id);
        if (exists) return prev;
        return [...prev, run];
      });
    } else {
      setPublicRuns((prev) => {
        const exists = prev.some((r) => r.id === run.id);
        if (exists) return prev;
        return [...prev, run];
      });
    }
  };

  const removeRun = (runId: number) => {
    setPublicRuns((prev) => prev.filter((r) => r.id !== runId));
    setPrivateRuns((prev) => prev.filter((r) => r.id !== runId));
  };

  const addRoute = (runRoute: RunRoute) => {
    setRoutes((prev) => {
      const exists = prev.some((r) => r.id === runRoute.id);
      if (exists) return prev;
      return [...prev, runRoute];
    });
  };

  const updateRunStatus = (runId: number, status: RunStatus) => {
    const updater = (runs: Lobby[]) =>
      runs.map((r) => (r.id === runId ? { ...r, status } : r));
    setPublicRuns(updater);
    setPrivateRuns(updater);
  };

  return (
    <RunContext.Provider
      value={{
        publicRuns,
        privateRuns,
        runRoutes: routes,
        myPublicRuns,
        myPrivateRuns,
        setPublicRuns,
        setPrivateRuns,
        addRun,
        removeRun,
        updateRunStatus,
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