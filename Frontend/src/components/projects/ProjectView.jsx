import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../contexts/ProjectContext";
import { Calendar, ArrowLeft, ListChecks } from "lucide-react";
import API from "../auth/api";

export default function ProjectView() {
  const { id, role } = useParams();
  const { projects } = useProjects();
  const [project, setProject] = useState(null);
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        let projectData = projects.find((p) => p.projectId === parseInt(id));

        if (!projectData) {
          const projectRes = await API.get(`/projects/${id}`, config);
          projectData = projectRes.data;
        }

        setProject(projectData);

        const tasksRes = await API.get(`/tasks/project/${id}`, config);
        setRelatedTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching project/tasks:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, projects]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/projects");
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project");
      }
    }
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;

  if (!project)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg">Project not found</p>
        <Link to="/projects" className="text-blue-500 underline">
          Go Back
        </Link>
      </div>
    );

  return (
    <div
      className="space-y-6 animate-fadeSlideUp"
      style={{ animationDuration: "0.6s", animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between animate-fadeSlideUp delay-100">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">{project.name}</h1>
          <p className="text-blue-800">{project.description}</p>
        </div>

        <div className="flex items-center gap-4">
          {role !== "Employee" && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/update-project/${project.projectId}`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Update
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          )}
          <Link
            to="/projects"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
            <ArrowLeft className="w-5 h-5" /> Back to Projects
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-950">
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Technologies:</strong> {project.technologies}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-900">Team Members</h2>
          <ul className="list-disc list-inside text-blue-800 mt-2">
            {Array.isArray(project.teamMembers) &&
            project.teamMembers.length > 0 ? (
              project.teamMembers.map((member, idx) => (
                <li key={idx}>
                  User ID: {member.userId} — Role: {member.role}
                </li>
              ))
            ) : (
              <li>No team members assigned</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-300">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-950">Tasks</h2>
        </div>

        {relatedTasks.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-10 h-10 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-700">No tasks for this project yet.</p>
          </div>
        ) : (
          relatedTasks.map((task, index) => (
            <div
              onClick={() => navigate(`/view-task/${task.taskId}`)}
              key={task.taskId}
              className="p-4 bg-white/70 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition animate-fadeSlideUp"
              style={{
                animationDelay: `${0.1 * index + 0.4}s`,
                animationFillMode: "forwards",
              }}>
              <h3 className="font-semibold text-lg text-blue-900">
                {task.title}
              </h3>
              <p className="text-blue-800 mb-2">{task.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-blue-700">
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <span>Status: {task.status}</span>
                <span>Priority: {task.priority}</span>
              </div>

              {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Subtasks:
                  </p>
                  <ul className="list-disc list-inside text-blue-700">
                    {task.subtasks.map((st) => (
                      <li key={st.subtaskId}>
                        {st.title} — {st.completed ? "✅ Done" : "❌ Pending"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(task.assignees) && task.assignees.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Assignees:
                  </p>
                  <ul className="list-disc list-inside text-blue-700">
                    {task.assignees.map((assignee) => (
                      <li key={assignee.userId}>
                        {assignee.userName} — {assignee.role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
