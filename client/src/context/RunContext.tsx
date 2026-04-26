import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { RunGroup, RunContextType, RunStatus } from "../types/runTypes.ts";
import type { RunRoute } from "../types/runTypes.ts";

const RunContext = createContext<RunContextType | undefined>(undefined);

export const RunProvider = ({ children }: { children: ReactNode }) => {
  const [publicRuns, setPublicRuns] = useState<RunGroup[]>([]);
  const [privateRuns, setPrivateRuns] = useState<RunGroup[]>([]);
  const [routes, setRoutes] = useState<RunRoute[]>([]);

  const addRun = (run: RunGroup) => {
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
    const updater = (runs: RunGroup[]) =>
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