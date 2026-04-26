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
  // Functions to update the state
  setJwtToken: (token: string) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}