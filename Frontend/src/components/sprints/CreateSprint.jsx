// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Calendar, Save, X } from "lucide-react";

// export function CreateSprint() {
//   const [loading, setLoading] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     projectId: "",
//     startDate: "",
//     endDate: "",
//     status: "Planned",
//     description: ""
//   });

//   // Load projects on component mount
//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
        
//         if (!token || !user) return;

//         let response;
        
//         if (user.role?.toLowerCase() === "employee") {
//           response = await fetch(`/api/projects/user/${user.userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//         } else {
//           response = await fetch(`/api/projects/company/${user.companyId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//         }
        
//         if (response.ok) {
//           const data = await response.json();
//           setProjects(data);
//         }
//       } catch (error) {
//         console.error("Failed to load projects:", error);
//       }
//     };

//     loadProjects();

//     // Get projectId from URL if present
//     const urlParams = new URLSearchParams(window.location.search);
//     const projectId = urlParams.get("projectId");
//     if (projectId) {
//       setFormData(prev => ({ ...prev, projectId }));
//     }
//   }, []);

//   // Generate sprint name when project is selected
//   useEffect(() => {
//     const generateSprintName = async () => {
//       if (formData.projectId) {
//         try {
//           const token = localStorage.getItem("token");
//           const response = await fetch(`/api/sprint/generate-name/${formData.projectId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
          
//           if (response.ok) {
//             const { name } = await response.json();
//             setFormData(prev => ({ ...prev, name }));
//           } else {
//             // Fallback: generate name locally
//             const selectedProject = projects.find(p => p.projectId === parseInt(formData.projectId));
//             if (selectedProject) {
//               const shortName = selectedProject.name.substring(0, 3).toUpperCase();
//               setFormData(prev => ({ ...prev, name: `${shortName}-S1` }));
//             }
//           }
//         } catch (error) {
//           console.error("Failed to generate sprint name:", error);
//         }
//       }
//     };

//     generateSprintName();
//   }, [formData.projectId, projects]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user") || "{}");

//       const sprintData = {
//         name: formData.name,
//         description: formData.description,
//         startDate: new Date(formData.startDate).toISOString(),
//         endDate: new Date(formData.endDate).toISOString(),
//         status: formData.status,
//         projectId: parseInt(formData.projectId),
//         companyId: user.companyId,
//         createdById: user.userId
//       };

//       const response = await fetch("/api/sprint", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(sprintData)
//       });

//       if (response.ok) {
//         const newSprint = await response.json();
//         alert("Sprint created successfully!");
        
//         // Navigate back to project view
//         window.location.href = `/project/${formData.projectId}`;
//       } else {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to create sprint");
//       }
//     } catch (error) {
//       console.error("Error creating sprint:", error);
//       alert("Failed to create sprint. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     const projectId = formData.projectId || new URLSearchParams(window.location.search).get("projectId");
//     if (projectId) {
//       window.location.href = `/project/${projectId}`;
//     } else {
//       window.location.href = "/projects";
//     }
//   };

//   const isFormValid = () => {
//     return formData.projectId && formData.startDate && formData.endDate && formData.name;
// };
//   const inputClasses = "w-full bg-white/70 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-400";
//   const labelClasses = "block text-sm font-medium text-blue-800 mb-1.5";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="relative mb-6 flex items-center justify-center">
//           <button
//             onClick={handleCancel}
//             className="absolute left-0 p-2 text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-blue-950">Create New Sprint</h1>
//             <p className="text-sm text-blue-800">Set up a new sprint for your project</p>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-8">
//           <div className="space-y-6">
//             {/* Project Selection */}
//             <div>
//               <label htmlFor="projectId" className={labelClasses}>
//                 Select Project <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="projectId"
//                 name="projectId"
//                 value={formData.projectId}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 required
//               >
//                 <option value="">-- Choose Project --</option>
//                 {projects.map(project => (
//                   <option key={project.projectId} value={project.projectId}>
//                     {project.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sprint Name */}
//             <div>
//               <label htmlFor="name" className={labelClasses}>
//                 Sprint Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="Sprint name will be auto-generated"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Sprint name is automatically generated based on project selection
//               </p>
//             </div>

//             {/* Date Range */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="startDate" className={labelClasses}>
//                   Start Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="startDate"
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   className={inputClasses}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="endDate" className={labelClasses}>
//                   End Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="endDate"
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   min={formData.startDate}
//                   className={inputClasses}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Status */}
//             <div>
//               <label htmlFor="status" className={labelClasses}>
//                 Initial Status
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//               >
//                 <option value="Planned">Planned</option>
//                 <option value="Active">Active</option>
//                 <option value="Upcoming">Upcoming</option>
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className={labelClasses}>
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className={inputClasses}
//                 placeholder="Describe the goals and objectives of this sprint..."
//               />
//             </div>

