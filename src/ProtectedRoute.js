import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  // Redirect to login page if the user is not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Redirect to unauthorized page if the user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the protected component if the user is authenticated and has the allowed role
  return <Route {...rest} element={<Component />} />;
};

export default ProtectedRoute;



