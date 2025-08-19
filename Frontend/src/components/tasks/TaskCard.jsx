import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { useCompany } from "../../contexts/CompanyContext";
import { useTasks } from "../../contexts/TaskContext";
import { useProjects } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function TaskCard({ task }) {
  const { members } = useCompany();
  const { deleteTask } = useTasks();
  const { projects } = useProjects();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
      case "Review":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const project = projects.find((p) => p.id === task.projectId);
  const assigneeNames = task.assignees
    .filter((a) => a.isActive)
    .map((a) => members.find((m) => m.id === a.userId)?.name)
    .filter(Boolean);

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <div
      onClick={() => navigate(`/view-task/${task.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            {task.title}
          </h3>
          {project && (
            <p className="text-sm text-blue-600 font-medium">{project.name}</p>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span
            className={
              isOverdue ? "text-red-600 font-medium" : "text-gray-500"
            }>
            Due: {task.dueDate}
          </span>
          {isOverdue && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Overdue
            </span>
          )}
        </div>

        {assigneeNames.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{assigneeNames.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              task.status
            )}`}>
            {task.status}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
              task.priority
            )}`}>
            {task.priority}
          </span>
        </div>

        {assigneeNames.length > 0 && (
          <div className="flex -space-x-2">
            {assigneeNames.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white"
                title={name}>
                {name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {assigneeNames.length > 3 && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white">
                +{assigneeNames.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
