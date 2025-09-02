using System;
using webapp.Models;

namespace webapp.DTOs.Users
{
    public class UserCreateDTO
    {
        public int CompanyId { get; set; }
        public int? DepartmentId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName  { get; set; } = null!;
        public string Email     { get; set; } = null!;
        public string Password  { get; set; } = null!; // hash server banayega
        public string? Phone { get; set; }
        public UserRole Role { get; set; }              // admin/hr_manager/department_manager/employee
        public string? Position { get; set; }
        public decimal? Salary { get; set; }
        public DateTime? JoinDate { get; set; }
        public UserStatus? Status { get; set; }         // default active, optional
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
    }
}
