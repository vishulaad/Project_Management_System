using System.ComponentModel.DataAnnotations;

namespace webapp.DTOs.Users
{
    public class UserRegisterDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        public string? Phone { get; set; }
        public string? Position { get; set; }
        public decimal? Salary { get; set; }
        public int CompanyId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
