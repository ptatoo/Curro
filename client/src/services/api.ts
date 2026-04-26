// For Vite (React Web on port 5173), use import.meta.env

import type { UserProfile } from "../types/authTypes";

// For Create React App, use process.env.REACT_APP_BACKEND_URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const apiFetch = async (path: string, { method = 'GET', token, body }: { method?: string; token?: string; body?: any } = {}) => {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || res.statusText);
  }
  
  return res.json();
};

export const API = {
  auth: {
    exchangeGoogleCode: async (code: string): Promise<string> => {
      const data = await apiFetch('/api/auth/google', { method: 'POST', body: { code } });
      return data.sessionToken;
    },
    
    getGoogleProfile: (googleAccessToken: string) => 
      apiFetch('https://www.googleapis.com/oauth2/v3/userinfo', { token: googleAccessToken }),
  },
  
  user: {
    getMe: (token: string) => 
      apiFetch('/api/users/me', { token }),
    
    updateMe: (token: string, data: UserProfile) => 
      apiFetch('/api/users/me', { method: 'PUT', token, body: data }),
  },
  
  lobbies: {
    list: (token: string) => 
      apiFetch('/api/lobbies', { token }),
      
    join: (token: string, lobbyId: string) => 
      apiFetch(`/api/lobbies/${lobbyId}/join`, { method: 'POST', token }),
  }
};