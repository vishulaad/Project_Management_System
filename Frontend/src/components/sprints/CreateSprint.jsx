

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, Save, X, Plus, Trash2, BookOpen, CheckSquare, Clock, Target } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectContext";
import API from "../auth/api";
import { Edit } from "lucide-react";

export function CreateSprint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { projects, getProject } = useProjects();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    description: "",
    stories: []
  });

  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    acceptanceCriteria: "",
    storyPoints: 0,
    priority: "Medium",
    tasks: []
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    estimatedHours: 0
  });

  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStoryIndex, setEditingStoryIndex] = useState(null);

  // Set projectId from URL params on component mount
  useEffect(() => {
    const projectIdFromUrl = searchParams.get("projectId");
    if (projectIdFromUrl) {
      setFormData(prev => ({ 
        ...prev, 
        projectId: String(projectIdFromUrl) 
      }));
    }
  }, [searchParams]);

  // Ensure projects are loaded
  useEffect(() => {
    if (!projects || projects.length === 0) {
      getProject();
    }
  }, [projects, getProject]);

  // Generate sprint name when project is selected
  useEffect(() => {
    const generateSprintName = async () => {
      if (formData.projectId && projects.length > 0) {
        try {
          const token = localStorage.getItem("token");
          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          try {
            const response = await API.get(`/sprint/generate-name/${formData.projectId}`, config);
            setFormData(prev => ({ ...prev, name: response.data.name }));
          } catch (apiError) {
            const selectedProject = projects.find(
              p => String(p.projectId) === String(formData.projectId)
            );
            if (selectedProject) {
              const shortName = selectedProject.name.substring(0, 3).toUpperCase();
              setFormData(prev => ({ ...prev, name: `${shortName}-S1` }));
            }
          }
        } catch (error) {
          console.error("Failed to generate sprint name:", error);
        }
      }
    };

    generateSprintName();
  }, [formData.projectId, projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoryChange = (e) => {
    const { name, value } = e.target;
    setNewStory(prev => ({
      ...prev,
      [name]: name === 'storyPoints' ? parseInt(value) || 0 : value
    }));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? parseFloat(value) || 0 : value
    }));
  };

  const addTaskToStory = () => {
    if (!newTask.title.trim()) return;

    setNewStory(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...newTask, id: Date.now() }]
    }));

    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      estimatedHours: 0
    });
  };

  const removeTaskFromStory = (taskId) => {
    setNewStory(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const addStoryToSprint = () => {
    if (!newStory.title.trim()) return;

    if (editingStoryIndex !== null) {
      setFormData(prev => ({
        ...prev,
        stories: prev.stories.map((story, index) => 
          index === editingStoryIndex ? { ...newStory } : story
        )
      }));
      setEditingStoryIndex(null);
    } else {
      setFormData(prev => ({
        ...prev,
        stories: [...prev.stories, { ...newStory, id: Date.now() }]
      }));
    }

    setNewStory({
      title: "",
      description: "",
      acceptanceCriteria: "",
      storyPoints: 0,
      priority: "Medium",
      tasks: []
    });
    setShowStoryForm(false);
  };

  const editStory = (storyIndex) => {
    const story = formData.stories[storyIndex];
    setNewStory({ ...story });
    setEditingStoryIndex(storyIndex);
    setShowStoryForm(true);
  };

  const removeStoryFromSprint = (storyIndex) => {
    setFormData(prev => ({
      ...prev,
      stories: prev.stories.filter((_, index) => index !== storyIndex)
    }));
  };

  const cancelStoryEdit = () => {
    setNewStory({
      title: "",
      description: "",
      acceptanceCriteria: "",
      storyPoints: 0,
      priority: "Medium",
      tasks: []
    });
    setEditingStoryIndex(null);
    setShowStoryForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        throw new Error("Authentication required");
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ✅ Always provide a non-null description
      const sprintData = {
        name: formData.name,
        description: formData.description?.trim() || "No description provided",
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
        projectId: parseInt(formData.projectId),
        companyId: user.companyId,
        createdById: user.userId
      };

      const sprintResponse = await API.post("/sprint", sprintData, config);
      const createdSprint = sprintResponse.data;

      // Create stories with tasks
      for (const story of formData.stories) {
        const storyData = {
          title: story.title,
          description: story.description || "",
          acceptanceCriteria: story.acceptanceCriteria || "",
          storyPoints: parseInt(story.storyPoints) || 0,
          priority: story.priority,
          status: "Backlog",
          sprintId: createdSprint.sprintId,
          projectId: parseInt(formData.projectId),
          createdById: user.userId,
          tasks: story.tasks.map(task => ({
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            status: "Todo",
            estimatedHours: parseFloat(task.estimatedHours) || 0
          }))
        };

        await API.post("/stories", storyData, config);
      }

      alert("Sprint created successfully with stories and tasks!");
      navigate(`/project/${formData.projectId}`);
    } catch (error) {
      console.error("Error creating sprint:", error);
      const errorMessage = error.response?.data?.message || "Failed to create sprint. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const projectId = formData.projectId || searchParams.get("projectId");
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  const isFormValid = () => {
    return formData.projectId && formData.startDate && formData.endDate && formData.name.trim();
  };

 


  const inputClasses = "w-full bg-white/70 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-blue-800 mb-1.5";
  const priorityOptions = ["Low", "Medium", "High", "Critical"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={handleCancel}
            className="absolute left-0 p-2 text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-950">Create New Sprint</h1>
            <p className="text-sm text-blue-800">Set up a new sprint with stories and tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Sprint Details */}
          <div className="xl:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
            <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sprint Details
            </h2>
            
            <div className="space-y-4">
              {/* Project Selection */}
              <div>
                <label htmlFor="projectId" className={labelClasses}>
                  Select Project <span className="text-red-500">*</span>
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects && projects.length > 0 ? (
                    projects.map(project => (
                      <option key={project.projectId} value={String(project.projectId)}>
                        {project.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading projects...</option>
                  )}
                </select>
              </div>

              {/* Sprint Name */}
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Sprint Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Auto-generated based on project"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="startDate" className={labelClasses}>
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className={labelClasses}>
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className={labelClasses}>
                  Initial Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClasses}
                  placeholder="Describe the goals and objectives of this sprint..."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Stories Management */}
          <div className="xl:col-span-2 space-y-6">
            {/* Stories Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  User Stories ({formData.stories.length})
                </h2>
                <button
                  onClick={() => setShowStoryForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Story
                </button>
              </div>

              {/* Stories List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.stories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No stories added yet. Click "Add Story" to get started.</p>
                  </div>
                ) : (
                  formData.stories.map((story, index) => (
                    <div key={story.id || index} className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900">{story.title}</h4>
                          <p className="text-sm text-blue-700 mt-1 line-clamp-2">{story.description}</p>
                          {story.acceptanceCriteria && (
                            <p className="text-xs text-blue-600 mt-1">
                              <strong>AC:</strong> {story.acceptanceCriteria}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                            <span className="bg-blue-200 px-2 py-1 rounded">
                              {story.storyPoints} points
                            </span>
                            <span className="bg-blue-200 px-2 py-1 rounded">
                              {story.priority}
                            </span>
                            <span className="bg-blue-200 px-2 py-1 rounded">
                              {story.tasks.length} tasks
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <button
                            onClick={() => editStory(index)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeStoryFromSprint(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Tasks Preview */}
                      {story.tasks.length > 0 && (
                        <div className="mt-3 border-t border-blue-300 pt-3">
                          <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                            <CheckSquare className="w-3 h-3" />
                            Tasks ({story.tasks.length})
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {story.tasks.slice(0, 4).map((task, taskIndex) => (
                              <div key={task.id || taskIndex} className="bg-white/70 rounded p-2">
                                <p className="text-xs font-medium text-gray-900">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                  <span>{task.priority}</span>
                                  <span>•</span>
                                  <span>{task.estimatedHours}h</span>
                                </div>
                              </div>
                            ))}
                            {story.tasks.length > 4 && (
                              <div className="bg-white/70 rounded p-2 text-center text-xs text-gray-600">
                                +{story.tasks.length - 4} more tasks
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Story Form Modal */}
            {showStoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {editingStoryIndex !== null ? "Edit Story" : "Add New Story"}
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Story Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Story Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newStory.title}
                          onChange={handleStoryChange}
                          placeholder="As a user, I want to..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={newStory.description}
                          onChange={handleStoryChange}
                          placeholder="Detailed description of the user story"
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Acceptance Criteria
                        </label>
                        <textarea
                          name="acceptanceCriteria"
                          value={newStory.acceptanceCriteria}
                          onChange={handleStoryChange}
                          placeholder="Given... When... Then..."
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Story Points
                        </label>
                        <input
                          type="number"
                          name="storyPoints"
                          value={newStory.storyPoints}
                          onChange={handleStoryChange}
                          min="0"
                          max="100"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          name="priority"
                          value={newStory.priority}
                          onChange={handleStoryChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          {priorityOptions.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <CheckSquare className="w-5 h-5" />
                          Tasks ({newStory.tasks.length})
                        </h4>
                      </div>

                      {/* Add Task Form */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-800 mb-3">Add Task</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="title"
                            value={newTask.title}
                            onChange={handleTaskChange}
                            placeholder="Task title"
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            name="description"
                            value={newTask.description}
                            onChange={handleTaskChange}
                            placeholder="Task description (optional)"
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                          <select
                            name="priority"
                            value={newTask.priority}
                            onChange={handleTaskChange}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            {priorityOptions.map(priority => (
                              <option key={priority} value={priority}>{priority}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            name="estimatedHours"
                            value={newTask.estimatedHours}
                            onChange={handleTaskChange}
                            placeholder="Estimated hours"
                            min="0"
                            step="0.5"
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={addTaskToStory}
                              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Task
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {newStory.tasks.map((task, index) => (
                          <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{task.title}</h6>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">{task.priority}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.estimatedHours}h
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeTaskFromStory(task.id)}
                              className="text-red-500 hover:text-red-700 p-2 ml-3"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {newStory.tasks.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No tasks added yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={cancelStoryEdit}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addStoryToSprint}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {editingStoryIndex !== null ? "Update Story" : "Add to Sprint"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Creating Sprint..." : "Create Sprint"}
            </button>
          </div>

          {/* Sprint Summary */}
          {(formData.startDate && formData.endDate) || formData.stories.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Sprint Summary</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
                {formData.startDate && formData.endDate && (
                  <div>
                    <span className="font-medium">Duration:</span><br />
                    {Math.ceil(
                      (new Date(formData.endDate) - new Date(formData.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )} days
                  </div>
                )}
                <div>
                  <span className="font-medium">Stories:</span><br />
                  {formData.stories.length} user stories
                </div>
                <div>
                  <span className="font-medium">Tasks:
</span><br />
                  <span className="font-medium">Tasks:</span><br />
                  {formData.stories.reduce((total, story) => total + story.tasks.length, 0)} tasks
                </div>
                <div>
                  <span className="font-medium">Story Points:</span><br />
                  {formData.stories.reduce((total, story) => total + parseInt(story.storyPoints || 0), 0)} points
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-xl border border-slate-200/80 p-6">
          <h3 className="text-lg font-semibold text-blue-950 mb-3">Sprint Planning Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Keep sprints between 1-4 weeks for optimal productivity
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Sprint names follow the format: ProjectShortName-S[Number] (e.g., EMS-S1)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Each story should have clear acceptance criteria
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Break down stories into manageable tasks (1-8 hours each)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Use story points to estimate relative complexity
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Stories and tasks can be managed later via the Sprint board
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}