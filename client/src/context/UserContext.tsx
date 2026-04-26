import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { UserContextType, UserProfile } from "../types/authTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<string>("Unknown");

  //Jwt Token Storage
  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    return localStorage.getItem("app_jwt_token");
  });

  useMemo(() => {
    if (jwtToken) {
      localStorage.setItem("app_jwt_token", jwtToken);
    } else {
      localStorage.removeItem("app_jwt_token");
    }
  }, [jwtToken]);

  //Profile Storage
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const storage = localStorage.getItem("app_profile");
    if (storage) {
      return JSON.parse(storage) as UserProfile;
    }
    return null;
  });

  // setProfile({
  //   uid: 12346789,
  //   email: "i.alexander.song@gmail.com",
  //   name: "Alex",
  //   minDistance: 0, // Double
  //   maxDistance: 0, // Double
  //   minPace: 0, // Double
  //   maxPace: 0, // Double
  //   friends: [],
  //   location: null,
  // } as UserProfile);

  useMemo(() => {
    if (profile) {
      localStorage.setItem("app_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("app_profile");
    }
  }, [profile]);

  //update user Profile
  const updateUserDistance = (minDistance: number, maxDistance: number) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;

      return {
        ...prevProfile,
        minDistance, // Shorthand for minDistance: minDistance
        maxDistance,
      };
    });
  };

  const updateUserPace = (minPace: number, maxPace: number) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;

      return {
        ...prevProfile,
        minPace,
        maxPace,
      };
    });
  };

  const updateUserLocation = (location: string) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;

      return {
        ...prevProfile,
        location,
      };
    });
  };

  const updateRunStats = (distance: number, pace: number) => {};

  const logout = () => {
    setJwtToken(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider
      value={{
        jwtToken,
        profile,
        setJwtToken,
        setProfile,
        updateUserDistance,
        updateUserPace,
        updateUserLocation,
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
