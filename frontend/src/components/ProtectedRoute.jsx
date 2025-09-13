import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  // While context is loading the token status, don't render anything
  if (loading) {
    return null; 
  }

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there is a token, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;