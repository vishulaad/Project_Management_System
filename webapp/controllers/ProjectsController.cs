using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs.Projects;
using webapp.DTOs.ProjectTeamMembers;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectReadDTO>>> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Company)
                .Include(p => p.CreatedBy)
                .Include(p => p.Tasks)
                .Include(p => p.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .Select(p => new ProjectReadDTO
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status.ToString(),
                    CompanyId = p.CompanyId,
                    CreatedById = p.CreatedById,
                    Technologies = p.Technologies,
                    CreatedAt = p.CreatedAt,
                    CompanyName = p.Company.CompanyName,
                    CreatedByName = p.CreatedBy.Email,
                    TaskCount = p.Tasks.Count,
                    TeamCount = p.TeamMembers.Count,
                    TeamMembers = p.TeamMembers.Select(tm => new ProjectTeamMemberReadDTO
                    {
                        Id = tm.Id,
                        ProjectId = tm.ProjectId,
                        UserId = tm.UserId,
                        Role = tm.Role.ToString(),
                        AssignedAt = tm.AssignedAt,
                        ProjectName = p.Name,
                        UserName = tm.User.FirstName + " " + tm.User.LastName,
                        UserEmail = tm.User.Email
                    }).ToList()
                }).ToListAsync();

            return Ok(projects);
        }

        // GET: api/projects/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectReadDTO>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Company)
                .Include(p => p.CreatedBy)
                .Include(p => p.Tasks)
                .Include(p => p.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .Where(p => p.ProjectId == id)
                .Select(p => new ProjectReadDTO
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status.ToString(),
                    CompanyId = p.CompanyId,
                    CreatedById = p.CreatedById,
                    Technologies = p.Technologies,
                    CreatedAt = p.CreatedAt,
                    CompanyName = p.Company.CompanyName,
                    CreatedByName = p.CreatedBy.Email,
                    TaskCount = p.Tasks.Count,
                    TeamCount = p.TeamMembers.Count,
                    TeamMembers = p.TeamMembers.Select(tm => new ProjectTeamMemberReadDTO
                    {
                        Id = tm.Id,
                        ProjectId = tm.ProjectId,
                        UserId = tm.UserId,
                        Role = tm.Role.ToString(),
                        AssignedAt = tm.AssignedAt,
                        ProjectName = p.Name,
                        UserName = tm.User.FirstName + " " + tm.User.LastName,
                        UserEmail = tm.User.Email
                    }).ToList()
                }).FirstOrDefaultAsync();

            if (project == null) return NotFound();

            return Ok(project);
        }

        // GET: api/projects/user/{userId}
        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ProjectReadDTO>>> GetProjectsByUser(int userId)
        {
            var projects = await _context.Projects
                .Include(p => p.Company)
                .Include(p => p.CreatedBy)
                .Include(p => p.Tasks)
                .Include(p => p.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .Where(p => p.TeamMembers.Any(tm => tm.UserId == userId))
                .Select(p => new ProjectReadDTO
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status.ToString(),
                    CompanyId = p.CompanyId,
                    CreatedById = p.CreatedById,
                    Technologies = p.Technologies,
                    CreatedAt = p.CreatedAt,
                    CompanyName = p.Company.CompanyName,
                    CreatedByName = p.CreatedBy.Email,
                    TaskCount = p.Tasks.Count,
                    TeamCount = p.TeamMembers.Count,
                    TeamMembers = p.TeamMembers.Select(tm => new ProjectTeamMemberReadDTO
                    {
                        Id = tm.Id,
                        ProjectId = tm.ProjectId,
                        UserId = tm.UserId,
                        Role = tm.Role.ToString(),
                        AssignedAt = tm.AssignedAt,
                        ProjectName = p.Name,
                        UserName = tm.User.FirstName + " " + tm.User.LastName,
                        UserEmail = tm.User.Email
                    }).ToList()
                }).ToListAsync();

            return Ok(projects);
        }

        // GET: api/projects/company/{companyId}
        [Authorize(Roles = "admin")]
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<ProjectReadDTO>>> GetProjectsByCompany(int companyId)
        {
            var projects = await _context.Projects
                .Include(p => p.Company)
                .Include(p => p.CreatedBy)
                .Include(p => p.Tasks)
                .Include(p => p.TeamMembers)
                    .ThenInclude(tm => tm.User)
                .Where(p => p.CompanyId == companyId)
                .Select(p => new ProjectReadDTO
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status.ToString(),
                    CompanyId = p.CompanyId,
                    CreatedById = p.CreatedById,
                    Technologies = p.Technologies,
                    CreatedAt = p.CreatedAt,
                    CompanyName = p.Company.CompanyName,
                    CreatedByName = p.CreatedBy.Email,
                    TaskCount = p.Tasks.Count,
                    TeamCount = p.TeamMembers.Count,
                    TeamMembers = p.TeamMembers.Select(tm => new ProjectTeamMemberReadDTO
                    {
                        Id = tm.Id,
                        ProjectId = tm.ProjectId,
                        UserId = tm.UserId,
                        Role = tm.Role.ToString(),
                        AssignedAt = tm.AssignedAt,
                        ProjectName = p.Name,
                        UserName = tm.User.FirstName + " " + tm.User.LastName,
                        UserEmail = tm.User.Email
                    }).ToList()
                }).ToListAsync();

            return Ok(projects);
        }

        // POST: api/projects
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<ProjectReadDTO>> CreateProject(ProjectCreateDTO dto)
        {
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status ?? ProjectStatus.NotStarted,
                CompanyId = dto.CompanyId,
                CreatedById = dto.CreatedById,
                Technologies = dto.Technologies,
                CreatedAt = DateTime.UtcNow,
                TeamMembers = dto.TeamMembers?.Select(tm => new ProjectTeamMember
                {
                    UserId = tm.UserId,
                    Role = tm.Role,
                    AssignedAt = tm.AssignedAt ?? DateTime.UtcNow
                }).ToList() ?? new List<ProjectTeamMember>()
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            await _context.Entry(project).Reference(p => p.Company).LoadAsync();
            await _context.Entry(project).Reference(p => p.CreatedBy).LoadAsync();
            await _context.Entry(project).Collection(p => p.TeamMembers).Query().Include(tm => tm.User).LoadAsync();

            var readDto = new ProjectReadDTO
            {
                ProjectId = project.ProjectId,
                Name = project.Name,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Status = project.Status.ToString(),
                CompanyId = project.CompanyId,
                CreatedById = project.CreatedById,
                Technologies = project.Technologies,
                CreatedAt = project.CreatedAt,
                CompanyName = project.Company.CompanyName,
                CreatedByName = project.CreatedBy.Email,
                TaskCount = 0,
                TeamCount = project.TeamMembers.Count,
                TeamMembers = project.TeamMembers.Select(tm => new ProjectTeamMemberReadDTO
                {
                    Id = tm.Id,
                    ProjectId = tm.ProjectId,
                    UserId = tm.UserId,
                    Role = tm.Role.ToString(),
                    AssignedAt = tm.AssignedAt,
                    ProjectName = project.Name,
                    UserName = tm.User.FirstName + " " + tm.User.LastName,
                    UserEmail = tm.User.Email
                }).ToList()
            };

            return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, readDto);
        }

        // PUT: api/projects/{id}
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectUpdateDTO dto)
        {
            var project = await _context.Projects
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Name)) project.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description)) project.Description = dto.Description;
            if (dto.StartDate.HasValue) project.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) project.EndDate = dto.EndDate.Value;
            if (dto.Status.HasValue) project.Status = dto.Status.Value;
            if (dto.CompanyId.HasValue) project.CompanyId = dto.CompanyId.Value;
            if (dto.CreatedById.HasValue) project.CreatedById = dto.CreatedById.Value;
            if (!string.IsNullOrEmpty(dto.Technologies)) project.Technologies = dto.Technologies;

            if (dto.TeamMembers != null)
            {
                foreach (var tmDto in dto.TeamMembers)
                {
                    var tm = project.TeamMembers.FirstOrDefault(x => x.Id == tmDto.Id);
                    if (tm != null)
                    {
                        if (tmDto.Role.HasValue) tm.Role = tmDto.Role.Value;
                        if (tmDto.AssignedAt.HasValue) tm.AssignedAt = tmDto.AssignedAt.Value;
                    }
                }
            }

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/projects/{id}
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null) return NotFound();

            _context.ProjectTeamMembers.RemoveRange(project.TeamMembers);
            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
