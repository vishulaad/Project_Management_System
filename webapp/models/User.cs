using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Models
{
    public enum UserRole
    {
        admin,
        hr_manager,
        department_manager,
        employee
    }

    public enum UserStatus
    {
        active,
        inactive
    }

    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [ForeignKey("Department")]
        [Column("department_id")]
        public int? DepartmentId { get; set; }

        [Required]
        [Column("first_name", TypeName = "varchar(50)")]
        public string FirstName { get; set; } = null!;

        [Required]
        [Column("last_name", TypeName = "varchar(50)")]
        public string LastName { get; set; } = null!;

        [Required]
        [Column("email", TypeName = "varchar(100)")]
        public string Email { get; set; } = null!;

        [Required]
        [Column("password_hash", TypeName = "varchar(255)")]
        public string PasswordHash { get; set; } = null!;

        [Column("phone", TypeName = "varchar(20)")]
        public string? Phone { get; set; }

        [Required]
        [Column("role")]
        public UserRole Role { get; set; }

        [Column("position", TypeName = "varchar(100)")]
        public string? Position { get; set; }

        [Column("salary", TypeName = "decimal(10,2)")]
        public decimal? Salary { get; set; }

        [Column("join_date")]
        public DateTime? JoinDate { get; set; }

        [Required]
        [Column("status")]
        public UserStatus Status { get; set; } = UserStatus.active;

        [Column("bio", TypeName = "text")]
        public string? Bio { get; set; }

        [Column("address", TypeName = "varchar(255)")]
        public string? Address { get; set; }

        [Column("emergency_contact", TypeName = "varchar(100)")]
        public string? EmergencyContact { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Company Company { get; set; } = null!;
        public Department? Department { get; set; }

        public ICollection<LeaveRequest> LeaveRequestsMade { get; set; } = new List<LeaveRequest>();
        public ICollection<LeaveRequest> LeaveRequestsActioned { get; set; } = new List<LeaveRequest>();

        public ICollection<Task> CreatedTasks { get; set; } = new List<Task>();
        public ICollection<TaskAssignee> TaskAssignees { get; set; } = new List<TaskAssignee>();

        public ICollection<Project> CreatedProjects { get; set; } = new List<Project>();
        public ICollection<ProjectTeamMember> ProjectTeamMemberships { get; set; } = new List<ProjectTeamMember>();
    }
}
