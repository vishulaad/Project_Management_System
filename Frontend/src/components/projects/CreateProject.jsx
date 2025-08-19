// src/pages/CreateProject.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useProjects } from "../../contexts/ProjectContext";
import { useCompany } from "../../contexts/CompanyContext";
import API from "../auth/api";

export default function CreateProject() {
  const { id } = useParams(); // if id exists → edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { projects, createProject, updateProject } = useProjects();
  const { members } = useCompany();

  const [loading, setLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    technologies: "",
    assignedEmployees: [],
    documentFile: null,
  });

  
  useEffect(() => {
    const loadProject = async () => {
      if (isEditMode) {
        let project = projects.find((p) => p.id === Number(id));

        // if not in context, fetch from API
        if (!project) {
          try {
            const token = localStorage.getItem("token");
            const response = await API.get(`/projects/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            project = response.data;
          } catch (err) {
            console.error("Failed to fetch project:", err);
          }
        }

        if (project) {
          setProjectData({
            name: project.name || "",
            description: project.description || "",
            startDate: project.startDate ? project.startDate.split("T")[0] : "",
            endDate: project.endDate ? project.endDate.split("T")[0] : "",
            status: project.status || "Planned",
            technologies: project.technologies || "",
            assignedEmployees:
              project.teamMembers?.map((tm) => tm.userId) || [],
            documentFile: null,
          });
        }
      }
    };

    loadProject();
  }, [isEditMode, id, projects]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSelectChange = (selected) => {
    setProjectData((prev) => ({
      ...prev,
      assignedEmployees: selected.map((s) => s.value),
    }));
  };

  
  const handleFileChange = (e) => {
    setProjectData((prev) => ({
      ...prev,
      documentFile: e.target.files[0],
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await updateProject({ id: Number(id), ...projectData });
      } else {
        await createProject(projectData);
      }
      navigate("/projects");
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setLoading(false);
    }
  };

 
  const employeeOptions = members.map((m) => ({
    value: m.userId,
    label: m.name,
  }));

  const inputClasses =
    "w-full border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Project" : "Create Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Project Name</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={projectData.startDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={projectData.endDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={projectData.status}
            onChange={handleChange}
            className={inputClasses}>
            <option value="Planned">Planned</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Technologies */}
        <div>
          <label className="block mb-1 font-medium">Technologies</label>
          <input
            type="text"
            name="technologies"
            value={projectData.technologies}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Assigned Employees */}
        <div>
          <label className="block mb-1 font-medium">Assign Employees</label>
          <Select
            isMulti
            options={employeeOptions}
            value={employeeOptions.filter((o) =>
              projectData.assignedEmployees.includes(o.value)
            )}
            onChange={handleSelectChange}
          />
        </div>

        {/* Document Upload */}
        <div>
          <label className="block mb-1 font-medium">Project Document</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}>
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Project"
            : "Create Project"}
        </button>
      </form>
    </div>
  );
}
