import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is admin - you can modify this logic based on your auth system
  const isAdmin = () => {
    const adminToken = localStorage.getItem('adminToken');
    const isAdminFlag = localStorage.getItem('isAdmin');
    
    // For demo purposes, we'll allow access if either token exists
    // In production, you should validate the token with your backend
    return adminToken && isAdminFlag === 'true';
  };

  // If not admin, redirect to login
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  // If admin, render the protected component
  return children;
}

export default ProtectedRoute;