using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/departments
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<DepartmentReadDTO>>> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentReadDTO
                {
                    DepartmentId = d.DepartmentId,
                    CompanyId = d.CompanyId,
                    Name = d.Name,
                    Description = d.Description
                }).ToListAsync();

            return Ok(departments);
        }

        // GET: api/departments/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<DepartmentReadDTO>> GetDepartment(int id)
        {
            var department = await _context.Departments
                .Where(d => d.DepartmentId == id)
                .Select(d => new DepartmentReadDTO
                {
                    DepartmentId = d.DepartmentId,
                    CompanyId = d.CompanyId,
                    Name = d.Name,
                    Description = d.Description
                }).FirstOrDefaultAsync();

            if (department == null)
                return NotFound();

            return Ok(department);
        }

        // POST: api/departments
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<DepartmentReadDTO>> CreateDepartment(DepartmentCreateDTO dto)
        {
            var department = new Department
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            var readDto = new DepartmentReadDTO
            {
                DepartmentId = department.DepartmentId,
                CompanyId = department.CompanyId,
                Name = department.Name,
                Description = department.Description
            };

            return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentId }, readDto);
        }

        // PUT: api/departments/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentUpdateDTO dto)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            department.CompanyId = dto.CompanyId;
            department.Name = dto.Name;
            department.Description = dto.Description;

            _context.Entry(department).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/departments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
