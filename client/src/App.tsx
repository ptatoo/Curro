import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { RunProvider } from "./context/RunContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Components
import Navbar from "./components/Navbar";

// Pages - Removed curly braces for default exports
import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import Settings from "./pages/Settings";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_PUBLIC_CLIENT_ID}>
      <UserProvider>
        <RunProvider>
          <BrowserRouter>
            {/* Navbar stays visible on all pages */}
            <Navbar />

            <main style={{ padding: "20px" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/lobbies" element={<Lobbies />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/newUser" element={<NewUser />} />

                {/* 404 Page */}
                <Route path="*" element={<h2>404 - Not Found</h2>} />
              </Routes>
            </main>
          </BrowserRouter>
        </RunProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
