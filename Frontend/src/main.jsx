import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ProjectProvider } from "./contexts/ProjectContext";
import { CompanyProvider } from "./contexts/CompanyContext.jsx";
import { LeaveProvider } from "./contexts/LeaveContext.jsx";
import { TaskProvider } from "./contexts/TaskContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <TaskProvider>
      <LeaveProvider>
        <CompanyProvider>
          <ProjectProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProjectProvider>
        </CompanyProvider>
      </LeaveProvider>
    </TaskProvider>
  </AuthProvider>
);
