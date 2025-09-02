using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs.Sprints;
using webapp.DTOs.Tasks;
using TaskStatus = webapp.Models.TaskStatus;

namespace webapp.Services
{
    public class SprintService : ISprintService
    {
        private readonly AppDbContext _context;

        public SprintService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SprintReadDTO> CreateSprintAsync(SprintCreateDTO dto)
        {
            // Validate project exists
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            // Generate sprint name if not provided
            var sprintName = !string.IsNullOrEmpty(dto.Name) ? dto.Name : await GenerateSprintNameAsync(dto.ProjectId);

            var sprint = new Sprint
            {
                Name = sprintName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status ?? "Planned",
                ProjectId = dto.ProjectId,
                CompanyId = dto.CompanyId,
                CreatedById = dto.CreatedById,
                CreatedAt = DateTime.UtcNow
            };

            _context.Sprints.Add(sprint);
            await _context.SaveChangesAsync();

            // Return the created sprint with navigation properties loaded
            return await GetSprintByIdAsync(sprint.SprintId) ?? throw new InvalidOperationException("Failed to retrieve created sprint");
        }

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

            if (sprint == null) return null;

            return MapToReadDTO(sprint);
        }

        public async Task<List<SprintReadDTO>> GetSprintsByProjectAsync(int projectId)
        {
            var sprints = await _context.Sprints
                .Include(s => s.Project)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .Where(s => s.ProjectId == projectId)
                .OrderBy(s => s.StartDate)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        public async Task<List<SprintReadDTO>> GetSprintsByCompanyAsync(int companyId)
        {
            var sprints = await _context.Sprints
                .Include(s => s.Project)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .Where(s => s.CompanyId == companyId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        public async Task<List<SprintReadDTO>> GetSprintsByUserAsync(int userId)
        {
            var sprints = await _context.Sprints
                .Include(s => s.Project)
                    .ThenInclude(p => p.TeamMembers)
                .Include(s => s.Company)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .Where(s => s.CreatedById == userId || 
                           s.Project.TeamMembers.Any(tm => tm.UserId == userId) ||
                           s.Tasks.Any(t => t.Assignees.Any(a => a.UserId == userId)))
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return sprints.Select(MapToReadDTO).ToList();
        }

        public async Task<SprintReadDTO?> UpdateSprintAsync(int id, SprintUpdateDTO dto)
        {
            var sprint = await _context.Sprints.FindAsync(id);
            if (sprint == null) return null;

            // Update only provided fields
            if (!string.IsNullOrEmpty(dto.Name))
                sprint.Name = dto.Name;
            
            if (dto.Description != null)
                sprint.Description = dto.Description;
            
            if (dto.StartDate.HasValue)
                sprint.StartDate = dto.StartDate.Value;
            
            if (dto.EndDate.HasValue)
                sprint.EndDate = dto.EndDate.Value;
            
            if (!string.IsNullOrEmpty(dto.Status))
                sprint.Status = dto.Status;

            await _context.SaveChangesAsync();
            
            return await GetSprintByIdAsync(id);
        }

        public async Task<bool> DeleteSprintAsync(int id)
        {
            var sprint = await _context.Sprints
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.SprintId == id);

            if (sprint == null) return false;

            // Unlink tasks from sprint (set SprintId to null)
            foreach (var task in sprint.Tasks)
            {
                task.SprintId = null;
            }

            _context.Sprints.Remove(sprint);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<string> GenerateSprintNameAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) throw new ArgumentException("Project not found");

            // Get project short name (first 3 letters or acronym)
            var shortName = GenerateProjectShortName(project.Name);

            // Count existing sprints for this project
            var sprintCount = await _context.Sprints.CountAsync(s => s.ProjectId == projectId);

            return $"{shortName}-S{sprintCount + 1}";
        }

        private static string GenerateProjectShortName(string projectName)
        {
            if (string.IsNullOrEmpty(projectName))
                return "PRJ";

            // Split by spaces and take first letter of each word (max 3-4 letters)
            var words = projectName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (words.Length > 1)
            {
                return string.Join("", words.Take(3).Select(w => w[0])).ToUpper();
            }

            // If single word, take first 3 letters
            return projectName.Substring(0, Math.Min(3, projectName.Length)).ToUpper();
        }

        private static SprintReadDTO MapToReadDTO(Sprint s)
        {
            var completedTasks = s.Tasks?.Count(t => t.Status == TaskStatus.Completed) ?? 0;
            var totalTasks = s.Tasks?.Count ?? 0;
            var daysRemaining = Math.Max(0, (int)(s.EndDate - DateTime.UtcNow).TotalDays);

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
                ProjectName = s.Project?.Name ?? "",
                CompanyName = s.Company?.CompanyName ?? "",
                CreatedByName = s.CreatedBy?.Email ?? "",
                TaskCount = totalTasks,
                CompletedTasks = completedTasks,
                DaysRemaining = daysRemaining,
                ProgressPercentage = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0,
                Tasks = s.Tasks?.Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    DueDate = t.DueDate,
                    AssignedTo = t.Assignees?.FirstOrDefault()?.User?.FirstName + " " + 
                               t.Assignees?.FirstOrDefault()?.User?.LastName
                }).ToList() ?? new List<TaskReadDTO>()
            };
        }
    }
}