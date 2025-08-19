using System;

namespace webapp.DTOs.Subtasks
{
    public class SubtaskUpdateDTO
    {
        public string? Title { get; set; }
        public DateTime? DueDate { get; set; }
        public TimeSpan? DueTime { get; set; }
        public bool? Completed { get; set; }
    }
}
