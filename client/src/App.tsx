import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { RunProvider } from "./context/RunContext";
import { UnitProvider } from "./context/UnitContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import Settings from "./pages/Settings";
import CreateLobby from "./pages/CreateLobby";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_PUBLIC_CLIENT_ID}>
      <UserProvider>
        <RunProvider>
          <UnitProvider>
            <BrowserRouter>
              <Navbar />
              <main style={{ padding: "20px" }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/lobbies" element={<Lobbies />} />
                  <Route path="/lobby/new" element={<CreateLobby />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/newUser" element={<NewUser />} />
                  <Route path="*" element={<h2>404 - Not Found</h2>} />
                </Routes>
              </main>
            </BrowserRouter>
          </UnitProvider>
        </RunProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;