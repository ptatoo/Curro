import { createContext, useContext, useState } from "react";

export type Unit = "km" | "mi";

type UnitContextType = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  formatDistance: (km: number) => string;
  formatPace: (pacePerKm: string) => string;
  distanceLabel: string;
  paceLabel: string;
};

const UnitContext = createContext<UnitContextType | null>(null);

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>("km");

  const formatDistance = (km: number): string => {
    if (unit === "mi") return (km * 0.621371).toFixed(1);
    return km.toFixed(1);
  };

  // pacePerKm is a "M:SS" string representing min/km
  const formatPace = (pacePerKm: string): string => {
    if (unit === "km") return pacePerKm;
    const [mins, secs] = pacePerKm.split(":").map(Number);
    const totalSecs = (mins * 60 + secs) * 0.621371;
    const newMins = Math.floor(totalSecs / 60);
    const newSecs = Math.round(totalSecs % 60);
    return `${newMins}:${String(newSecs).padStart(2, "0")}`;
  };

  const distanceLabel = unit === "km" ? "km" : "mi";
  const paceLabel = unit === "km" ? "km" : "mi";

  return (
    <UnitContext.Provider value={{ unit, setUnit, formatDistance, formatPace, distanceLabel, paceLabel }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used within a UnitProvider");
  return ctx;
}