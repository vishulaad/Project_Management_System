import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Clock, AlertCircle, Edit, Trash2, BookOpen, Plus, Target, CheckCircle } from "lucide-react";
import { useStories } from "../../contexts/StoryContext";
import API from "../auth/api";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("taskId", task.taskId.toString());
    e.dataTransfer.setData("currentStatus", task.status);
    e.dataTransfer.setData("storyId", task.storyId?.toString() || "");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Critical":
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
      className={`bg-white rounded-lg shadow-sm border p-3 cursor-move hover:shadow-md transition-all ${
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

const StoryCard = ({ story, onEdit, onDelete, onAddTask }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 border-green-200";
      case "InProgress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "InReview":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Backlog":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Critical":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const completedTasks = story.tasks?.filter(task => task.status === "Completed").length || 0;
  const totalTasks = story.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{story.title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{story.description}</p>
          {story.acceptanceCriteria && (
            <p className="text-xs text-gray-500 mb-2">
              <strong>AC:</strong> {story.acceptanceCriteria}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(story.status)}`}>
            {story.status}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(story)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(story)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span>{story.storyPoints} points</span>
        </div>
        <div className={`flex items-center gap-1 ${getPriorityColor(story.priority)}`}>
          <AlertCircle className="w-4 h-4" />
          <span>{story.priority}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
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

      <button
        onClick={() => onAddTask(story)}
        className="w-full bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
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
      case "Todo":
        return "border-gray-300 bg-gray-50/50";
      case "InProgress":
        return "border-blue-300 bg-blue-50/50";
      case "InReview":
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

export function SprintStoryBoard() {
  const { id: sprintId } = useParams();
  const navigate = useNavigate();
  const { getStoriesBySprint } = useStories();
  
  const [sprint, setSprint] = useState(null);
  const [stories, setStories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch sprint details
        const sprintResponse = await API.get(`/sprint/${sprintId}`, config);
        if (sprintResponse.data) {
          setSprint(sprintResponse.data);

          // Fetch stories for this sprint
          const storiesData = await getStoriesBySprint(parseInt(sprintId));
          setStories(storiesData);

          // Extract all tasks from stories
          const allTasks = storiesData.reduce((acc, story) => {
            if (story.tasks) {
              return [...acc, ...story.tasks];
            }
            return acc;
          }, []);
          setTasks(allTasks);
        } else {
          console.error("Sprint not found");
          alert("Sprint not found");
          navigate("/projects");
        }
      } catch (error) {
        console.error("Error fetching sprint data:", error);
        alert("Failed to load sprint data");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    if (sprintId) {
      fetchSprintData();
    }
  }, [sprintId, navigate, getStoriesBySprint]);

  // Group tasks by status
  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "Todo"),
    "In Progress": tasks.filter((task) => task.status === "InProgress"),
    "In Review": tasks.filter((task) => task.status === "InReview"),
    "Completed": tasks.filter((task) => task.status === "Completed")
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      
      // Update task status in backend
      const response = await API.put(`/tasks/${taskId}`, { status: newStatus }, config);

      if (response.data) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) => 
            task.taskId === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status");
    }
  };

  const handleEditTask = (task) => {
    console.log("Edit task:", task);
    alert("Edit task functionality coming soon!");
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        await API.delete(`/tasks/${task.taskId}`, config);
        setTasks((prevTasks) => prevTasks.filter((t) => t.taskId !== task.taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const handleEditStory = (story) => {
    console.log("Edit story:", story);
    alert("Edit story functionality coming soon!");
  };

  const handleDeleteStory = async (story) => {
    if (window.confirm(`Are you sure you want to delete story "${story.title}"?`)) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        await API.delete(`/stories/${story.storyId}`, config);
        
        // Remove story and its tasks from state
        setStories(prev => prev.filter(s => s.storyId !== story.storyId));
        setTasks(prev => prev.filter(t => t.storyId !== story.storyId));
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story");
      }
    }
  };

  const handleAddTask = (story) => {
    console.log("Add task to story:", story);
    alert("Add task functionality coming soon!");
  };

  const handleBackToProject = () => {
    if (sprint?.projectId) {
      navigate(`/project/${sprint.projectId}`);
    } else {
      navigate("/projects");
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
            onClick={() => navigate("/projects")}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Duration</span>
            </div>
            <p className="text-blue-900 font-semibold text-sm">
              {new Date(sprint.startDate).toLocaleDateString()} -{" "}
              {new Date(sprint.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Stories</span>
            </div>
            <p className="text-green-900 font-semibold">{stories.length}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Tasks</span>
            </div>
            <p className="text-purple-900 font-semibold">{tasks.length}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Status</span>
            </div>
            <p className="text-yellow-900 font-semibold">{sprint.status}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Sprint Progress</span>
            <span>
              {tasks.filter((t) => t.status === "Completed").length}/{tasks.length} tasks completed
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

      <div className="px-6 pb-6">
        {/* Stories Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            User Stories ({stories.length})
          </h2>
          
          {stories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-8 text-center">
              <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">No Stories Yet</h3>
              <p className="text-blue-700">This sprint doesn't have any user stories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {stories.map((story) => (
                <StoryCard
                  key={story.storyId}
                  story={story}
                  onEdit={handleEditStory}
                  onDelete={handleDeleteStory}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Task Kanban Board */}
        <div>
          <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Task Board ({tasks.length} tasks)
          </h2>
          
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
    </div>
  );
}