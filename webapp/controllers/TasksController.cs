using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.DTOs.Tasks;
using webapp.Models;

namespace webapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        
        // POST: api/tasks
        
        
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TaskReadDTO>> CreateTask(TaskCreateDTO dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var task = new webapp.Models.Task
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    DueDate = dto.DueDate,
                    Status = dto.Status,
                    Priority = dto.Priority != default ? dto.Priority : TaskPriority.Medium,
                    ProjectId = dto.ProjectId,
                    CompanyId = dto.CompanyId,
                    CreatedById = dto.CreatedById,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                // Add Subtasks
                if (dto.Subtasks != null)
                {
                    foreach (var subtaskDto in dto.Subtasks)
                    {
                        _context.Subtasks.Add(new Subtask
                        {
                            TaskId = task.TaskId,
                            Title = subtaskDto.Title,
                            DueDate = subtaskDto.DueDate,
                            DueTime = subtaskDto.DueTime,
                            Completed = subtaskDto.Completed
                        });
                    }
                }

                // Add Assignees
                if (dto.Assignees != null)
                {
                    foreach (var assigneeDto in dto.Assignees)
                    {
                        _context.TaskAssignees.Add(new TaskAssignee
                        {
                            TaskId = task.TaskId,
                            UserId = assigneeDto.UserId,
                            Role = assigneeDto.Role,
                            AssignedAt = assigneeDto.AssignedAt ?? DateTime.UtcNow,
                            IsActive = assigneeDto.IsActive,
                        });
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = await GetTaskByIdInternal(task.TaskId);
                return CreatedAtAction(nameof(GetTaskById), new { id = task.TaskId }, response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = "Failed to create task", error = ex.Message });
            }
        }

        
        // GET: api/tasks/{id}
        // Get Task by Task ID
        
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TaskReadDTO>> GetTaskById(int id)
        {
            var task = await GetTaskByIdInternal(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        
        // GET: api/tasks/user/{userId}
        // Get Tasks by User ID (CreatedBy or Assigned)
        
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<TaskReadDTO>>> GetTasksByUserId(int userId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.Company)
                .Include(t => t.CreatedBy)
                .Where(t => t.CreatedById == userId || t.Assignees.Any(a => a.UserId == userId))
                .Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    DueDate = t.DueDate,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    ProjectId = t.ProjectId,
                    CompanyId = t.CompanyId,
                    CreatedById = t.CreatedById,
                    CreatedAt = t.CreatedAt,
                    SubtaskCount = t.Subtasks.Count(),
                    AssigneeCount = t.Assignees.Count(),
                    ProjectName = t.Project != null ? t.Project.Name : null,
                    Subtasks = t.Subtasks.Select(s => new SubtaskReadDTO
                    {
                        SubtaskId = s.SubtaskId,
                        Title = s.Title,
                        DueDate = s.DueDate,
                        DueTime = s.DueTime,
                        Completed = s.Completed
                    }).ToList(),
                    Assignees = t.Assignees.Select(a => new TaskAssigneeReadDTO
                    {
                        UserId = a.UserId,
                        UserName = a.User.FirstName + " " + a.User.LastName,
                        Role = a.Role,
                        AssignedAt = a.AssignedAt,
                        IsActive = a.IsActive ?? true
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tasks);
        }

       
        // GET: api/tasks/project/{projectId}
        // Get Tasks by Project ID
        
        [HttpGet("project/{projectId}")]
        [Authorize]
        public async Task<ActionResult<List<TaskReadDTO>>> GetTasksByProjectId(int projectId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)      // <-- Add this
                .Include(t => t.Company)      // <-- Add this
                .Include(t => t.CreatedBy)    // <-- Add this
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    DueDate = t.DueDate,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    ProjectId = t.ProjectId,
                    CompanyId = t.CompanyId,
                    CreatedById = t.CreatedById,
                    CreatedAt = t.CreatedAt,
                    SubtaskCount = t.Subtasks.Count(),
                    AssigneeCount = t.Assignees.Count(),
                    ProjectName = t.Project != null ? t.Project.Name : null,
                    Subtasks = t.Subtasks.Select(s => new SubtaskReadDTO
                    {
                        SubtaskId = s.SubtaskId,
                        Title = s.Title,
                        DueDate = s.DueDate,
                        DueTime = s.DueTime,
                        Completed = s.Completed
                    }).ToList(),
                    Assignees = t.Assignees.Select(a => new TaskAssigneeReadDTO
                    {
                        UserId = a.UserId,
                        UserName = a.User.FirstName + " " + a.User.LastName,
                        Role = a.Role,
                        AssignedAt = a.AssignedAt,
                        IsActive = a.IsActive ?? true
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tasks);
        }

        
        // PUT: api/tasks/{id}
        // Update Task (with Subtasks & Assignees)
        
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<TaskReadDTO>> UpdateTask(int id, TaskCreateDTO dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var task = await _context.Tasks
                    .Include(t => t.Subtasks)
                    .Include(t => t.Assignees)
                    .FirstOrDefaultAsync(t => t.TaskId == id);

                if (task == null) return NotFound(new { message = "Task not found" });

                
                task.Title = dto.Title;
                task.Description = dto.Description;
                task.DueDate = dto.DueDate;
                task.Status = dto.Status;
                task.Priority = dto.Priority != default ? dto.Priority : TaskPriority.Medium;
                task.ProjectId = dto.ProjectId;
                task.CompanyId = dto.CompanyId;
                task.CreatedById = dto.CreatedById;

                
                _context.Subtasks.RemoveRange(task.Subtasks);
                if (dto.Subtasks != null)
                {
                    foreach (var subtaskDto in dto.Subtasks)
                    {
                        _context.Subtasks.Add(new Subtask
                        {
                            TaskId = task.TaskId,
                            Title = subtaskDto.Title,
                            DueDate = subtaskDto.DueDate,
                            DueTime = subtaskDto.DueTime,
                            Completed = subtaskDto.Completed
                        });
                    }
                }

               
                _context.TaskAssignees.RemoveRange(task.Assignees);
                if (dto.Assignees != null)
                {
                    foreach (var assigneeDto in dto.Assignees)
                    {
                        _context.TaskAssignees.Add(new TaskAssignee
                        {
                            TaskId = task.TaskId,
                            UserId = assigneeDto.UserId,
                            Role = assigneeDto.Role,
                            AssignedAt = assigneeDto.AssignedAt ?? DateTime.UtcNow,
                            IsActive = assigneeDto.IsActive
                        });
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = await GetTaskByIdInternal(task.TaskId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = "Failed to update task", error = ex.Message });
            }
        }

       
        // DELETE: api/tasks/{id}
        // Delete Task
        
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Subtasks)
                .Include(t => t.Assignees)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (task == null) return NotFound(new { message = "Task not found" });

            _context.Subtasks.RemoveRange(task.Subtasks);
            _context.TaskAssignees.RemoveRange(task.Assignees);
            _context.Tasks.Remove(task);

            await _context.SaveChangesAsync();
            return NoContent();
        }


       
        private async Task<TaskReadDTO?> GetTaskByIdInternal(int id)
        {
            return await _context.Tasks
                .Where(t => t.TaskId == id)
                .Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    DueDate = t.DueDate,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    ProjectId = t.ProjectId,
                    CompanyId = t.CompanyId,
                    CreatedById = t.CreatedById,
                    CreatedAt = t.CreatedAt,
                    SubtaskCount = t.Subtasks.Count(),
                    AssigneeCount = t.Assignees.Count(),
                    ProjectName = t.Project != null ? t.Project.Name : null,
                    Subtasks = t.Subtasks.Select(s => new SubtaskReadDTO
                    {
                        SubtaskId = s.SubtaskId,
                        Title = s.Title,
                        DueDate = s.DueDate,
                        DueTime = s.DueTime,
                        Completed = s.Completed
                    }).ToList(),
                    Assignees = t.Assignees.Select(a => new TaskAssigneeReadDTO
                    {
                        UserId = a.UserId,

                        UserName = a.User.FirstName + " " + a.User.LastName,

                        Role = a.Role,
                        AssignedAt = a.AssignedAt,
                        IsActive = a.IsActive ?? true
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
