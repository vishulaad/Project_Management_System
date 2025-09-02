import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTasks } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";
import API from "../auth/api"; // ✅ import API for delete request
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ListChecks,
  User,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ViewTask() {
  const { id } = useParams();
  const { tasks, toggleSubtaskCompletion, deleteTask, fetchTasks } = useTasks();
  const { role } = useAuth();
  const navigate = useNavigate();

  const task = tasks.find((t) => t.taskId === parseInt(id));

  // ✅ Delete handler
  const handleDelete = async (taskId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this task?")) return;
      await API.delete(`/tasks/${taskId}`); // Call backend
      deleteTask(taskId);
      fetchTasks(); // Update context
      navigate("/tasks"); // Redirect after delete
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Error deleting task. Try again!");
    }
  };

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg">Task not found</p>
        <Link to="/projects" className="text-blue-500 underline">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 animate-fadeSlideUp"
      style={{ animationDuration: "0.6s", animationFillMode: "forwards" }}>
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeSlideUp delay-100">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">{task.title}</h1>
          <p className="text-blue-800">{task.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* ✅ Show Update/Delete only if role != Employee */}
          {role !== "employee" && (
            <>
              <button
                onClick={() => navigate(`/update-task/${task.taskId}`)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                <Pencil className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => handleDelete(task.taskId)} // ✅ merged delete API + context
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}

          <Link
            to={`/tasks`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
            <ArrowLeft className="w-5 h-5" /> Back to Project
          </Link>
        </div>
      </div>

      {/* Task Details */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-950">
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Assignees */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-300">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-950">Assignees</h2>
        </div>
        {task.assignees.length === 0 ? (
          <p className="text-blue-700">No assignees yet.</p>
        ) : (
          <ul className="space-y-2 text-blue-800">
            {task.assignees.map((a) => (
              <li key={a.userId} className="flex items-center gap-2">
                <span className="font-semibold">{a.userName}</span>
                <span className="text-sm text-slate-500">({a.role})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subtasks */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-6 animate-fadeSlideUp delay-400">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-950">Subtasks</h2>
        </div>

        {task.subtasks.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-10 h-10 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-700">No subtasks for this task yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {task.subtasks.map((st) => (
              <li
                key={st.subtaskId}
                className="flex items-center justify-between p-3 bg-white/70 border border-slate-200 rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-blue-900">{st.title}</p>
                  <p className="text-sm text-blue-700">
                    Due: {new Date(st.dueDate).toLocaleDateString()} —{" "}
                    {st.dueTime}
                  </p>
                </div>

                {/* Employee can mark complete */}
                <button
                  onClick={() =>
                    toggleSubtaskCompletion(task.taskId, st.subtaskId)
                  }
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition ${
                    st.completed
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-blue-100 hover:text-blue-800"
                  }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {st.completed ? "Completed" : "Mark Complete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
