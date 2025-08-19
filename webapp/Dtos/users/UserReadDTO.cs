using System;
using webapp.Models;

namespace webapp.DTOs.Users
{
    public class UserReadDTO
    {
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        

        public string FirstName { get; set; } = null!;
        public string LastName  { get; set; } = null!;
        public string Email     { get; set; } = null!;
        
        public UserRole Role { get; set; }
       
        public UserStatus Status { get; set; }

      
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Related
        public string CompanyName { get; set; } = null!;
        public string? DepartmentName { get; set; }
        public string FullName => $"{FirstName} {LastName}";
    }
}
