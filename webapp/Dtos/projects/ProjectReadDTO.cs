using System;
using System.Collections.Generic;
using webapp.DTOs.ProjectTeamMembers;

namespace webapp.DTOs.Projects
{
    public class ProjectReadDTO
    {
        public int ProjectId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = null!; // serialize enum as string
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
        public string? Technologies { get; set; }
        public DateTime? CreatedAt { get; set; }

        // Related/Computed
        public string CompanyName { get; set; } = null!;
        public string CreatedByName { get; set; } = null!;
        public int TaskCount { get; set; }
        public int TeamCount { get; set; }

        // List of team members
        public List<ProjectTeamMemberReadDTO>? TeamMembers { get; set; }
    }
}
