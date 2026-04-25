import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { fetchGoogleProfile } from '../services/api';

//TODO: FIX
export const useProfile = () => {
  const { jwtToken, setProfile } = useUser();

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) return;

      try {
        // In a real app, your backend would provide the Google Access Token
        // or your backend would fetch the profile for you. 
        // Here, we assume the 'jwtToken' contains or allows access to the profile.
        const data = await fetchGoogleProfile(jwtToken);
        
        setProfile({
          uid: data.sub,
          email: data.email,
          name: data.name,
          minDistance: 0,
          maxDistance: 0,
          minPace: 0,
          maxPace: 0,
          friends: [],
          location: null,
          
        });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      }
    };

    getProfile();
  }, [jwtToken, setProfile]); // Only runs when jwtToken is updated
};