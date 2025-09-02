using System;
using webapp.Models;

namespace webapp.DTOs.Users
{
    public class UserUpdateDTO
    {
        public int? CompanyId { get; set; }
        public int? DepartmentId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName  { get; set; }
        public string? Email     { get; set; }
        public string? Password  { get; set; }   // set hua to re-hash
        public string? Phone { get; set; }
        public UserRole? Role { get; set; }
        public string? Position { get; set; }
        public decimal? Salary { get; set; }
        public DateTime? JoinDate { get; set; }
        public UserStatus? Status { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
    }
}
