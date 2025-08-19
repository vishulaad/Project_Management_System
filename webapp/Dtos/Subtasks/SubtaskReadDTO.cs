using System;

namespace webapp.DTOs.Subtasks
{
    public class SubtaskReadDTO
    {
        public int SubtaskId { get; set; }
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public TimeSpan? DueTime { get; set; }
        public bool Completed { get; set; }

        // Related
        public string TaskTitle { get; set; } = null!;
    }
}
