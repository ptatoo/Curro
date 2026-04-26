import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, UserProfile } from "../types/authTypes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  //----------------------------------
  //storage STUFF
  //JWT
  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    return localStorage.getItem("app_jwt_token");
  });

  //Profile
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const storage = localStorage.getItem("app_profile");
    if (storage) {
      return JSON.parse(storage) as UserProfile;
    }
    return null;
  });

  //----------------------------------
  //2. syncs actual state to local storge
  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem("app_jwt_token", jwtToken);
    } else {
      localStorage.removeItem("app_jwt_token");
    }
  }, [jwtToken]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem("app_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("app_profile");
    }
  }, [profile]);

  //CREATE A USER BY CRASHING PROGRAM
  // setProfile({
  //   uid: 2345,
  //   email: "i.alexander.song@gmail.com",
  //   name: "bob",
  //   minDistance: 3,
  //   maxDistance: 5,
  //   minPace: 9,
  //   maxPace: 15,
  //   friends: [],
  //   location: null,
  // } as UserProfile);

  //----------------------------------
  //3. update userProfile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  //----------------------------------
  //4. logging out
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
        updateProfile, // One function to rule them all
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
// LINE ABOVE FOR STUPID VITE WARNING
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
