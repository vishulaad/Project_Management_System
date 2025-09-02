import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../components/auth/api";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const { user, role, isLoading } = useAuth();

  // Fetch all projects
  const getProject = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      let response;
      if (role?.toLowerCase() === "employee") {
        response = await API.get(`/projects/user/${user.userId}`, config);
      } else {
        response = await API.get(`/projects/company/${user.companyId}`, config);
      }

      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
    }
  };

  // Fetch single project by ID
  const getProjectById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await API.get(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err) {
      console.error("Failed to fetch project:", err);
      return null;
    }
  };

  // Create project (backend + state)
  const addProjectInState = async (newProject) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await API.post("/projects", newProject, config);
      setProjects((prev) => [...prev, res.data]);

      return res.data;
    } catch (err) {
      console.error("Failed to create project:", err);
      throw err;
    }
  };

  // Update project (backend + state)
  const updateProjectInState = async (id, updated) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await API.put(`/projects/${id}`, updated, config);
      setProjects((prev) => prev.map((p) => (p.projectId === id ? res.data : p)));
      
      // Refresh projects list to ensure we have latest data
      await getProject();
      return res.data;
    } catch (err) {
      console.error("Failed to update project:", err);
      throw err;
    }
  };

  // Delete project (backend + state)
  const deleteProjectInState = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.delete(`/projects/${id}`, config);
      setProjects((prev) => prev.filter((p) => p.projectId !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      throw err;
    }
  };

  // Auto-fetch projects when user & role ready
  useEffect(() => {
    if (!isLoading && user) {
      getProject();
    }
  }, [user, role, isLoading]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        getProject,
        getProjectById,
        addProjectInState,
        updateProjectInState,
        deleteProjectInState,
      }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be inside ProjectProvider");
  return context;
}