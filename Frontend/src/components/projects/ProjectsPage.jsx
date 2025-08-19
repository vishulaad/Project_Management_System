import React, { useState } from "react";
import { Plus, Search, Filter, Calendar } from "lucide-react";
import { useProjects } from "../../contexts/ProjectContext";
import { ProjectCard } from "./ProjectCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { projects } = useProjects();
  const { role } = useAuth();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    "All",
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
  ];

  return (
    <div
      className="space-y-6 animate-fadeSlideUp"
      style={{ animationDuration: "0.6s", animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between animate-fadeSlideUp delay-100">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Projects</h1>
          <p className="text-blue-800">
            Manage your company projects and teams
          </p>
        </div>

        {role !== "Employee" && (
          <button
            onClick={() => navigate("/create-project")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transform">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 transition">
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div
            key={index}
            className="animate-fadeSlideUp"
            style={{
              animationDelay: `${0.1 * index + 0.3}s`,
              animationFillMode: "forwards",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}>
            <ProjectCard projectData={project} />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 animate-fadeSlideUp delay-400">
          <div className="w-16 h-16 bg-blue-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-950 mb-2">
            No projects found
          </h3>
          <p className="text-blue-700 mb-4">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
          {role !== "Employee" && (
            <button
              onClick={() => navigate("/create-project")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors hover:scale-105 transform">
              Create Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}
