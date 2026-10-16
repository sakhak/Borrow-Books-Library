import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FaBook } from "react-icons/fa6";

function MainLoginLayout() {
  return (
    // MODIFIED THIS LINE: Replaced "justify-between items-center" with "min-h-screen"
    <div className="flex min-h-screen">
      <div className=" flex bg-main w-1/2 h-auto justify-center ">
        <div className="flex items-center flex-col mt-20">
          <h1 className="text-7xl text-text-white font-bold p-2 mb-5">
            Angkor Book
          </h1>
          <div className="flex flex-col w-full mb-20">
            <p className="text-text-white text-xl">
              Borrow, read, and return with ease.
            </p>
            <p className="text-text-white text-xl ">
              Log in to access your community library.
            </p>
          </div>
          <FaBook className="w-50 h-50 text-text-white" />
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="p-10 `w-600">
          <Outlet className="h-auto" />
          <div></div>
        </div>
      </div>
    </div>
  );
}
export default MainLoginLayout;