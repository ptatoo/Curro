import { createContext, useContext, useState } from "react";

type Settings = {
  location: string;
  distanceGoal: string;
  paceGoal: string;
  runsPerWeek: string;
};

type Unit = "km" | "mi";

type SettingsContextType = {
  settings: Settings;
  setSettings: (s: Settings) => void;
  unit: Unit;
  toggleUnit: () => void;
};

export function kmToMi(km: number) {
  return (km * 0.621371).toFixed(1);
}

export function miToKm(mi: number) {
  return (mi / 0.621371).toFixed(1);
}

export function paceKmToMi(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) * 0.621371;
  const newMins = Math.floor(totalSecs / 60);
  const newSecs = Math.round(totalSecs % 60);
  return `${newMins}:${String(newSecs).padStart(2, "0")}`;
}

export function paceMiToKm(pace: string) {
  const [mins, secs] = pace.split(":").map(Number);
  const totalSecs = (mins * 60 + secs) / 0.621371;
  const newMins = Math.floor(totalSecs / 60);
  const newSecs = Math.round(totalSecs % 60);
  return `${newMins}:${String(newSecs).padStart(2, "0")}`;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>("km");
  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    distanceGoal: "25",
    paceGoal: "5:30",
    runsPerWeek: "3",
  });

  const toggleUnit = () => {
    if (unit === "km") {
      setUnit("mi");
      setSettings((s) => ({
        ...s,
        distanceGoal: kmToMi(parseFloat(s.distanceGoal)),
        paceGoal: paceKmToMi(s.paceGoal),
      }));
    } else {
      setUnit("km");
      setSettings((s) => ({
        ...s,
        distanceGoal: miToKm(parseFloat(s.distanceGoal)),
        paceGoal: paceMiToKm(s.paceGoal),
      }));
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, unit, toggleUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}