using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    [Table("subtasks")]
    public class Subtask
    {
        [Key]
        [Column("subtask_id")]
        public int SubtaskId { get; set; }

        [ForeignKey("Task")]
        [Column("task_id")]
        public int TaskId { get; set; }

        [Required]
        [Column("title", TypeName = "varchar(255)")]
        public string Title { get; set; } = null!;

        [Column("due_date")]
        public DateTime? DueDate { get; set; }

        [Column("due_time")]
        public TimeSpan? DueTime { get; set; }

        [Column("completed")]
        public bool Completed { get; set; } = false;

        // Navigation property
        public Task Task { get; set; } = null!;
    }
}
