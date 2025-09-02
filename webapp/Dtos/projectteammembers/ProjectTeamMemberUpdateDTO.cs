using System;
using webapp.Models;

namespace webapp.DTOs.ProjectTeamMembers
{
    public class ProjectTeamMemberUpdateDTO
    {
        public int? Id { get; set; }           // For updating existing members
        public int? UserId { get; set; }       // For adding new members
        public ProjectTeamRole? Role { get; set; }
        public DateTime? AssignedAt { get; set; }
    }
}
