using System.ComponentModel.DataAnnotations;
using webapp.Models; // for UserRole enum

namespace webapp.DTOs.Auth
{
    public class RegisterDTO
    {
        [Required] public int CompanyId { get; set; }
        public int? DepartmentId { get; set; }

        [Required] public string FirstName { get; set; } = null!;
        [Required] public string LastName { get; set; } = null!;

        [Required, EmailAddress] public string Email { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        public string? Phone { get; set; }
        public string? Position { get; set; }
        public decimal? Salary { get; set; }

        // default to employee if not provided
        public UserRole Role { get; set; } = UserRole.employee;
    }
}
