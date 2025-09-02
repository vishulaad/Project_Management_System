using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Models;
using webapp.DTOs.TaskAssignees;
using webapp.Data;
using Microsoft.AspNetCore.Authorization;

namespace webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskAssigneesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskAssigneesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/taskassignees
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskAssigneeReadDTO>>> GetAll()
        {
            var assignees = await _context.TaskAssignees
                .Include(t => t.Task)
                .Include(u => u.User)
                .Select(a => new TaskAssigneeReadDTO
                {
                    Id = a.Id,
                    TaskId = a.TaskId,
                    UserId = a.UserId,
                    Role = a.Role,
                    AssignedAt = a.AssignedAt,
                    IsActive = a.IsActive,
                    TaskTitle = a.Task.Title,
                    UserName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email
                })
                .ToListAsync();

            return Ok(assignees);
        }

        // GET: api/taskassignees/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskAssigneeReadDTO>> GetById(int id)
        {
            var a = await _context.TaskAssignees
                .Include(t => t.Task)
                .Include(u => u.User)
                .Where(a => a.Id == id)
                .Select(a => new TaskAssigneeReadDTO
                {
                    Id = a.Id,
                    TaskId = a.TaskId,
                    UserId = a.UserId,
                    Role = a.Role,
                    AssignedAt = a.AssignedAt,
                    IsActive = a.IsActive,
                    TaskTitle = a.Task.Title,
                    UserName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email
                })
                .FirstOrDefaultAsync();

            if (a == null)
                return NotFound();

            return Ok(a);
        }

        // POST: api/taskassignees
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TaskAssigneeReadDTO>> Create(TaskAssigneeCreateDTO dto)
        {
            var entity = new TaskAssignee
            {
                TaskId = dto.TaskId,
                UserId = dto.UserId,
                Role = dto.Role,
                AssignedAt = DateTime.UtcNow,
                IsActive = dto.IsActive
            };

            _context.TaskAssignees.Add(entity);
            await _context.SaveChangesAsync();

            var readDto = await _context.TaskAssignees
                .Include(t => t.Task)
                .Include(u => u.User)
                .Where(a => a.Id == entity.Id)
                .Select(a => new TaskAssigneeReadDTO
                {
                    Id = a.Id,
                    TaskId = a.TaskId,
                    UserId = a.UserId,
                    Role = a.Role,
                    AssignedAt = a.AssignedAt,
                    IsActive = a.IsActive,
                    TaskTitle = a.Task.Title,
                    UserName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email
                })
                .FirstAsync();

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, readDto);
        }

        // PUT: api/taskassignees/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskAssigneeUpdateDTO dto)
        {
            var entity = await _context.TaskAssignees.FindAsync(id);

            if (entity == null)
                return NotFound();

            entity.Role = dto.Role ?? entity.Role;
            // If dto.AssignedAt is DateTime? (nullable)
            entity.AssignedAt = dto.AssignedAt ?? DateTime.UtcNow;

            // If dto.IsActive is bool? (nullable)
            entity.IsActive = dto.IsActive ?? true;

            // If dto.AssignedAt is DateTime (not nullable)
            entity.AssignedAt = dto.AssignedAt;

            // If dto.IsActive is bool (not nullable)
            entity.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/taskassignees/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.TaskAssignees.FindAsync(id);

            if (entity == null)
                return NotFound();

            _context.TaskAssignees.Remove(entity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
