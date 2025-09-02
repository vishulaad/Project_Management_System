import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProjectsPage } from "./components/projects/ProjectsPage";
import TasksPage from "./components/tasks/TasksPage";
import { LeavesPage } from "./components/leaves/LeavesPage";
import CreateProject from "./components/projects/CreateProject";
import Tasks from "./components/tasks/Tasks";
import MainLayout from "./pages/MainLayout";
import { LoginPage } from "./components/auth/LoginPage";
import Error from "./components/Design/Error";
import Loader from "./components/Design/Loader";
import ProjectView from "./components/projects/ProjectView";
import ViewTask from "./components/tasks/ViewTask";
import { RegisterPage } from "./components/auth/RegisterPage";
import TeamMember from "./components/auth/TeamMember";
import { SprintKanbanBoard } from "./components/sprints/SprintKanbanBoard"; 
import { CreateSprint } from "./components/sprints/CreateSprint";

import { useAuth } from "./contexts/AuthContext"; // 

function App() {
  const { role } = useAuth(); // 
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />

       
        {role !== "employee" && (
          <>
            <Route path="/leaves" element={<LeavesPage />} />
            <Route path="/members" element={<TeamMember />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/update-project/:id" element={<CreateProject />} />
            <Route path="/update-task/:id" element={<Tasks />} />
            <Route path="/create-task" element={<Tasks />} />
            <Route path="/sprints/:sprintId" element={<SprintKanbanBoard />} />
             <Route path="/sprints/create" element={<CreateSprint />} />
             <Route path="/edit-sprint/:id" element={<CreateSprint />} />
             <Route path="/create-sprint" element={<CreateSprint />} />
             <Route path="/sprint/:sprintId" element={<SprintKanbanBoard />} />
            
          </>
        )}

        {/* Common Routes */}
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/view-task/:id" element={<ViewTask />} />
      </Route>

      {/* Others */}
      <Route path="/loading" element={<Loader />} />
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}

export default App;
