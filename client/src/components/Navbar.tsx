import { NavLink } from "react-router-dom";

const Navbar = () => {
  // We use a function for the style to dynamically change based on 'isActive'
  const navLinkStyle = ({
    isActive,
  }: {
    isActive: boolean;
  }): React.CSSProperties => ({
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.2s ease",
    // In 2026, Vite projects usually prefer dark/light modes
    background: isActive ? "#646cff" : "transparent",
    color: isActive ? "white" : "#555",
    border: isActive ? "1px solid #646cff" : "1px solid #ddd",
  });

  return (
    <nav style={containerStyle}>
      <div style={logoStyle}>MyRunApp</div>

      <div style={linksContainer}>
        <NavLink to="/" style={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/login" style={navLinkStyle}>
          Login
        </NavLink>
        {/* <NavLink to="/lobbies" style={navLinkStyle}>
          Lobbies
        </NavLink>
        <NavLink to="/settings" style={navLinkStyle}>
          Settings
        </NavLink>
        <NavLink to="/newUser" style={navLinkStyle}>
          newUsers
        </NavLink> */}
        {/* If you wanted an About route, you'd add it here too */}
      </div>
    </nav>
  );
};

// Simple Flexbox Styles
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 5%",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#646cff",
};

const linksContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

export default Navbar;
