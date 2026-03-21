import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // 1. If they aren't logged in at all, kick them back to the landing page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

 const userRole = user.role ? user.role.toLowerCase() : '';

  // 3. If this route requires specific roles, check permission
  if (allowedRoles) {
    // Convert all allowedRoles to lowercase to ensure a match
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowed.includes(userRole)) {
      // Redirect based on what they actually are
      if (userRole === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } 
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("Access granted to user with role:", userRole);
  return children;
}