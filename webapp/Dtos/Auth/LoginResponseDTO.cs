namespace webapp.DTOs.Auth
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = null!;
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
