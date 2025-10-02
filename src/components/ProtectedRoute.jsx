import { Navigate } from "react-router-dom";
import { authUtils } from "../services/api";

function ProtectedRoute({ children }) {
  // Check if user is authenticated using the proper auth utils
  const isAuthenticated = authUtils.isAuthenticated();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute;
