import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Path to your context

export const ProtectedRoute = () => {
  const { jwtToken } = useUser();

  if (!jwtToken) {
    // Redirect to login, 'replace' prevents going back to the protected page
    return <Navigate to="/login" replace/>;
  }

  // Renders the child routes if authenticated
  return <Outlet />;
};