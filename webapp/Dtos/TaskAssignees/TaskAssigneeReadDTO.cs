using System;

namespace webapp.DTOs.TaskAssignees
{
    public class TaskAssigneeReadDTO
    {
        public int Id { get; set; }

        public int TaskId { get; set; }

        public int UserId { get; set; }

        public string? Role { get; set; }

        public DateTime? AssignedAt { get; set; }

        public bool? IsActive { get; set; }

        // Related/Computed info
        public string? TaskTitle { get; set; }

        public string? UserName { get; set; }

        public string? UserEmail { get; set; }

        // Optional: constructor for mapping from entity
        public TaskAssigneeReadDTO() { }

        public TaskAssigneeReadDTO(webapp.Models.TaskAssignee assignee)
        {
            Id = assignee.Id;
            TaskId = assignee.TaskId;
            UserId = assignee.UserId;
            Role = assignee.Role;
            AssignedAt = assignee.AssignedAt;
            IsActive = assignee.IsActive;
            TaskTitle = assignee.Task?.Title;
        }
    }
}
