// src/contexts/TaskContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../components/auth/api";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(undefined);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, role, isLoading: authLoading } = useAuth();

  // --------------------
  // FETCH TASKS BASED ON ROLE
  // --------------------
  const fetchTasks = async () => {
    if (!user) return; // wait for user to load
    setLoading(true);
    try {
      let url = "";
      if (user.role !== "employee") {
        url = `/tasks/company/${user.companyId}`;
      } else {
        url = `/tasks/user/${user.userId}`;
      }

      const response = await API.get(url);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch tasks when user is loaded
  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [user, authLoading]);

  // --------------------
  // FETCH TASKS BY PROJECT
  // --------------------
  const getTasksByProjectId = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await API.get(`/tasks/project/${projectId}`);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks by project:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // CREATE TASK
  // --------------------
  const createTask = async (taskData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await API.post("/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // --------------------
  // UPDATE TASK
  // --------------------
  const updateTask = async (taskId, updates) => {
    const token = localStorage.getItem("token");
    try {
      const response = await API.put(`/tasks/${taskId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // --------------------
  // DELETE TASK
  // --------------------
  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // --------------------
  // ASSIGNEE FUNCTIONS
  // --------------------
  const assignUser = (taskId, assignee) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignees: [
                ...(task.assignees || []),
                { ...assignee, assignedAt: new Date().toISOString() },
              ],
            }
          : task
      )
    );
  };

  const unassignUser = (taskId, userId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignees: (task.assignees || []).filter(
                (a) => a.userId !== userId
              ),
            }
          : task
      )
    );
  };

  const deactivateAssignee = (taskId, userId, reason) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignees: (task.assignees || []).map((a) =>
                a.userId === userId
                  ? { ...a, isActive: false, inactiveReason: reason }
                  : a
              ),
            }
          : task
      )
    );
  };

  // --------------------
  // SUBTASK FUNCTIONS
  // --------------------
  const addSubtask = (taskId, subtaskData) => {
    const subtask = { id: Date.now(), completed: false, ...subtaskData };
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), subtask] }
          : task
      )
    );
  };

  const removeSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: (task.subtasks || []).filter(
                (st) => st.id !== subtaskId
              ),
            }
          : task
      )
    );
  };

  const updateSubtask = (taskId, subtaskId, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: (task.subtasks || []).map((st) =>
                st.id === subtaskId ? { ...st, ...updates } : st
              ),
            }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        getTasksByProjectId,
        createTask,
        updateTask,
        deleteTask,
        assignUser,
        unassignUser,
        deactivateAssignee,
        addSubtask,
        removeSubtask,
        updateSubtask,
      }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
}
