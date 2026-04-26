import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, UserProfile } from "../types/authTypes";
import { API } from "../services/api";


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  //----------------------------------
  // use states
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
  //Storage sync
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
  //USER METHODS
  const fetchProfile = async () => {
    if (!jwtToken) return null;
    try {
      const data = await API.user.getMe(jwtToken);
      setProfile(data); // Sync DB data to local state
      return data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  };
  
  //----------------------------------
  //PROFILE METHODS
  const updateProfile = async (updates: Partial<UserProfile>) => {
    //1. client side sync
    setProfile((prev) => {
      // If we have a profile, update it. If not, create a base object with the updates!
      if (!prev) {
        return { ...updates } as UserProfile;
      }
      return { ...prev, ...updates };
    });
    
    //try syncing with cloud
    if(jwtToken)
    try {
      // Assuming your api.ts method is API.user.updateMe
      await API.user.updateMe(jwtToken, updates);
      console.log("Successfully saved to database");
    } catch (error) {
      console.error("Failed to sync with database:", error);
      // Optional: Add a toast notification here to tell the user "Changes may not be saved"
    }
    console.error("it all works")
  };
  
    
  // 4. Lobby Methods (Auto-injects jwtToken)
  const getLobbies = async () => {
    if (!jwtToken) throw new Error("Not authenticated");
    return await API.lobbies.list(jwtToken);
  };

  const joinLobby = async (lobbyId: string) => {
    if (!jwtToken) throw new Error("Not authenticated");
    return await API.lobbies.join(jwtToken, lobbyId);
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
        fetchProfile,
        updateProfile,
        logout,
        getLobbies,
        joinLobby,
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
