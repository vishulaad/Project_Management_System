using System;

namespace webapp.DTOs.ProjectTeamMembers
{
    public class ProjectTeamMemberReadDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string Role { get; set; } = null!;
        public DateTime AssignedAt { get; set; } // Make non-nullable for easier usage

        // Related info
        public string ProjectName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
    }
}
