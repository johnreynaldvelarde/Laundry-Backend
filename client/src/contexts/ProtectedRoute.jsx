import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { accessToken, isLoading, userDetails } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // if (userDetails.roleName) {
  //   return <Navigate to="/" replace />;
  // }

  if (
    userDetails.roleName === "Customer" &&
    location.pathname.startsWith("/main")
  ) {
    return <Navigate to="/customer-page" replace />;
  }

  if (
    userDetails.roleName !== "Customer" &&
    location.pathname.startsWith("/customer-page")
  ) {
    return <Navigate to="/main" replace />;
  }

  // Otherwise, render the requested component
  return <Component {...rest} />;
};

export default ProtectedRoute;
