import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Calendar, Users, Clock, CheckCircle2, BarChart3, ChevronDown, ChevronRight } from "lucide-react";

// Mock sprint data - replace with your actual API calls
const mockSprints = [
  {
    sprintId: 1,
    name: "EMS-S1",
    projectId: 1,
    projectName: "Employee Management System",
    startDate: "2025-08-15",
    endDate: "2025-08-30",
    status: "Active",
    taskCount: 12,
    completedTasks: 8
  },
  {
    sprintId: 2,
    name: "EMS-S2",
    projectId: 1,
    projectName: "Employee Management System",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
    status: "Upcoming",
    taskCount: 0,
    completedTasks: 0
  },
  {
    sprintId: 3,
    name: "SMS-S1",
    projectId: 2,
    projectName: "Social Media Site",
    startDate: "2025-08-10",
    endDate: "2025-08-25",
    status: "Completed",
    taskCount: 15,
    completedTasks: 15
  }
];

const mockProjects = [
  {
    projectId: 1,
    name: "Employee Management System"
  },
  {
    projectId: 2,
    name: "Social Media Site"
  }
];

const SprintCard = ({ sprint, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const progress = sprint.taskCount > 0 ? (sprint.completedTasks / sprint.taskCount) * 100 : 0;

  return (
    <div
      onClick={() => onClick(sprint)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{sprint.name}</h3>
          <p className="text-sm text-blue-600 font-medium">{sprint.projectName}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(sprint.status)}`}>
          {sprint.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle2 className="w-4 h-4" />
          <span>{sprint.completedTasks}/{sprint.taskCount} tasks completed</span>
        </div>
      </div>

      {sprint.taskCount > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const ProjectSprintGroup = ({ project, sprints, onSprintClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <h3 className="text-lg font-bold text-blue-950">{project.name}</h3>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
            {sprints.length} sprints
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sprints.map((sprint) => (
            <SprintCard key={sprint.sprintId} sprint={sprint} onClick={onSprintClick} />
          ))}
        </div>
      )}
    </div>
  );
};

function TasksPage() {
  const navigate = useNavigate(); // NEW: for navigation

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sprints, setSprints] = useState(mockSprints);
  const [projects] = useState(mockProjects);
  const [filteredSprints, setFilteredSprints] = useState([]);

  // Mock role for demo - replace with your useAuth hook
  const role = "admin";

  useEffect(() => {
    const filtered = sprints.filter((sprint) => {
      const matchesSearch =
        sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sprint.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === "All" || sprint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredSprints(filtered);
  }, [sprints, searchTerm, statusFilter]);

  const statusOptions = ["All", "Active", "Upcoming", "Completed"];

  // Calculate stats
  const totalSprints = sprints.length;
  const activeSprints = sprints.filter(s => s.status === "Active").length;
  const completedSprints = sprints.filter(s => s.status === "Completed").length;
  const upcomingSprints = sprints.filter(s => s.status === "Upcoming").length;

  // Group sprints by project
  const projectGroups = projects.reduce((acc, project) => {
    const projectSprints = filteredSprints.filter(sprint => sprint.projectId === project.projectId);
    if (projectSprints.length > 0) {
      acc.push({ project, sprints: projectSprints });
    }
    return acc;
  }, []);

  // UPDATED: navigate instead of alert
  const handleSprintClick = (sprint) => {
    navigate(`/sprints/${sprint.sprintId}`);
  };

  // Optional: wire your create sprint route here
  const handleCreateSprint = () => {
    navigate("/sprints/create");
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Sprints</h1>
          <p className="text-blue-800">Manage project sprints and track progress</p>
        </div>
        {role !== "employee" && (
          <button
            onClick={handleCreateSprint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Sprint
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sprints"
          value={totalSprints}
          icon={BarChart3}
          color="text-blue-600"
        />
        <StatsCard
          title="Active Sprints"
          value={activeSprints}
          icon={Clock}
          color="text-green-600"
        />
        <StatsCard
          title="Completed Sprints"
          value={completedSprints}
          icon={CheckCircle2}
          color="text-purple-600"
        />
        <StatsCard
          title="Upcoming Sprints"
          value={upcomingSprints}
          icon={Calendar}
          color="text-orange-600"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sprints..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    Status: {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped by Project */}
      <div>
        <h2 className="text-xl font-bold text-blue-950 mb-4">Sprints by Project</h2>
        {projectGroups.map(({ project, sprints }) => (
          <ProjectSprintGroup
            key={project.projectId}
            project={project}
            sprints={sprints}
            onSprintClick={handleSprintClick}
          />
        ))}
      </div>

      {/* Table View */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
        <h2 className="text-xl font-bold text-blue-950 mb-4">All Sprints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Sprint Name</th>
                <th className="px-6 py-3">Project Name</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSprints.map((sprint) => (
                <tr key={sprint.sprintId} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{sprint.name}</td>
                  <td className="px-6 py-4 text-blue-600">{sprint.projectName}</td>
                  <td className="px-6 py-4">{new Date(sprint.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(sprint.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sprint.status === "Active" ? "bg-blue-100 text-blue-800" :
                      sprint.status === "Completed" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {sprint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${sprint.taskCount > 0 ? (sprint.completedTasks / sprint.taskCount) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {sprint.completedTasks}/{sprint.taskCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSprintClick(sprint)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                    >
                      View Sprint
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSprints.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-950 mb-2">
            No sprints found
          </h3>
          <p className="text-blue-700 mb-4">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filters"
              : "Create your first sprint to get started"}
          </p>
          {role !== "employee" && (
            <button
              onClick={handleCreateSprint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Sprint
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
