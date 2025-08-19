import React, { useState } from "react";
import { Plus, Search, Filter, Calendar } from "lucide-react";
import { useTasks } from "../../contexts/TaskContext";
import { TaskCard } from "./TaskCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function TasksPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const { tasks } = useTasks();
  const { role } = useAuth(); // get role from AuthContext
  const statusOptions = ["All", "Todo", "In Progress", "Review", "Completed"];
  const priorityOptions = ["All", "Low", "Medium", "High"];

  // Filter tasks based on search term, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Tasks</h1>
          <p className="text-blue-800">Manage and track project tasks</p>
        </div>
        {role !== "Employee" && (
          <button
            onClick={() => navigate("/create-task")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
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
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  Priority: {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-950 mb-2">
            No tasks found
          </h3>
          <p className="text-blue-700 mb-4">
            {searchTerm || statusFilter !== "All" || priorityFilter !== "All"
              ? "Try adjusting your search or filters"
              : "Create your first task to get started"}
          </p>
          {role !== "Employee" && (
            <button
              onClick={() => navigate("/create-task")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          )}
        </div>
      )}
    </div>
  );
}
