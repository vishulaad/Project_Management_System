using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Models;
using webapp.Data;
using webapp.DTOs.Subtasks;
using Microsoft.AspNetCore.Authorization;


namespace webapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubtasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubtasksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/subtasks
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubtaskReadDTO>>> GetSubtasks()
        {
            var subtasks = await _context.Subtasks
                .Include(s => s.Task)
                .Select(s => new SubtaskReadDTO
                {
                    SubtaskId = s.SubtaskId,
                    TaskId = s.TaskId,
                    Title = s.Title,
                    DueDate = s.DueDate,
                    DueTime = s.DueTime,
                    Completed = s.Completed,
                    TaskTitle = s.Task.Title
                })
                .ToListAsync();

            return Ok(subtasks);
        }

        // GET: api/subtasks/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<SubtaskReadDTO>> GetSubtask(int id)
        {
            var subtask = await _context.Subtasks
                .Include(s => s.Task)
                .Where(s => s.SubtaskId == id)
                .Select(s => new SubtaskReadDTO
                {
                    SubtaskId = s.SubtaskId,
                    TaskId = s.TaskId,
                    Title = s.Title,
                    DueDate = s.DueDate,
                    DueTime = s.DueTime,
                    Completed = s.Completed,
                    TaskTitle = s.Task.Title
                })
                .FirstOrDefaultAsync();

            if (subtask == null)
                return NotFound();

            return Ok(subtask);
        }

        // POST: api/subtasks
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<SubtaskReadDTO>> CreateSubtask(SubtaskCreateDTO dto)
        {
            var subtask = new Subtask
            {
                TaskId = dto.TaskId,
                Title = dto.Title,
                DueDate = dto.DueDate,
                DueTime = dto.DueTime,
                Completed = dto.Completed ?? false
            };

            _context.Subtasks.Add(subtask);
            await _context.SaveChangesAsync();

            // Fetch task title for response
            var taskTitle = await _context.Tasks
                .Where(t => t.TaskId == subtask.TaskId)
                .Select(t => t.Title)
                .FirstOrDefaultAsync();

            var readDto = new SubtaskReadDTO
            {
                SubtaskId = subtask.SubtaskId,
                TaskId = subtask.TaskId,
                Title = subtask.Title,
                DueDate = subtask.DueDate,
                DueTime = subtask.DueTime,
                Completed = subtask.Completed,
                TaskTitle = taskTitle ?? ""
            };

            return CreatedAtAction(nameof(GetSubtask), new { id = subtask.SubtaskId }, readDto);
        }

        // PUT: api/subtasks/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubtask(int id, SubtaskUpdateDTO dto)
        {
            var subtask = await _context.Subtasks.FindAsync(id);
            if (subtask == null)
                return NotFound();

            if (dto.Title != null) subtask.Title = dto.Title;
            if (dto.DueDate.HasValue) subtask.DueDate = dto.DueDate;
            if (dto.DueTime.HasValue) subtask.DueTime = dto.DueTime;
            if (dto.Completed.HasValue) subtask.Completed = dto.Completed.Value;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/subtasks/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubtask(int id)
        {
            var subtask = await _context.Subtasks.FindAsync(id);
            if (subtask == null)
                return NotFound();

            _context.Subtasks.Remove(subtask);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
