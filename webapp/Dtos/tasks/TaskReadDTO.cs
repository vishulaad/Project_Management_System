using System;
using System.Collections.Generic;

namespace webapp.DTOs.Tasks
{
    public class TaskReadDTO
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public int ProjectId { get; set; }
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string? ProjectName { get; set; }
        public string? CompanyName { get; set; }
        public string? CreatedByName { get; set; }
        public int SubtaskCount { get; set; }
        public int AssigneeCount { get; set; }

        public List<SubtaskReadDTO> Subtasks { get; set; } = new List<SubtaskReadDTO>();

        // **Add Assignees**
        public List<TaskAssigneeReadDTO> Assignees { get; set; } = new List<TaskAssigneeReadDTO>();
    }

    public class SubtaskReadDTO
    {
        public int SubtaskId { get; set; }
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public TimeSpan? DueTime { get; set; }
        public bool Completed { get; set; }
    }

    public class TaskAssigneeReadDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string? Role { get; set; }
        public DateTime? AssignedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
