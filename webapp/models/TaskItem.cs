using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum TaskStatus
    {
        Todo,
        InProgress,
        InReview,
        Completed,
        Blocked
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Critical
    }

    [Table("tasks")]
    public class Task
    {
        [Key]
        [Column("task_id")]
        public int TaskId { get; set; }

        [Required]
        [Column("title", TypeName = "varchar(255)")]
        public string Title { get; set; } = null!;

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }

        [Column("status")]
        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        [Column("priority")]
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [Column("due_date")]
        public DateTime? DueDate { get; set; }

        [Column("estimated_hours")]
        public decimal? EstimatedHours { get; set; }

        [Column("actual_hours")]
        public decimal? ActualHours { get; set; }

        // Foreign Keys
        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [ForeignKey("Sprint")]
        [Column("sprint_id")]
        public int? SprintId { get; set; }

        [ForeignKey("Story")]
        [Column("story_id")]
        public int? StoryId { get; set; }

        [ForeignKey("CreatedBy")]
        [Column("created_by")]
        public int CreatedById { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

           public int? CompanyId { get; set; }
    public Company? Company { get; set; }

        // Navigation Properties
        public Project Project { get; set; } = null!;
        public Sprint? Sprint { get; set; }
        public Story? Story { get; set; }
        public User CreatedBy { get; set; } = null!;
        public ICollection<TaskAssignee> Assignees { get; set; } = new List<TaskAssignee>();
        public ICollection<Subtask> Subtasks { get; set; } = new List<Subtask>();
    }
}