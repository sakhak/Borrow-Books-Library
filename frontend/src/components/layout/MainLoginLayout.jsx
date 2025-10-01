import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function MainLoginLayout() {
  const location = useLocation();

  // Check if we are on /register
  const isRegister = location.pathname === "/register";

  return (
    <div className="min-h-screen flex">
      {/* Left side (branding / welcome message) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
          <p className="text-lg opacity-90">
            Access your Web Application
          </p>
          <div className="mt-8 space-x-4">
            <Link
              to="/login"
              className={`px-6 py-2 rounded-lg font-medium shadow transition ${
                isRegister
                  ? "bg-white text-indigo-600 hover:bg-gray-100"
                  : "bg-white text-indigo-600"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-6 py-2 rounded-lg font-medium border transition ${
                isRegister
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "border-white hover:bg-white hover:text-indigo-600"
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Right side (form area) */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div
          className={`w-full max-w-md shadow-lg rounded-xl p-8 transition duration-300 ${
            isRegister ? "bg-purple-50" : "bg-white"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLoginLayout;
