using System;
using System.Collections.Generic;
using webapp.Models;
using webapp.DTOs.ProjectTeamMembers;

namespace webapp.DTOs.Projects
{
    public class ProjectCreateDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public ProjectStatus? Status { get; set; } // default NotStarted if null
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
        public string? Technologies { get; set; }

        // New property for team members
        public List<ProjectTeamMemberCreateDTO>? TeamMembers { get; set; }
    }
}
