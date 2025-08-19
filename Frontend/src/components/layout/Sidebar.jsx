import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../contexts/CompanyContext";
import { useAuth } from "../../contexts/AuthContext";

export function Sidebar({ currentPage }) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useCompany();

  return (
    <div className="w-64 bg-blue-950 border-r border-blue-900 flex flex-col">
      <div className="p-6 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">ProjectHub</h1>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === "dashboard"
                  ? "bg-white text-blue-900 font-semibold"
                  : "text-blue-200 hover:bg-blue-900 hover:text-white"
              }`}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/projects")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === "projects"
                  ? "bg-white text-blue-900 font-semibold"
                  : "text-blue-200 hover:bg-blue-900 hover:text-white"
              }`}>
              <FolderOpen className="w-5 h-5" />
              Projects
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/tasks")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === "tasks"
                  ? "bg-white text-blue-900 font-semibold"
                  : "text-blue-200 hover:bg-blue-900 hover:text-white"
              }`}>
              <CheckSquare className="w-5 h-5" />
              Tasks
            </button>
          </li>

          {role !== "Employee" && (
            <li>
              <button
                onClick={() => navigate("/leaves")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentPage === "leaves"
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-blue-200 hover:bg-blue-900 hover:text-white"
                }`}>
                <Calendar className="w-5 h-5" />
                Leave Status
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
