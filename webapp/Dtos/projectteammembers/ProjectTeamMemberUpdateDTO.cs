using System;
using webapp.Models;

namespace webapp.DTOs.ProjectTeamMembers
{
    public class ProjectTeamMemberUpdateDTO
    {
        public int Id { get; set; } 
        public ProjectTeamRole? Role { get; set; }
        public DateTime? AssignedAt { get; set; } 
    }
}
