import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Calendar,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { useCompany } from "../../contexts/CompanyContext";
import { useProjects } from "../../contexts/ProjectContext";

export function ProjectCard({ projectData }) {
  const { role } = useAuth();
  const { members } = useCompany();
  const { deleteProject } = useProjects();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Safe mapping (fallback to empty array)
  const teamMemberNames = (projectData?.teamMembers || [])
    .map((tm) => members?.find((m) => m.id === tm.userId)?.name)
    .filter(Boolean);

  return (
    <div
      onClick={() => navigate(`/project/${projectData?.projectId}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {projectData?.name || "Untitled Project"}
        </h3>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {projectData?.description || "No description available."}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {projectData?.startDate || "N/A"} - {projectData?.endDate || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{projectData?.teamMembers?.length || 0} team members</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            projectData?.status
          )}`}>
          {projectData?.status || "Unknown"}
        </span>

        {teamMemberNames.length > 0 && (
          <div className="flex -space-x-2">
            {teamMemberNames.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white"
                title={name}>
                {name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {teamMemberNames.length > 3 && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white">
                +{teamMemberNames.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
