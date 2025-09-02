import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Users, Clock, AlertCircle, Edit, Trash2 } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("taskId", task.taskId.toString());
    e.dataTransfer.setData("currentStatus", task.status);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg shadow-sm border p-4 cursor-move hover:shadow-md transition-all ${
        isDragging ? "opacity-50 rotate-2" : ""
      } ${isOverdue ? "border-red-300" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {isOverdue && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs font-medium">Overdue</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="truncate max-w-16">{task.assignedTo || "Unassigned"}</span>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, tasks, status, onTaskDrop, onEdit, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const currentStatus = e.dataTransfer.getData("currentStatus");

    if (currentStatus !== status) {
      onTaskDrop(taskId, status);
    }
  };

  const getColumnColor = (status) => {
    switch (status) {
      case "NotStarted":
        return "border-gray-300 bg-gray-50/50";
      case "InProgress":
        return "border-blue-300 bg-blue-50/50";
      case "OnHold":
        return "border-yellow-300 bg-yellow-50/50";
      case "Completed":
        return "border-green-300 bg-green-50/50";
      default:
        return "border-gray-300 bg-gray-50/50";
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border-2 transition-all ${
        isDragOver ? "border-blue-400 bg-blue-50" : getColumnColor(status)
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 min-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.taskId} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export function SprintKanbanBoard() {
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get sprint ID from URL
  const sprintId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`/api/sprint/${sprintId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const sprintData = await response.json();
          setSprint(sprintData);
          setTasks(sprintData.tasks || []);
        } else {
          console.error("Failed to fetch sprint data");
          alert("Sprint not found");
          window.location.href = "/projects";
        }
      } catch (error) {
        console.error("Error fetching sprint:", error);
        alert("Failed to load sprint data");
      } finally {
        setLoading(false);
      }
    };

    if (sprintId) {
      fetchSprintData();
    }
  }, [sprintId]);

  // Group tasks by status
  const tasksByStatus = {
    "Not Started": tasks.filter((task) => task.status === "NotStarted"),
    "In Progress": tasks.filter((task) => task.status === "InProgress"),
    "On Hold": tasks.filter((task) => task.status === "OnHold"),
    "Completed": tasks.filter((task) => task.status === "Completed")
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      // Update task status in backend
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) => 
            task.taskId === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error("Failed to update task status");
        alert("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status");
    }
  };

  const handleEditTask = (task) => {
    // TODO: Implement edit task functionality
    console.log("Edit task:", task);
    alert("Edit task functionality coming soon!");
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`/api/tasks/${task.taskId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setTasks((prevTasks) => prevTasks.filter((t) => t.taskId !== task.taskId));
        } else {
          alert("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const handleBackToProject = () => {
    if (sprint?.projectId) {
      window.location.href = `/project/${sprint.projectId}`;
    } else {
      window.location.href = "/projects";
    }
  };

  const calculateProgress = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Completed").length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getDaysRemaining = () => {
    if (!sprint?.endDate) return 0;
    const endDate = new Date(sprint.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-800">Loading sprint data...</p>
        </div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Sprint Not Found</h2>
          <button
            onClick={() => window.location.href = "/projects"}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/80 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToProject}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Project
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-950">{sprint.name}</h1>
              <p className="text-blue-800">{sprint.projectName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-bold text-blue-900">{Math.round(calculateProgress())}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Days Remaining</p>
              <p
                className={`text-lg font-bold ${
                  getDaysRemaining() < 5 ? "text-red-600" : "text-blue-900"
                }`}
              >
                {getDaysRemaining()}
              </p>
            </div>
          </div>
        </div>

        {/* Sprint Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Duration</span>
            </div>
            <p className="text-blue-900 font-semibold">
              {new Date(sprint.startDate).toLocaleDateString()} -{" "}
              {new Date(sprint.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Status</span>
            </div>
            <p className="text-green-900 font-semibold">{sprint.status}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Total Tasks</span>
            </div>
            <p className="text-purple-900 font-semibold">{tasks.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Sprint Progress</span>
            <span>
              {tasks.filter((t) => t.status === "Completed").length}/{tasks.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <KanbanColumn
              key={status}
              title={status}
              tasks={tasks}
              status={status.replace(" ", "")}
              onTaskDrop={handleTaskDrop}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}