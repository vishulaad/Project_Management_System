// contexts/StoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../components/auth/api";

const StoryContext = createContext();

export function StoryProvider({ children }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading } = useAuth();

  // Fetch stories by project
  const getStoriesByProject = async (projectId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/stories/project/${projectId}`, config);
      
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch project stories:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch stories by sprint
  const getStoriesBySprint = async (sprintId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/stories/sprint/${sprintId}`, config);
      
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch sprint stories:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single story by ID
  const getStoryById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get(`/stories/${id}`, config);
      
      return response.data;
    } catch (err) {
      console.error("Failed to fetch story:", err);
      return null;
    }
  };

  // Create story
  const createStory = async (storyData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.post("/stories", storyData, config);
      
      const newStory = response.data;
      setStories((prev) => [...prev, newStory]);
      return newStory;
    } catch (err) {
      console.error("Failed to create story:", err);
      throw err;
    }
  };

  // Update story
  const updateStory = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.put(`/stories/${id}`, updates, config);
      
      const updatedStory = response.data;
      setStories((prev) => prev.map((s) => (s.storyId === id ? updatedStory : s)));
      return updatedStory;
    } catch (err) {
      console.error("Failed to update story:", err);
      throw err;
    }
  };

  // Delete story
  const deleteStory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/stories/${id}`, config);
      
      setStories((prev) => prev.filter((s) => s.storyId !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete story:", err);
      throw err;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        loading,
        getStoriesByProject,
        getStoriesBySprint,
        getStoryById,
        createStory,
        updateStory,
        deleteStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStories() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStories must be used within StoryProvider");
  }
  return context;
}