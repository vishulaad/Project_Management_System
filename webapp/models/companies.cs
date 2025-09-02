using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    [Table("companies")]
    public class Company
    {
        [Key]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("company_code", TypeName = "varchar(50)")]
        public string CompanyCode { get; set; } = null!;

        [Required]
        [Column("company_name", TypeName = "varchar(100)")]
        public string CompanyName { get; set; } = null!;

        [Required]
        [Column("owner_email", TypeName = "varchar(100)")]
        public string OwnerEmail { get; set; } = null!;

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public ICollection<Department> Departments { get; set; } = new List<Department>();
    }
}
