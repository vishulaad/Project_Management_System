import React, { useEffect } from "react";
import { FolderOpen, CheckSquare, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useProjects } from "../../contexts/ProjectContext";
import { useTasks } from "../../contexts/TaskContext";
import { useCompany } from "../../contexts/CompanyContext";
import { useLeaves } from "../../contexts/LeaveContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../Design/DashboardCard";

export function Dashboard() {
  const { user, role, isLoading: authLoading } = useAuth();
  const { projects, getProject } = useProjects();
  const { tasks } = useTasks();
  const { members, getMembers, isLoading: membersLoading } = useCompany();
  const { leaves } = useLeaves();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (!authLoading && user?.companyId && role === "admin") {
      getMembers(user.companyId);
      getProject();
    }
  }, [user, role, authLoading]);

  if (authLoading || (role === "admin" && membersLoading)) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading dashboard...
      </div>
    );
  }

  const stats = [
    {
      name: "Total Projects",
      value: projects.length,
      icon: FolderOpen,
      link: "/projects",
    },
    {
      name: "Active Tasks",
      value: tasks.length,
      icon: CheckSquare,
      link: "/tasks",
    },
    ...(role !== "employee"
      ? [
          {
            name: "Team Members",
            value: members.length,
            icon: Users,
            link: "/members",
          },
          {
            name: "Leaves Status",
            value: leaves.length,
            icon: Calendar,
            link: "/leaves",
          },
        ]
      : []),
  ];

  const recentProjects = projects.slice(-5);
  const today = new Date();
  const upcomingTasks = tasks
    .filter((t) => new Date(t.dueDate) > today)
    .slice(0, 5);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="min-h-screen space-y-8"
      initial="hidden"
      animate="visible">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
        <p className="text-blue-800 mt-1">
          Overview of your project management activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={`stat-${i}-${stat.name}`}
            variants={cardVariants}
            custom={i}
            onClick={() => navigate(stat.link)}
            whileHover={{ scale: 1.05 }}
            className="transition-transform duration-300 cursor-pointer">
            <DashboardCard
              name={stat.name}
              value={stat.value}
              icon={stat.icon}
              link={stat.link}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-slate-200/80 lg:col-span-2"
          variants={cardVariants}
          custom={0.5}>
          <h3 className="text-lg font-semibold text-blue-950 mb-4">
            Recent Projects
          </h3>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-blue-600">No recent projects</p>
            ) : (
              recentProjects.map((project, i) => (
                <motion.div
                  key={`project-${project.project_id}-${i}`}
                  onClick={() => navigate(`/project/${project.project_id}`)}
                  variants={cardVariants}
                  custom={i * 0.2 + 0.6}
                  className="flex items-center justify-between p-3 hover:bg-blue-50/70 rounded-lg transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {project.name}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {project.teamMembers?.length || 0} team members
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "In Progress"
                        ? "bg-blue-200 text-blue-800"
                        : project.status === "On Hold"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                    {project.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-slate-200/80"
          variants={cardVariants}
          custom={0.8}>
          <h3 className="text-lg font-semibold text-blue-950 mb-4">
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-blue-600">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task, i) => (
                <motion.div
                  key={`task-${task.id}-${i}`}
                  onClick={() => navigate(`/view-task/${task.id}`)}
                  variants={cardVariants}
                  custom={i * 0.2 + 1}
                  className="flex items-center justify-between p-3 hover:bg-blue-50/70 rounded-lg transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-blue-900">{task.title}</h4>
                    <p className="text-sm text-blue-600">
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {task.priority}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
