import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

const Navbar = () => {
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
    background: isActive ? "#6b4226" : "transparent",
    color: isActive ? "#f5f0e8" : "#7a6652",
    border: isActive ? "1px solid #6b4226" : "1px solid #c9b99a",
  });

  return (
    <nav style={containerStyle}>
      <div style={logoStyle}>MyRunApp</div>

      <div style={linksContainer}>
        <NavLink to="/" style={navLinkStyle}>
          Home
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "8px",
            textDecoration: "none",
            transition: "all 0.2s ease",
            background: isActive ? "#6b4226" : "transparent",
            color: isActive ? "#f5f0e8" : "#7a6652",
            border: isActive ? "1px solid #6b4226" : "1px solid #c9b99a",
          })}
        >
          <Settings size={26} />
        </NavLink>
      </div>
    </nav>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 5%",
backgroundColor: "#ddd4c4",
boxShadow: "0 2px 12px rgba(107,66,38,0.15)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#6b4226",
};

const linksContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

export default Navbar;