import React from 'react';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div>
      <h1>This Main Layout</h1>
      <Outlet/>
    </div>
  );
}

export default MainLayout;
