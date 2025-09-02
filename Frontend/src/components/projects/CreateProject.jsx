import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import API from "../auth/api";
import { useCompany } from "../../contexts/CompanyContext";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectContext";

export default function CreateProject() {
  const { user, role, isLoading: authLoading } = useAuth();
  const { projects, getProject } = useProjects();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { members } = useCompany();

  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    technologies: "",
    assignedEmployees: [], // { id?, userId }
  });

  // Load project if edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadProject = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await API.get(`/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const project = res.data;
          setProjectData({
            name: project.name,
            description: project.description,
            startDate: project.startDate ? project.startDate.split("T")[0] : "",
            endDate: project.endDate ? project.endDate.split("T")[0] : "",
            status:
              project.status === 1
                ? "Planned"
                : project.status === 2
                ? "InProgress"
                : "Completed",
            technologies: project.technologies,
            assignedEmployees: project.teamMembers.map((tm) => ({
              id: tm.id,
              userId: tm.UserId,
            })),
          });
        } catch (err) {
          console.error("Failed to load project:", err);
        }
      };
      loadProject();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected) => {
    setProjectData((prev) => {
      const newAssigned = selected.map((s) => {
        const existing = prev.assignedEmployees.find(
          (tm) => tm.userId === s.value
        );
        return existing ? existing : { userId: s.value };
      });
      return { ...prev, assignedEmployees: newAssigned };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status:
          projectData.status === "Planned"
            ? 1
            : projectData.status === "InProgress"
            ? 2
            : 3,
        companyId: user.companyId, // replace with dynamic value if needed
        createdById: user.userId, // replace with dynamic value if needed
        technologies: projectData.technologies,
        teamMembers: projectData.assignedEmployees.map((tm) => ({
          UserId: tm.userId,
          assignedAt: new Date().toISOString(),
        })),
      };

      if (isEditMode) {
        await API.put(`/projects/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/projects", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await getProject();
      navigate("/projects");
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setLoading(false);
    }
  };

  const employeeOptions = members.map((m) => ({
    value: m.userId,
    label: `${m.firstName} ${m.lastName}`,
  }));

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Project" : "Create Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={projectData.startDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={projectData.endDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            value={projectData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md">
            <option value="Planned">Planned</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label>Technologies</label>
          <input
            type="text"
            name="technologies"
            value={projectData.technologies}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label>Assign Employees</label>
          <Select
            isMulti
            options={employeeOptions}
            value={employeeOptions.filter((o) =>
              projectData.assignedEmployees.some((tm) => tm.userId === o.value)
            )}
            onChange={handleSelectChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
