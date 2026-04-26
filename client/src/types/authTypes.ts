export interface UserProfile {
  uid: number;
  email: string;
  name: string;
  minDistance: number; // Double
  maxDistance: number; // Double
  minPace: number; // Double
  maxPace: number; // Double
  friends: string[];
  location: string | null;
}

export interface UserContextType {
  jwtToken: string | null;
  profile: UserProfile | null;
  // Functions to update the state
  setJwtToken: (token: string) => void;
  setProfile: (profile: UserProfile) => void;
  updateUserDistance: (minDistance: number, maxDistance: number) => void;
  updateUserPace: (minPace: number, maxPace: number) => void;
  updateUserLocation: (location: string) => void;
  updateRunStats: (distance: number, pace: number) => void;
  logout: () => void;
}