import { Navigate } from "react-router-dom";
import { authUtils } from "../services/api";

function VendorProtectedRoute({ children }) {
  const { token } = authUtils.getVendorAuth();

  if (!token) {
    return <Navigate to="/vendor/login" replace />;
  }

  return children;
}

export default VendorProtectedRoute;