//             {/* Sprint Duration Info */}
//             {formData.startDate && formData.endDate && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="w-4 h-4 text-blue-600" />
//                   <span className="text-sm font-medium text-blue-800">Sprint Duration</span>
//                 </div>
//                 <p className="text-blue-700 text-sm">
//                   This sprint will run for {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
//                 </p>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
//               >
//                 <X className="w-5 h-5" />
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={!isFormValid() || loading}
//                 className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Save className="w-5 h-5" />
//                 )}
//                 {loading ? "Creating..." : "Create Sprint"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tips Section */}
//         <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-xl border border-slate-200/80 p-6">
//           <h3 className="text-lg font-semibold text-blue-950 mb-3">Sprint Planning Tips</h3>
//           <ul className="space-y-2 text-sm text-blue-800">
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               Keep sprints between 1-4 weeks for optimal productivity
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               Sprint names follow the format: ProjectShortName-S[Number] (e.g., EMS-S1)
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               Define clear goals and deliverables for each sprint
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               You can add tasks to the sprint after creation via the Kanban board
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
//   }

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, Save, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectContext";
import API from "../auth/api";

export function CreateSprint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { projects, getProject } = useProjects();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    startDate: "",
    endDate: "",
    status: "Planned",
    description: ""
  });

  // Set projectId from URL params on component mount
  useEffect(() => {
    const projectIdFromUrl = searchParams.get("projectId");
    if (projectIdFromUrl) {
      setFormData(prev => ({ 
        ...prev, 
        projectId: String(projectIdFromUrl) 
      }));
    }
  }, [searchParams]);

  // Ensure projects are loaded
  useEffect(() => {
    if (!projects || projects.length === 0) {
      getProject(); // Load projects if not already loaded
    }
  }, [projects, getProject]);

  // Generate sprint name when project is selected
  useEffect(() => {
    const generateSprintName = async () => {
      if (formData.projectId && projects.length > 0) {
        try {
          const token = localStorage.getItem("token");
          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          // Try to get generated name from API
          try {
            const response = await API.get(`/sprint/generate-name/${formData.projectId}`, config);
            setFormData(prev => ({ ...prev, name: response.data.name }));
          } catch (apiError) {
            // Fallback: generate name locally
            const selectedProject = projects.find(
              p => String(p.projectId) === String(formData.projectId)
            );
            if (selectedProject) {
              const shortName = selectedProject.name.substring(0, 3).toUpperCase();
              setFormData(prev => ({ ...prev, name: `${shortName}-S1` }));
            }
          }
        } catch (error) {
          console.error("Failed to generate sprint name:", error);
        }
      }
    };

    generateSprintName();
  }, [formData.projectId, projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        throw new Error("Authentication required");
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const sprintData = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
        projectId: parseInt(formData.projectId),
        companyId: user.companyId,
        createdById: user.userId
      };

      const response = await API.post("/sprint", sprintData, config);
      
      if (response.data) {
        alert("Sprint created successfully!");
        // Navigate back to project view
        navigate(`/project/${formData.projectId}`);
      }
    } catch (error) {
      console.error("Error creating sprint:", error);
      const errorMessage = error.response?.data?.message || "Failed to create sprint. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const projectId = formData.projectId || searchParams.get("projectId");
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  const isFormValid = () => {
    return formData.projectId && formData.startDate && formData.endDate && formData.name.trim();
  };

  const inputClasses = "w-full bg-white/70 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-400";
  const labelClasses = "block text-sm font-medium text-blue-800 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={handleCancel}
            className="absolute left-0 p-2 text-blue-800 hover:bg-blue-100/70 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-950">Create New Sprint</h1>
            <p className="text-sm text-blue-800">Set up a new sprint for your project</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Selection */}
            <div>
              <label htmlFor="projectId" className={labelClasses}>
                Select Project <span className="text-red-500">*</span>
              </label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                className={inputClasses}
                required
              >
                <option value="">-- Choose Project --</option>
                {projects && projects.length > 0 ? (
                  projects.map(project => (
                    <option key={project.projectId} value={String(project.projectId)}>
                      {project.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading projects...</option>
                )}
              </select>
              {projects && projects.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No projects available. Please create a project first.
                </p>
              )}
            </div>

            {/* Sprint Name */}
            <div>
              <label htmlFor="name" className={labelClasses}>
                Sprint Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Sprint name is automatically generated based on project selection"
              />
            </div>
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="startDate" className={labelClasses}>
                   Start Date <span className="text-red-500">*</span>
                 </label>
                 <input
                  id="startDate"
                   type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className={labelClasses}>
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

             
             <div>
               <label htmlFor="status" className={labelClasses}>
                Initial Status
               </label>
               <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={inputClasses}
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

             {/* Description */}
             <div>
               <label htmlFor="description" className={labelClasses}>
                 Description
               </label>
               <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={inputClasses}
                placeholder="Describe the goals and objectives of this sprint..."
              />
             </div> 


            {/* Sprint Duration Info */}
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Sprint Duration</span>
                </div>
                <p className="text-blue-700 text-sm">
                  This sprint will run for{" "}
                  {Math.ceil(
                    (new Date(formData.endDate) - new Date(formData.startDate)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? "Creating..." : "Create Sprint"}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-xl border border-slate-200/80 p-6">
          <h3 className="text-lg font-semibold text-blue-950 mb-3">Sprint Planning Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Keep sprints between 1-4 weeks for optimal productivity
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Sprint names follow the format: ProjectShortName-S[Number] (e.g., EMS-S1)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Define clear goals and deliverables for each sprint
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              You can add tasks to the sprint after creation via the Kanban board
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}