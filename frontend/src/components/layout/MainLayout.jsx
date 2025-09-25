import React from "react";
import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <div>
        <div>
          <h1>Book Store</h1>
          <div>
            <Link to="/">Dashboard</Link>
            <Link to="/author">Author</Link>
            <Link to="/book">Book</Link>
            <Link to="/employee">Employees</Link>
            <Link to="/inventory">Inventory</Link>
            <Link to="/order">Order</Link>
            <Link to="/user">User</Link>
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
