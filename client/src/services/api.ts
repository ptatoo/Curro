const BACKEND_URL = "http://localhost:3000";

/* Google OAuth
Description: Sends Google Auth Code to Backend.
Param: Code
Return: JWT
 */
export const fetchJwtToken = async (code: string): Promise<string> => {
    //TODO: MAKE THIS WORK
  const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) throw new Error("Backend authentication failed");
  const data = await response.json();
  return data.jwtToken; // Your backend's generated JWT
};

/* Google Profile
Description: Fetches profile from Google using the Access Token.
Param: accessToken
Return: response.json();
 */
export const fetchGoogleProfile = async (googleAccessToken: string) => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${googleAccessToken}` },
  });
  if (!response.ok) throw new Error("Google Profile Fetch Failed");
  return response.json();
};