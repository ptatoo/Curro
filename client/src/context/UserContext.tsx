import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserContextType, UserProfile } from "../types/auth";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [location, setLocation] = useState<string>("Unknown");
  const [runDistance, setRunDistance] = useState<number>(0.0);
  const [runPace, setRunPace] = useState<number>(0.0);

  const setAuth = (token: string, userProfile: UserProfile) => {
    setJwtToken(token);
    setProfile(userProfile);
  };

  const updateRunStats = (distance: number, pace: number) => {
    setRunDistance(distance);
    setRunPace(pace);
  };

  const logout = () => {
    setJwtToken(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider
      value={{
        jwtToken,
        profile,
        location,
        runDistance,
        runPace,
        setAuth,
        updateRunStats,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
