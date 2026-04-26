import { useGoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';
import { fetchAccessToken } from '../services/api';

export const useAuth = () => {
  const { setJwtToken } = useUser();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Send google's oauth code to backend for accessToken
        const token = await fetchAccessToken(codeResponse.code);
        
        // 3. Store in Global Context
        setJwtToken(token);
      } catch (err) {
        console.error("Auth Flow Error:", err);
      }
    },
    flow: 'auth-code', // This ensures we get a 'code', not a token
  });

  return { login };
};