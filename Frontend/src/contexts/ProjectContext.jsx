// src/contexts/ProjectContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../components/auth/api";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const getProjects = async () => {
    try {
      const res = await API.get(`/projects/company/${user.companyId}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const createProject = async (data) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", data.status);
    formData.append("technologies", data.technologies);

    data.assignedEmployees.forEach((id) => {
      formData.append("teamMembers", id);
    });

    if (data.documentFile) {
      formData.append("documentFile", data.documentFile);
    }

    const res = await API.post("/projects", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setProjects((prev) => [...prev, res.data]);
  };

  const updateProject = async (id, data) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", data.status);
    formData.append("technologies", data.technologies);

    data.assignedEmployees.forEach((id) => {
      formData.append("teamMembers", id);
    });

    if (data.documentFile) {
      formData.append("documentFile", data.documentFile);
    }

    const res = await API.put(`/projects/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setProjects((prev) =>
      prev.map((p) => (p.id === Number(id) ? res.data : p))
    );
  };

  const deleteProject = async (id) => {
    const token = localStorage.getItem("token");
    await API.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (user) getProjects();
  }, [user]);

  return (
    <ProjectContext.Provider
      value={{ projects, createProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
