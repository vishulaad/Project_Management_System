using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    [Table("task_assignees")]
    public class TaskAssignee
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("Task")]
        [Column("task_id")]
        public int TaskId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("role", TypeName = "varchar(50)")]
        public string? Role { get; set; }

        [Column("assigned_at", TypeName = "date")]
        public DateTime? AssignedAt { get; set; }

        [Column("is_active")]
        public bool? IsActive { get; set; } = true;

        // Navigation properties
        public Task Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
