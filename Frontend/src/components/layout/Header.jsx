import React, { use, useEffect } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Header() {
  const { userById, user, selectedCompany, logout } = useAuth();
  const navigate = useNavigate();
  const submitLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-blue-950 border-b border-blue-900 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {selectedCompany?.name}
          </h2>
          <p className="text-xl font-bold text-blue-300">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <p className="font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-blue-300">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={submitLogout}
            className="p-2 text-blue-300 hover:text-red-400 hover:bg-blue-900 rounded-lg transition-colors"
            title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
