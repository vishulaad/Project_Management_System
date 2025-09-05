import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, ListChecks, Edit, Trash2, Plus, Users, Clock, BookOpen, Target } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectContext";
import { useStories } from "../../contexts/StoryContext";
import API from "../auth/api";

const SprintCard = ({ sprint, onView, onEdit, onDelete, role }) => {
  const [storyCount, setStoryCount] = useState(0);
  const { getStoriesBySprint } = useStories();

  useEffect(() => {
    const fetchStoryCount = async () => {
      try {
        const stories = await getStoriesBySprint(sprint.sprintId);
        setStoryCount(stories.length);
      } catch (error) {
        console.error("Error fetching story count:", error);
        setStoryCount(0);
      }
    };

    if (sprint.sprintId) {
      fetchStoryCount();
    }
  }, [sprint.sprintId, getStoriesBySprint]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Upcoming":
      case "Planned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const progress = sprint.taskCount > 0 ? (sprint.completedTasks / sprint.taskCount) * 100 : 0;
  
  const getDaysRemaining = () => {
    const endDate = new Date(sprint.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStoryPointsTotal = () => {
    // This could be fetched from the stories, but for now we'll show story count
    return storyCount;
  };

  return (
    <div className="bg-white/70 border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition animate-fadeSlideUp">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-blue-900">{sprint.name}</h3>
          <p className="text-sm text-blue-700 mt-1">{sprint.description || "No description"}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(sprint.status)}`}>
            {sprint.status}
          </span>
          {role !== "employee" && (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(sprint);
                }}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sprint);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sprint Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm text-blue-700 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <div>
            <div className="font-medium">Duration</div>
            <div className="text-xs">
              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <div>
            <div className="font-medium">{getDaysRemaining()} days left</div>
            <div className="text-xs text-blue-600">
              {getDaysRemaining() <= 5 && getDaysRemaining() > 0 ? "Ending soon!" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Stories and Tasks Count */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Stories</span>
          </div>
          <div className="text-lg font-bold text-blue-900">{storyCount}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Tasks</span>
          </div>
          <div className="text-lg font-bold text-green-900">{sprint.taskCount || 0}</div>
        </div>
      </div>

      {/* Progress Bar */}
      {sprint.taskCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{sprint.completedTasks || 0}/{sprint.taskCount} tasks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {Math.round(progress)}% complete
          </div>
        </div>
      )}

      <button
        onClick={() => onView(sprint)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <ListChecks className="w-4 h-4" />
        Open Sprint Board
      </button>
    </div>
  );
};

const EditSprintModal = ({ sprint, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planned"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sprint) {
      setFormData({
        name: sprint.name || "",
        description: sprint.description || "",
        startDate: sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : "",
        endDate: sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : "",
        status: sprint.status || "Planned"
      });
    }
  }, [sprint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status
      };

      const response = await API.put(`/sprint/${sprint.sprintId}`, updateData, config);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating sprint:", error);
      alert("Failed to update sprint");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Edit Sprint</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sprint Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full border rounded px-3 py-2"
                min={formData.startDate}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { getProjectById, deleteProjectInState } = useProjects();
  
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSprint, setEditingSprint] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectAndSprints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch project details
        const projectData = await getProjectById(parseInt(id));
        if (!projectData) {
          setProject(null);
          setLoading(false);
          return;
        }
        
        setProject(projectData);

        // Fetch sprints for this project
        const sprintsResponse = await API.get(`/sprint/project/${id}`, config);
        setSprints(sprintsResponse.data || []);

      } catch (error) {
        console.error("Error fetching project/sprints:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectAndSprints();
    }
  }, [id, navigate, getProjectById]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This will also delete all associated sprints and stories.")) {
      try {
        await deleteProjectInState(parseInt(id));
        navigate("/projects");
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project");
      }
    }
  };

  const handleViewSprint = (sprint) => {
    navigate(`/sprint/${sprint.sprintId}`);
  };

  const handleEditSprint = (sprint) => {
    setEditingSprint(sprint);
    setIsEditModalOpen(true);
  };

  const handleDeleteSprint = async (sprint) => {
    if (window.confirm(`Are you sure you want to delete sprint "${sprint.name}"? This will also delete all associated stories and tasks.`)) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        await API.delete(`/sprint/${sprint.sprintId}`, config);
        setSprints(prev => prev.filter(s => s.sprintId !== sprint.sprintId));
        alert("Sprint deleted successfully");
      } catch (error) {
        console.error("Failed to delete sprint:", error);
        alert("Failed to delete sprint");
      }
    }
  };

  const handleCreateSprint = () => {
    navigate(`/create-sprint?projectId=${id}`);
  };

  const handleSaveEditedSprint = (updatedSprint) => {
    setSprints(prev => prev.map(s => 
      s.sprintId === updatedSprint.sprintId ? updatedSprint : s
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-800">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project with ID {id} could not be found.</p>
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
    <div className="space-y-6 animate-fadeSlideUp p-6" style={{ animationDuration: "0.6s", animationFillMode: "forwards" }}>
      {/* Project Header */}
      <div className="flex items-center justify-between animate-fadeSlideUp delay-100">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">{project.name}</h1>
          <p className="text-blue-800 mt-2">{project.description || "No description available"}</p>
        </div>

        <div className="flex items-center gap-4">
          {role !== "employee" && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/update-project/${project.projectId}`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Projects
          </button>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-950">
          <p>
            <strong>Start Date:</strong>{" "}
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
          </p>
          <p>
            <strong>Status:</strong> {project.status || "Unknown"}
          </p>
          <p>
            <strong>Technologies:</strong> {project.technologies || "Not specified"}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members ({project.teamCount || 0})
          </h2>
          <div className="mt-2">
            {Array.isArray(project.teamMembers) && project.teamMembers.length > 0 ? (
              <ul className="list-disc list-inside text-blue-800">
                {project.teamMembers.map((member, idx) => (
                  <li key={idx}>
                    {member.userName} — Role: {member.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No team members assigned</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Sprints */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-950">Project Sprints ({sprints.length})</h2>
          </div>
          {role !== "employee" && (
            <button
              onClick={handleCreateSprint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Sprint
            </button>
          )}
        </div>

        {sprints.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-blue-950 mb-2">No Sprints Yet</h3>
            <p className="text-blue-700 mb-6 max-w-md mx-auto">
              This project doesn't have any sprints yet. Create your first sprint to start organizing user stories and tasks.
            </p>
            {role !== "employee" && (
              <button
                onClick={handleCreateSprint}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Sprint
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sprints.map((sprint, index) => (
              <div
                key={sprint.sprintId}
                style={{
                  animationDelay: `${0.1 * index + 0.4}s`,
                  animationFillMode: "forwards",
                }}
              >
                <SprintCard
                  sprint={sprint}
                  onView={handleViewSprint}
                  onEdit={handleEditSprint}
                  onDelete={handleDeleteSprint}
                  role={role}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <EditSprintModal
        sprint={editingSprint}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSprint(null);
        }}
        onSave={handleSaveEditedSprint}
      />
    </div>
  );
}