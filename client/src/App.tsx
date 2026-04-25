import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

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
    <UserProvider>
      <BrowserRouter>
        <Navbar />

        <main className="p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login onLogin={() => {}} />} />
            <Route path="/lobbies" element={<Lobbies />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/newUser" element={<NewUser />} />

            <Route path="*" element={<div className="p-10"><h2>404 - Not Found</h2></div>} />
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;