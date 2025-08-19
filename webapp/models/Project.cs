using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum ProjectStatus
    {
        NotStarted,
        InProgress,
        Completed,
        OnHold
    }

    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; } = null!;

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("end_date")]
        public DateTime? EndDate { get; set; }

        [Column("status")]
        [MaxLength(20)]
        public ProjectStatus Status { get; set; } = ProjectStatus.NotStarted;

        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [ForeignKey("CreatedBy")]
        [Column("created_by")]
        public int CreatedById { get; set; }

        [Column("technologies", TypeName = "varchar(255)")]
        public string? Technologies { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Company Company { get; set; } = null!;
        public User CreatedBy { get; set; } = null!;

        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public ICollection<ProjectTeamMember> TeamMembers { get; set; } = new List<ProjectTeamMember>();
    }
}
