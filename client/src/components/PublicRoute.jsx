import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/chat" replace /> : <Outlet />;
};

export default PublicRoute;
