using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs.ProjectTeamMembers;
using Microsoft.AspNetCore.Authorization;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTeamMembersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectTeamMembersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/projectteammembers
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTeamMemberReadDTO>>> GetTeamMembers()
        {
            var members = await _context.ProjectTeamMembers
                .Include(ptm => ptm.Project)
                .Include(ptm => ptm.User)
                .Select(ptm => new ProjectTeamMemberReadDTO
                {
                    Id = ptm.Id,
                    ProjectId = ptm.ProjectId,
                    UserId = ptm.UserId,
                    Role = ptm.Role.ToString(),
                    AssignedAt = ptm.AssignedAt,
                    ProjectName = ptm.Project != null ? ptm.Project.Name : "",
                    UserName = ptm.User != null ? ptm.User.FirstName + " " + ptm.User.LastName : "",
                    UserEmail = ptm.User != null ? ptm.User.Email : ""
                }).ToListAsync();

            return Ok(members);
        }

        // GET: api/projectteammembers/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTeamMemberReadDTO>> GetTeamMember(int id)
        {
            var member = await _context.ProjectTeamMembers
                .Include(ptm => ptm.Project)
                .Include(ptm => ptm.User)
                .Where(ptm => ptm.Id == id)
                .Select(ptm => new ProjectTeamMemberReadDTO
                {
                    Id = ptm.Id,
                    ProjectId = ptm.ProjectId,
                    UserId = ptm.UserId,
                    Role = ptm.Role.ToString(),
                    AssignedAt = ptm.AssignedAt,
                    ProjectName = ptm.Project != null ? ptm.Project.Name : "",
                    UserName = ptm.User != null ? ptm.User.FirstName + " " + ptm.User.LastName : "",
                    UserEmail = ptm.User != null ? ptm.User.Email : ""
                }).FirstOrDefaultAsync();

            if (member == null) return NotFound();

            return Ok(member);
        }

        // POST: api/projectteammembers
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProjectTeamMemberReadDTO>> CreateTeamMember(ProjectTeamMemberCreateDTO dto)
        {
            // Validate Project and User existence
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            var user = await _context.Users.FindAsync(dto.UserId);
            if (project == null || user == null)
            {
                return BadRequest("Invalid ProjectId or UserId.");
            }

            var ptm = new ProjectTeamMember
            {
                ProjectId = dto.ProjectId,
                UserId = dto.UserId,
                Role = dto.Role,
                AssignedAt = dto.AssignedAt ?? DateTime.UtcNow
            };

            _context.ProjectTeamMembers.Add(ptm);
            await _context.SaveChangesAsync();

            // Load related data for response
            await _context.Entry(ptm).Reference(p => p.Project).LoadAsync();
            await _context.Entry(ptm).Reference(p => p.User).LoadAsync();

            var readDto = new ProjectTeamMemberReadDTO
            {
                Id = ptm.Id,
                ProjectId = ptm.ProjectId,
                UserId = ptm.UserId,
                Role = ptm.Role.ToString(),
                AssignedAt = ptm.AssignedAt,
                ProjectName = ptm.Project != null ? ptm.Project.Name : "",
                UserName = ptm.User != null ? ptm.User.FirstName + " " + ptm.User.LastName : "",
                UserEmail = ptm.User != null ? ptm.User.Email : ""
            };

            return CreatedAtAction(nameof(GetTeamMember), new { id = ptm.Id }, readDto);
        }

        // PUT: api/projectteammembers/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeamMember(int id, ProjectTeamMemberUpdateDTO dto)
        {
            var ptm = await _context.ProjectTeamMembers.FindAsync(id);
            if (ptm == null) return NotFound();

            if (dto.Role.HasValue) ptm.Role = dto.Role.Value;
            if (dto.AssignedAt.HasValue) ptm.AssignedAt = dto.AssignedAt.Value;

            _context.Entry(ptm).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.ProjectTeamMembers.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/projectteammembers/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeamMember(int id)
        {
            var ptm = await _context.ProjectTeamMembers.FindAsync(id);
            if (ptm == null) return NotFound();

            _context.ProjectTeamMembers.Remove(ptm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/projectteammembers/project/{projectId}
        [Authorize]
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectTeamMemberReadDTO>>> GetTeamMembersByProject(int projectId)
        {
            var members = await _context.ProjectTeamMembers
                .Include(ptm => ptm.Project)
                .Include(ptm => ptm.User)
                .Where(ptm => ptm.ProjectId == projectId)
                .Select(ptm => new ProjectTeamMemberReadDTO
                {
                    Id = ptm.Id,
                    ProjectId = ptm.ProjectId,
                    UserId = ptm.UserId,
                    Role = ptm.Role.ToString(),
                    AssignedAt = ptm.AssignedAt,
                    ProjectName = ptm.Project != null ? ptm.Project.Name : "",
                    UserName = ptm.User != null ? ptm.User.FirstName + " " + ptm.User.LastName : "",
                    UserEmail = ptm.User != null ? ptm.User.Email : ""
                }).ToListAsync();

            return Ok(members);
        }
    }
}
