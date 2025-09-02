// layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
