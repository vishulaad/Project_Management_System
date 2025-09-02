using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    [Table("sprints")]
    public class Sprint
    {
        [Key]
        [Column("sprint_id")]
        public int SprintId { get; set; }

        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; } = null!;

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }   
        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public string Status { get; set; } = "Planned"; // Planned, Active, Completed

        // 🔹 Project relation
        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        // 🔹 Company relation
        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        // 🔹 Created By (User)
        [ForeignKey("CreatedBy")]
        [Column("created_by")]
        public int CreatedById { get; set; }
        public User CreatedBy { get; set; } = null!;

        // 🔹 Created Date
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

       
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
