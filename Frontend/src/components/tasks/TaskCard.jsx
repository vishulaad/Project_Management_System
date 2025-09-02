import React, { useState, useRef, useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { useCompany } from "../../contexts/CompanyContext";
import { useProjects } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function TaskCard({ task }) {
  const { members } = useCompany();
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
    .map((a) => members.find((m) => m.id === a.userid)?.name)
    .filter(Boolean);

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <div
      onClick={() => navigate(`/view-task/${task.taskId}`)}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
    >
      {/* Status & Priority badges in top right */}
      <div className="absolute top-3 right-3 flex gap-2">
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Title & Project */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {task.title}
        </h3>
        {project && (
          <p className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            {project.name}
          </p>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Due date & Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-500"}>
            {task.dueDate
              ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
              : "No deadline"}
          </span>
          {isOverdue && (
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              Overdue
            </span>
          )}
        </div>

        {/* Assignees as avatars */}
        {assigneeNames.length > 0 && (
          <div className="flex -space-x-2">
            {assigneeNames.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white"
                title={name}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            ))}
            {assigneeNames.length > 3 && (
              <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-white">
                +{assigneeNames.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
