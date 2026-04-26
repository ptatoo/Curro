import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { RunGroup, RunContextType, RunStatus } from "../types/runTypes.ts";

const RunContext = createContext<RunContextType | undefined>(undefined);

export const RunProvider = ({ children }: { children: ReactNode }) => {
  const [publicRuns, setPublicRuns] = useState<RunGroup[]>([]);
  const [privateRuns, setPrivateRuns] = useState<RunGroup[]>([]);

  // Helper: Adds a run to the correct list based on its privacy setting
  const addRun = (run: RunGroup) => {
    if (run.isPrivate) {
      setPrivateRuns((prev) => [...prev, run]);
    } else {
      setPublicRuns((prev) => [...prev, run]);
    }
  };

  // Helper: Find a run by ID and update its status
  const updateRunStatus = (runId: string, status: RunStatus) => {
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
        setPublicRuns,
        setPrivateRuns,
        addRun,
        updateRunStatus,
      }}
    >
      {children}
    </RunContext.Provider>
  );
};

// Custom hook for the standard "use" pattern
export const useRuns = () => {
  const context = useContext(RunContext);
  if (!context) throw new Error("useRuns must be used within a RunProvider");
  return context;
};
