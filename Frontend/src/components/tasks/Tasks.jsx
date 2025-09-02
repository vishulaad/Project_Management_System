import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, ArrowLeft, Plus, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../../contexts/TaskContext";
import { useCompany } from "../../contexts/CompanyContext";
import { useProjects } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import API from "../auth/api";

const Tasks = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const { members } = useCompany();
  const { fetchTasks } = useTasks();
  const { projects } = useProjects();

  const [editingTaskId, setEditingTaskId] = useState(null);

  const statusOptions = [
    { value: "NotStarted", label: "To Do" },
    { value: "InProgress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Blocked", label: "Blocked" },
  ];

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "NotStarted",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    projectId: "",
    subtasks: [],
  });

  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtaskDate, setSubtaskDate] = useState("");
  const [subtaskTime, setSubtaskTime] = useState("");
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setEmployees(members);
  }, [members]);

  // ✅ Fetch task details when editing
  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const task = res.data;

        setNewTask({
          title: task.title || "",
          description: task.description || "",
          status: task.status || "NotStarted",
          assignedTo: task.assignees?.[0]?.userId?.toString() || "",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "",
          priority: task.priority || "Medium",
          projectId: task.projectId?.toString() || "",
          subtasks: (task.subtasks || []).map((st) => ({
            id: st.id || Date.now(),
            title: st.title,
            dueDate: st.dueDate
              ? new Date(st.dueDate).toISOString().split("T")[0]
              : "",
            dueTime: st.dueTime ? st.dueTime.slice(0, 5) : "",
            completed: st.completed || false,
          })),
        });
        setEditingTaskId(task.id);
      } catch (error) {
        console.error(
          "❌ Failed to fetch task:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchTaskById();
    }
  }, [isEditMode, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim() || !subtaskDate || !subtaskTime) return;
    setNewTask((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        {
          id: Date.now(),
          title: subtaskInput,
          dueDate: subtaskDate,
          dueTime: subtaskTime,
          completed: false,
        },
      ],
    }));
    setSubtaskInput("");
    setSubtaskDate("");
    setSubtaskTime("");
  };

  const handleRemoveSubtask = (id) => {
    setNewTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== id),
    }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (
      !newTask.title ||
      !newTask.assignedTo ||
      !newTask.dueDate ||
      !newTask.projectId
    )
      return;

    const formattedSubtasks = newTask.subtasks.map((st) => ({
      title: st.title,
      dueDate: new Date(st.dueDate).toISOString(),
      dueTime: st.dueTime.length === 5 ? `${st.dueTime}:00` : st.dueTime,
      completed: st.completed || false,
    }));

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      dueDate: new Date(newTask.dueDate).toISOString(),
      priority: newTask.priority,
      projectId: Number(newTask.projectId),
      companyId: user.companyId,
      createdById: user.userId,
      assignees: [
        {
          userId: Number(newTask.assignedTo),
          role: "Developer",
          assignedAt: new Date().toISOString(),
          isActive: true,
        },
      ],
      subtasks: formattedSubtasks,
    };

    try {
      const token = localStorage.getItem("token");
      if (isEditMode) {
        await API.put(`/tasks/${id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post(`/tasks`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchTasks();
      navigate("/tasks");
    } catch (error) {
      console.error(
        "❌ Task submit failed:",
        error.response?.data || error.message
      );
    }

    setNewTask({
      title: "",
      description: "",
      status: "NotStarted",
      assignedTo: employees[0]?.userId?.toString() || "",
      dueDate: "",
      priority: "Medium",
      projectId: "",
      subtasks: [],
    });
    setEditingTaskId(null);
    navigate("/tasks");
  };

  const inputClasses =
    "w-full bg-white/70 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-blue-800 mb-1.5";

  if (loading) {
    return (
      <div className="p-8 text-center text-blue-800">
        Loading task details...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-950">Manage Tasks</h2>
            <p className="text-sm text-blue-800">
              Add, edit, or remove tasks from your workflow.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80">
          <div className="p-8 border-b border-slate-200/80">
            <form onSubmit={handleSubmitTask}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className={labelClasses}>
                    Task Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="e.g., Deploy to production server"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className={labelClasses}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter task details here..."
                    rows={3}
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className={labelClasses}>
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className={inputClasses}>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Dropdown */}
                <div>
                  <label htmlFor="projectId" className={labelClasses}>
                    Project
                  </label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={newTask.projectId}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required>
                    <option value="">-- Select Project --</option>
                    {projects.map((proj) => (
                      <option key={proj.projectId} value={proj.projectId}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign To */}
                <div>
                  <label htmlFor="assignedTo" className={labelClasses}>
                    Assign To
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required>
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.userId} value={emp.userId}>
                        {`${emp.firstName} ${emp.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className={labelClasses}>
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className={inputClasses}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className={labelClasses}>
                    Main Task Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>

                {/* Subtasks */}
                <div className="md:col-span-2">
                  <label className={labelClasses}>Subtasks</label>
                  <div className="flex flex-col md:flex-row gap-2 items-start">
                    <input
                      type="text"
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      className={inputClasses}
                      placeholder="Enter subtask"
                    />
                    <input
                      type="date"
                      value={subtaskDate}
                      onChange={(e) => setSubtaskDate(e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="time"
                      value={subtaskTime}
                      onChange={(e) => setSubtaskTime(e.target.value)}
                      className={inputClasses}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1 transition-all shadow-sm">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {newTask.subtasks.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {newTask.subtasks.map((st) => (
                        <li
                          key={st.id}
                          className="flex justify-between items-center bg-white border rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all">
                          <div>
                            <p className="font-medium text-gray-800">
                              {st.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Due: {st.dueDate} at {st.dueTime}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  {isEditMode ? (
                    <>
                      <Check className="w-5 h-5" /> Update Task
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" /> Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
