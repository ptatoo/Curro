const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
// ------------------------------
// 1. boilerplate
const apiFetch = async (
  path: string, 
  { method = 'GET', token, body }: { method?: string; token?: string; body?: unknown } = {}
) => {
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

//2 actua functions, use by function(params, params2, ...)
export const API = {
  auth: {
    exchangeGoogleCode: async (code: string): Promise<string> => {
      const data = await apiFetch('/api/auth/google', { method: 'POST', body: { code } });
      return data.sessionToken;
    }
  },
  
  user: {
    getMe: (token: string) => 
      apiFetch('/api/users/me', { token }),
    
    // 2. Changed data: any to data: Record<string, unknown> 
    // (represents a generic object, standard for JSON payloads)
    updateMe: (token: string, data: Record<string, unknown>) => 
      apiFetch('/api/users/me', { method: 'PUT', token, body: data }),
  },
  
  lobbies: {
    list: (token: string) => 
      apiFetch('/api/lobbies', { token }),
      
    join: (token: string, lobbyId: string) => 
      apiFetch(`/api/lobbies/${lobbyId}/join`, { method: 'POST', token }),
  }
};