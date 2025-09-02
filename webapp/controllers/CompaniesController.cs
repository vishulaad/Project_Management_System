using Microsoft.AspNetCore.Authorization; // ✅ Needed for [Authorize]
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.DTOs.Companies;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompaniesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/companies
        [Authorize] // 🔹 Protect all endpoints in this controller
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanyReadDTO>>> GetCompanies()
        {
            var companies = await _context.Companies
                .Include(c => c.Users)
                .Include(c => c.Departments)
                .Include(c => c.Projects)
                .Include(c => c.Tasks)
                .Select(c => new CompanyReadDTO
                {
                    CompanyId = c.CompanyId,
                    CompanyCode = c.CompanyCode,
                    CompanyName = c.CompanyName,
                    OwnerEmail = c.OwnerEmail,
                    CreatedAt = c.CreatedAt,
                    TotalUsers = c.Users.Count,
                    TotalDepartments = c.Departments.Count,
                    TotalProjects = c.Projects.Count,
                    TotalTasks = c.Tasks.Count
                }).ToListAsync();

            return Ok(companies);
        }

        // GET: api/companies/{id}
        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyReadDTO>> GetCompany(int id)
        {
            var company = await _context.Companies
                .Include(c => c.Users)
                .Include(c => c.Departments)
                .Include(c => c.Projects)
                .Include(c => c.Tasks)
                .Where(c => c.CompanyId == id)
                .Select(c => new CompanyReadDTO
                {
                    CompanyId = c.CompanyId,
                    CompanyCode = c.CompanyCode,
                    CompanyName = c.CompanyName,
                    OwnerEmail = c.OwnerEmail,
                    CreatedAt = c.CreatedAt,
                    TotalUsers = c.Users.Count,
                    TotalDepartments = c.Departments.Count,
                    TotalProjects = c.Projects.Count,
                    TotalTasks = c.Tasks.Count
                }).FirstOrDefaultAsync();

            if (company == null)
                return NotFound();

            return Ok(company);
        }
    }
}
