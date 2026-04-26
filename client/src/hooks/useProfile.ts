import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { API } from '../services/api';
import type { UserProfile } from '../types/authTypes';

export const useProfile = () => {
  const { jwtToken, profile, setProfile } = useUser();

  useEffect(() => {
    const getProfile = async () => {
      // Don't fetch if no token OR if we already have the profile data
      if (!jwtToken || profile) return;

      try {
        const data = await API.user.getMe(jwtToken);
        
        // Map the API response to your UserProfile type
        const userProfile: UserProfile = {
          uid: data.uid,
          email: data.email,
          name: data.name,
          // Ensure we use the data from DB, or fallback to defaults
          minDistance: data.minDistance ?? 0,
          maxDistance: data.maxDistance ?? 0,
          minPace: data.minPace ?? 0,
          maxPace: data.maxPace ?? 0,
          friends: data.friends ?? [],
          location: data.location ?? null,
        };

        setProfile(userProfile);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        // Optional: handle unauthorized error by clearing token
      }
    };

    getProfile();
  }, [jwtToken, profile, setProfile]); 
};