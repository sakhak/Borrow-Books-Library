import React from "react";
import { Link, Outlet } from "react-router-dom";

function MainLoginLayout() {
  return (
    <div>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Login</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLoginLayout;
