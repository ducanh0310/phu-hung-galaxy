import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const token = localStorage.getItem('jwt');

  // In a real app, you'd also want to validate the token (e.g., check expiration)
  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated, render the nested routes
  return <Outlet />;
};

export default AdminProtectedRoute;