using System;
using webapp.Models;

namespace webapp.DTOs.ProjectTeamMembers
{
    public class ProjectTeamMemberCreateDTO
    {
        public int ProjectId { get; set; } 
        public int UserId { get; set; }
        public ProjectTeamRole Role { get; set; }
        public DateTime? AssignedAt { get; set; } 
    }
}
