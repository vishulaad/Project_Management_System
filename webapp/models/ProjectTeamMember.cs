using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum ProjectTeamRole
    {
        Manager,
        Contributor,
        Viewer
    }

    [Table("project_team_members")]
    public class ProjectTeamMember
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("role")]
        public ProjectTeamRole Role { get; set; }

        [Column("assigned_at", TypeName = "datetime")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Project Project { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
