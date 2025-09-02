using System;

namespace webapp.DTOs.Subtasks
{
    public class SubtaskCreateDTO
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public TimeSpan? DueTime { get; set; }
        public bool? Completed { get; set; } // default false if null
    }
}
