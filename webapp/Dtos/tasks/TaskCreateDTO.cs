using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using webapp.Models;

namespace webapp.DTOs.Tasks
{
    using TaskStatusEnum = webapp.Models.TaskStatus;

    public class TaskCreateDTO
    {
        [Required]
        [StringLength(255)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Todo;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public int ProjectId { get; set; }
       public Project Project { get; set; } = null!;

        public int? CompanyId { get; set; }
        public Company Company { get; set; } = null!;

          public int CreatedById { get; set; }
           public User CreatedBy { get; set; } = null!;


        // 🔥 Sprint ke sath link karne ke liye
        public int? SprintId { get; set; }
         public int? EstimatedHours { get; set; }

        public List<SubtaskCreateDTO>? Subtasks { get; set; }
        public List<TaskAssigneeCreateDTO>? Assignees { get; set; }
    }

    public class SubtaskCreateDTO
    {
        [Required]
        [StringLength(255)]
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public TimeSpan? DueTime { get; set; }
        public bool Completed { get; set; } = false;
    }

    public class TaskAssigneeCreateDTO
    {
        [Required]
        public int UserId { get; set; }
        public string? Role { get; set; }
        public DateTime? AssignedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}
