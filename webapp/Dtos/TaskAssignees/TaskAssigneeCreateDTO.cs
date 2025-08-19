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

        
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        
        public bool IsActive { get; set; } = true;
    }
}
