import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { RunProvider } from "./context/RunContext";
import { UnitProvider } from "./context/UnitContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { APIProvider } from "@vis.gl/react-google-maps";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CreateLobby from "./pages/CreateLobby";
import { ProtectedRoute } from "./components/layouts/protectedRoutes";

// --------------
// Provider Wrapper
const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_PUBLIC_CLIENT_ID}>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <UserProvider>
        <RunProvider>
          <UnitProvider>
            {children}
          </UnitProvider>
        </RunProvider>
      </UserProvider>
    </APIProvider>
  </GoogleOAuthProvider>
);

// --------------
// the actual app
function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Navbar />
        <main style={{ padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
             <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lobbies" element={<Lobbies />} />
              <Route path="/lobby/new" element={<CreateLobby />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
  </AppProviders>
  );
}

export default App;
