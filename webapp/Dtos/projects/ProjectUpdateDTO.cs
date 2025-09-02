using System;
using System.Collections.Generic;
using webapp.Models;
using webapp.DTOs.ProjectTeamMembers;

namespace webapp.DTOs.Projects
{
    public class ProjectUpdateDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public ProjectStatus? Status { get; set; }
        public int? CompanyId { get; set; }
        public int? CreatedById { get; set; }
        public string? Technologies { get; set; }

        // New property for updating team members
        public List<ProjectTeamMemberUpdateDTO>? TeamMembers { get; set; }
    }
}
