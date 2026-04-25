export interface UserProfile {
  email: string;
  name: string;
}

export interface UserContextType {
  jwtToken: string | null;
  profile: UserProfile | null;
  location: string; // Address
  runDistance: number; // Double
  runPace: number; // Double
  // Functions to update the state
  setAuth: (token: string, profile: UserProfile) => void;
  updateRunStats: (distance: number, pace: number) => void;
  logout: () => void;
}