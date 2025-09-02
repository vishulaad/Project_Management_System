using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using webapp.Data;
using webapp.Models;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Users/company/{companyId}
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersByCompanyId(int companyId)
        {
            var users = await _context.Users
                .Where(u => u.CompanyId == companyId)
                .ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound(new { message = $"No users found for CompanyId {companyId}" });
            }

            return Ok(users);
        }

        // ✅ GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            return Ok(user);
        }

        // ✅ GET: api/Users/me
        [Authorize] // Require valid JWT
        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            // Extract UserId from JWT token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Invalid or missing JWT token" });
            }

            var user = await _context.Users
                .Where(u => u.UserId == int.Parse(userId))
                .Select(u => new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Role,
                    u.CompanyId
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }
    }
}
