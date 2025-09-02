using System;

namespace webapp.DTOs.TaskAssignees
{
    public class TaskAssigneeUpdateDTO
    {
        public string? Role { get; set; }
        public DateTime? AssignedAt { get; set; }
        public bool? IsActive { get; set; }
    }
}
