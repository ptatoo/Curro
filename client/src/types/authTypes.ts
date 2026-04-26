export interface UserProfile {
  uid: number;
  email: string;
  name: string;

  //ranges
  minDistance: number; // Double
  maxDistance: number; // Double

  //ranges
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
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}