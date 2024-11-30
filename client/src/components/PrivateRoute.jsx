// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
