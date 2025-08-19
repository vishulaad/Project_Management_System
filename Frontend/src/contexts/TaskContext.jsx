import React, { createContext, useContext, useState } from "react";

const TaskContext = createContext(undefined);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([
    // Tasks for Project 1
    {
      id: 1,
      title: "Design Homepage Layout",
      description: "Create wireframes and mockups for the new homepage design",
      dueDate: "2025-09-15",
      status: "In Progress",
      priority: "High",
      projectId: 1,
      companyId: 1,
      createdBy: 1,
      assignees: [
        {
          userId: 2,
          role: "Developer",
          assignedAt: "2025-10-16",
          isActive: true,
        },
      ],
      subtasks: [
        {
          id: 101,
          title: "Header Section",
          dueDate: "2025-08-12",
          dueTime: "10:00",
          completed: false,
        },
      ],
      createdAt: "2024-01-16",
    },
    {
      id: 2,
      title: "Setup Development Environment",
      description: "Configure development tools and dependencies",
      dueDate: "2024-02-10",
      status: "Completed",
      priority: "Medium",
      projectId: 1,
      companyId: 1,
      createdBy: 1,
      assignees: [
        {
          userId: 3,
          role: "Developer",
          assignedAt: "2025-08-20",
          isActive: true,
        },
      ],
      comments: [],
      subtasks: [],
      createdAt: "2024-01-20",
    },

    // Tasks for Project 2
    {
      id: 3,
      title: "Setup Firebase Project",
      description:
        "Create Firebase project, configure authentication & database",
      dueDate: "2025-08-13",
      status: "Planned",
      priority: "High",
      projectId: 2,
      companyId: 1,
      createdBy: 2,
      assignees: [
        {
          userId: 3,
          role: "Developer",
          assignedAt: "2024-02-02",
          isActive: true,
        },
      ],
      subtasks: [
        {
          id: 201,
          title: "Enable Firestore",
          dueDate: "2024-02-08",
          dueTime: "14:00",
          completed: false,
        },
      ],
      createdAt: "2024-02-02",
    },
    {
      id: 4,
      title: "Build Authentication Screens",
      description: "Login, Register, Forgot Password screens",
      dueDate: "2024-03-05",
      status: "Planned",
      priority: "Medium",
      projectId: 2,
      companyId: 1,
      createdBy: 2,
      assignees: [
        {
          userId: 2,
          role: "Manager",
          assignedAt: "2024-02-03",
          isActive: true,
        },
      ],
      comments: [],
      subtasks: [],
      createdAt: "2024-02-03",
    },
  ]);

  // --------------------
  // TASK CRUD
  // --------------------
  const createTask = (taskData) => {
    const formatSubtask = (subtask) => ({
      id: Date.now() + Math.random(), // unique ID for each subtask
      completed: false,
      ...subtask,
    });

    const newTask = {
      ...taskData,
      id: Date.now(),
      assignees: taskData.assignees || [],
      comments: taskData.comments || [],
      subtasks: (taskData.subtasks || []).map(formatSubtask),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
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
                ...task.assignees,
                {
                  ...assignee,
                  assignedAt: new Date().toISOString().split("T")[0],
                },
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
              assignees: task.assignees.filter(
                (assignee) => assignee.userId !== userId
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
              assignees: task.assignees.map((assignee) =>
                assignee.userId === userId
                  ? { ...assignee, isActive: false, inactiveReason: reason }
                  : assignee
              ),
            }
          : task
      )
    );
  };

  const addSubtask = (taskId, subtaskData) => {
    const formattedSubtask = {
      id: Date.now(),
      completed: false,
      ...subtaskData,
    };

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [...task.subtasks, formattedSubtask],
            }
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
              subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
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
              subtasks: task.subtasks.map((st) =>
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
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
