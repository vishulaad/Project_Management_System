using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using webapp.Models;


namespace webapp.Models
{
    [Table("departments")]
    public class Department
    {
        [Key]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [Required]
        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        // Navigation Properties
        public Company Company { get; set; } = null!;  // One Company -> Many Departments
        public ICollection<User> Users { get; set; } = new List<User>();
 
    }
}
