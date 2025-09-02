using System;
using webapp.Models;

namespace webapp.DTOs.Tasks
{
    using TaskStatusEnum = webapp.Models.TaskStatus;

    public class TaskUpdateDTO
    {
        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        // Make nullable so it's optional in update
        public TaskStatusEnum? Status { get; set; }

        // Make nullable so it's optional in update
        public TaskPriority? Priority { get; set; }

        public int? ProjectId { get; set; }

        public int? CompanyId { get; set; }

        public int? CreatedById { get; set; }
    }
}
