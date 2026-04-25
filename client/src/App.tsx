import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Lobbies from "./pages/Lobbies";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays visible on all pages */}
      <Navbar />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/lobbies" element={<Lobbies />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/newUser" element={<NewUser />} />

          {/* 404 Page */}
          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
