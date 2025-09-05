using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using webapp.Data;
using webapp.DTOs.Sprints;
using webapp.DTOs.Tasks;
using webapp.Models;
using TaskStatus = webapp.Models.TaskStatus;

namespace webapp.Services
{
    public class SprintService : ISprintService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SprintService> _logger;

        public SprintService(AppDbContext context, ILogger<SprintService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ---------------- CREATE ----------------
        public async Task<SprintReadDTO> CreateSprintAsync(SprintCreateDTO dto)
        {
            // Validate foreign keys
            if (!await _context.Users.AnyAsync(u => u.UserId == dto.CreatedById))
                throw new ArgumentException("Invalid CreatedById: user does not exist");

            if (!await _context.Companies.AnyAsync(c => c.CompanyId == dto.CompanyId))
                throw new ArgumentException("Invalid CompanyId: company does not exist");

            if (!await _context.Projects.AnyAsync(p => p.ProjectId == dto.ProjectId))
                throw new ArgumentException("Invalid ProjectId: project does not exist");

            // Auto-generate name if missing
            var sprintName = string.IsNullOrWhiteSpace(dto.Name)
                ? await GenerateSprintNameAsync(dto.ProjectId)
                : dto.Name;

            // Default status if missing
            var sprintStatus = string.IsNullOrWhiteSpace(dto.Status)
                ? "Planned"
                : dto.Status;

            var sprint = new Sprint
            {
                Name = sprintName,
                Status = sprintStatus,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                ProjectId = dto.ProjectId,
                CompanyId = dto.CompanyId,
                Description = string.IsNullOrEmpty(dto.Description) ? "No description provided" : dto.Description,
                CreatedById = dto.CreatedById,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                _context.Sprints.Add(sprint);
                await _context.SaveChangesAsync();

                // 🔹 Safe return (avoid 500)
                return await GetSprintByIdAsync(sprint.SprintId)
                       ?? new SprintReadDTO
                       {
                           SprintId = sprint.SprintId,
                           Name = sprint.Name,
                           Description = sprint.Description,
                           StartDate = sprint.StartDate,
                           EndDate = sprint.EndDate,
                           Status = sprint.Status,
                           ProjectId = sprint.ProjectId,
                           CompanyId = sprint.CompanyId,
                           CreatedById = sprint.CreatedById,
                           CreatedAt = sprint.CreatedAt,
                           ProjectName = "Unknown",
                           CompanyName = "Unknown",
                           CreatedByName = "Unknown",
                           TaskCount = 0,
                           CompletedTasks = 0,
                           DaysRemaining = (int)(sprint.EndDate - DateTime.UtcNow).TotalDays,
                           ProgressPercentage = 0,
                           Tasks = new List<TaskReadDTO>()
                       };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sprint for ProjectId {ProjectId}", dto.ProjectId);
                throw new Exception("Failed to create sprint. See logs for details.");
            }
        }

        // ---------------- READ ----------------
        public async Task<SprintReadDTO?> GetSprintByIdAsync(int id)
        {
            var sprint = await _context.Sprints
                .Include(s => s.Project)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(s => s.SprintId == id);

            return sprint == null ? null : MapToReadDTO(sprint);
        }

        public async Task<List<SprintReadDTO>> GetSprintsByProjectAsync(int projectId)
        {
            var sprints = await _context.Sprints
                .Where(s => s.ProjectId == projectId)
                .Include(s => s.Project)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                .OrderBy(s => s.StartDate)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        public async Task<List<SprintReadDTO>> GetSprintsByCompanyAsync(int companyId)
        {
            var sprints = await _context.Sprints
                .Where(s => s.CompanyId == companyId)
                .Include(s => s.Project)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        public async Task<List<SprintReadDTO>> GetSprintsByUserAsync(int userId)
        {
            var sprints = await _context.Sprints
                .Include(s => s.Project).ThenInclude(p => p.TeamMembers)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                .Where(s =>
                    s.CreatedById == userId ||
                    s.Project.TeamMembers.Any(tm => tm.UserId == userId) ||
                    s.Tasks.Any(t => t.Assignees.Any(a => a.UserId == userId)))
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        // ---------------- UPDATE ----------------
        public async Task<SprintReadDTO?> UpdateSprintAsync(int id, SprintUpdateDTO dto)
        {
            var sprint = await _context.Sprints.FindAsync(id);
            if (sprint == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.Name)) sprint.Name = dto.Name;
            if (dto.Description != null) sprint.Description = dto.Description;
            if (dto.StartDate.HasValue) sprint.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) sprint.EndDate = dto.EndDate.Value;
            if (!string.IsNullOrWhiteSpace(dto.Status)) sprint.Status = dto.Status;

            await _context.SaveChangesAsync();

            return await GetSprintByIdAsync(id);
        }

        // ---------------- DELETE ----------------
        public async Task<bool> DeleteSprintAsync(int id)
        {
            var sprint = await _context.Sprints
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.SprintId == id);

            if (sprint == null) return false;

            foreach (var task in sprint.Tasks)
                task.SprintId = null;

            _context.Sprints.Remove(sprint);
            await _context.SaveChangesAsync();
            return true;
        }

        // ---------------- HELPERS ----------------
        public async Task<string> GenerateSprintNameAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) throw new ArgumentException("Project not found");

            var sprintCount = await _context.Sprints.CountAsync(s => s.ProjectId == projectId);
            return $"{project.Name.Substring(0, Math.Min(3, project.Name.Length)).ToUpper()}-S{sprintCount + 1}";
        }

        private static SprintReadDTO MapToReadDTO(Sprint s)
        {
            var completedTasks = s.Tasks?.Count(t => t.Status == TaskStatus.Completed) ?? 0;
            var totalTasks = s.Tasks?.Count ?? 0;

            return new SprintReadDTO
            {
                SprintId = s.SprintId,
                Name = s.Name,
                Description = s.Description,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                Status = s.Status,
                ProjectId = s.ProjectId,
                CompanyId = s.CompanyId,
                CreatedById = s.CreatedById,
                CreatedAt = s.CreatedAt,
                ProjectName = s.Project?.Name ?? "Unknown",
                CompanyName = s.Company?.CompanyName ?? "Unknown",
                CreatedByName = s.CreatedBy?.Email ?? "Unknown",
                TaskCount = totalTasks,
                CompletedTasks = completedTasks,
                DaysRemaining = s.EndDate > DateTime.UtcNow
                    ? (int)(s.EndDate - DateTime.UtcNow).TotalDays
                    : 0,
                ProgressPercentage = totalTasks > 0
                    ? (double)completedTasks / totalTasks * 100
                    : 0,
                Tasks = s.Tasks?.Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    DueDate = t.DueDate,
                    AssignedTo = t.Assignees?.FirstOrDefault()?.User == null
                        ? "Unassigned"
                        : $"{t.Assignees.FirstOrDefault()?.User?.FirstName} {t.Assignees.FirstOrDefault()?.User?.LastName}"
                }).ToList() ?? new List<TaskReadDTO>()
            };
        }
    }
}
