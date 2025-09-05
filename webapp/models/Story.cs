using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum StoryStatus
    {
        Backlog,
        InProgress,
        InReview,
        Done
    }

    public enum StoryPriority
    {
        Low,
        Medium,
        High,
        Critical
    }

    [Table("stories")]
    public class Story
    {
        [Key]
        [Column("story_id")]
        public int StoryId { get; set; }

        [Required]
        [Column("title", TypeName = "varchar(255)")]
        public string Title { get; set; } = null!;

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }

        [Column("acceptance_criteria", TypeName = "text")]
        public string? AcceptanceCriteria { get; set; }

        [Column("story_points")]
        public int StoryPoints { get; set; } = 0;

        [Column("priority")]
        public StoryPriority Priority { get; set; } = StoryPriority.Medium;

        [Column("status")]
        public StoryStatus Status { get; set; } = StoryStatus.Backlog;

        // Foreign Keys
        [ForeignKey("Sprint")]
        [Column("sprint_id")]
        public int? SprintId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [ForeignKey("CreatedBy")]
        [Column("created_by")]
        public int CreatedById { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Sprint? Sprint { get; set; }
        public Project Project { get; set; } = null!;
        public User CreatedBy { get; set; } = null!;
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}