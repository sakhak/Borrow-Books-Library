// src/components/auth/RouteProtected.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function RouteProtected() {
  const token = Cookies.get("access_token"); // read at render time

  // no token -> bounce to /login, remember where we came from
  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  // token exists -> render protected children
  return <Outlet />;
}
