import type { Dispatch } from "react";
import type { SetStateAction } from "react";

export interface UserProfile {
  uid: number;
  email: string;
  name: string;

  //ranges
  minDistance: number;
  maxDistance: number;

  //ranges
  minPace: number;
  maxPace: number;

  friends: string[];
  location: string | null;
}

export interface UserContextType {
  jwtToken: string | null;
  profile: UserProfile | null;
  
  // State Setters
  setJwtToken: (token: string | null) => void;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  
  // Async API Actions
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  
  // Lobby Actions
  getLobbies: () => Promise<any>; 
  joinLobby: (lobbyId: string) => Promise<any>;
}