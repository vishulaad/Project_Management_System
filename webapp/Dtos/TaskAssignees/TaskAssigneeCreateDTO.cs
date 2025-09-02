using System;
using System.ComponentModel.DataAnnotations;

namespace webapp.DTOs.TaskAssignees
{
    public class TaskAssigneeCreateDTO
    {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public int UserId { get; set; }

        public string? Role { get; set; }

        // Automatically set to current UTC time if not provided
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Default to true if not specified
        public bool IsActive { get; set; } = true;
    }
}
