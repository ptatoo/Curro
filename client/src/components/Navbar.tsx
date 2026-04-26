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
    background: isActive ? "var(--primary)" : "transparent",
    color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)",
    border: isActive ? "1px solid var(--primary)" : "1px solid var(--accent)",
  });

  return (
    <nav style={containerStyle}>
      <div style={logoStyle}>Curro</div>

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
            background: isActive ? "var(--primary)" : "transparent",
            color: isActive
              ? "var(--primary-foreground)"
              : "var(--muted-foreground)",
            border: isActive
              ? "1px solid var(--primary)"
              : "1px solid var(--accent)",
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
  backgroundColor: "var(--card)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "var(--primary)",
};

const linksContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

export default Navbar;
