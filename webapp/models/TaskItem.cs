using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum TaskStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Blocked
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High
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

        [Column("due_date")]
        public DateTime? DueDate { get; set; }

        [Column("status")]
        public TaskStatus Status { get; set; } = TaskStatus.NotStarted;

        [Column("priority")]
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [ForeignKey("CreatedBy")]
        [Column("created_by")]
        public int CreatedById { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        public Project Project { get; set; } = null!;
        public Company Company { get; set; } = null!;
        public User CreatedBy { get; set; } = null!;

        public ICollection<TaskAssignee> Assignees { get; set; } = new List<TaskAssignee>();
        public ICollection<Subtask> Subtasks { get; set; } = new List<Subtask>();
    }
}
