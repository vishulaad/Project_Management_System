import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../components/auth/api";

const SprintContext = createContext();

export function SprintProvider({ children }) {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading } = useAuth();

  // Fetch all sprints based on user role
  const fetchSprints = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      let response;
      if (user.role?.toLowerCase() === "employee") {
        response = await API.get(`/sprint/user/${user.userId}`, config);
      } else {
        response = await API.get(`/sprint/company/${user.companyId}`, config);
      }

      setSprints(response.data || []);
    } catch (err) {
      console.error("Failed to fetch sprints:", err);
      setSprints([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sprints by project ID
  const getSprintsByProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/sprint/project/${projectId}`, config);
      
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch project sprints:", err);
      return [];
    }
  };

  // Fetch single sprint by ID
  const getSprintById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/sprint/${id}`, config);
      
      return response.data;
    } catch (err) {
      console.error("Failed to fetch sprint:", err);
      return null;
    }
  };

  // Create sprint
  const createSprint = async (sprintData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.post("/sprint", sprintData, config);
      
      const newSprint = response.data;
      setSprints((prev) => [...prev, newSprint]);
      return newSprint;
    } catch (err) {
      console.error("Failed to create sprint:", err);
      throw err;
    }
  };

  // Update sprint
  const updateSprint = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.put(`/sprint/${id}`, updates, config);
      
      const updatedSprint = response.data;
      setSprints((prev) => prev.map((s) => (s.sprintId === id ? updatedSprint : s)));
      return updatedSprint;
    } catch (err) {
      console.error("Failed to update sprint:", err);
      throw err;
    }
  };

  // Delete sprint
  const deleteSprint = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/sprint/${id}`, config);
      
      setSprints((prev) => prev.filter((s) => s.sprintId !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete sprint:", err);
      throw err;
    }
  };

  // Generate sprint name based on project
  const generateSprintName = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/sprint/generate-name/${projectId}`, config);
      
      return response.data.name;
    } catch (err) {
      console.error("Failed to generate sprint name:", err);
      
      // Fallback: generate name locally
      try {
        const projectResponse = await API.get(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        if (projectResponse.data) {
          const shortName = projectResponse.data.name.substring(0, 3).toUpperCase();
          return `${shortName}-S1`;
        }
      } catch (projectErr) {
        console.error("Failed to fetch project for fallback name generation:", projectErr);
      }
      
      throw new Error("Could not generate sprint name");
    }
  };

  // Auto-fetch sprints when user is ready
  useEffect(() => {
    if (!isLoading && user) {
      fetchSprints();
    }
  }, [user, isLoading]);

  return (
    <SprintContext.Provider
      value={{
        sprints,
        loading,
        fetchSprints,
        getSprintsByProject,
        getSprintById,
        createSprint,
        updateSprint,
        deleteSprint,
        generateSprintName,
      }}
    >
      {children}
    </SprintContext.Provider>
  );
}

export function useSprints() {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error("useSprints must be used within SprintProvider");
  }
  return context;
}