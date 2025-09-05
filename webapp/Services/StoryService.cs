using Microsoft.EntityFrameworkCore;
using webapp.Data;
using webapp.Models;
using webapp.DTOs.Stories;
using webapp.DTOs.Tasks;
using TaskStatus = webapp.Models.TaskStatus;

namespace webapp.Services
{
    public class StoryService : IStoryService
    {
        private readonly AppDbContext _context;

        public StoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StoryReadDTO> CreateStoryAsync(StoryCreateDTO dto)
        {
            // Validate project exists
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            var story = new Story
            {
                Title = dto.Title,
                Description = dto.Description,
                AcceptanceCriteria = dto.AcceptanceCriteria,
                StoryPoints = dto.StoryPoints,
                Priority = Enum.Parse<StoryPriority>(dto.Priority),
                Status = Enum.Parse<StoryStatus>(dto.Status),
                SprintId = dto.SprintId,
                ProjectId = dto.ProjectId,
                CreatedById = dto.CreatedById,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Stories.Add(story);
            await _context.SaveChangesAsync();

            // Create associated tasks if provided
            if (dto.Tasks != null && dto.Tasks.Any())
            {
                foreach (var taskDto in dto.Tasks)
                {
                    var task = new webapp.Models.Task
                    {
                        Title = taskDto.Title,
                        Description = taskDto.Description,
                       Status = taskDto.Status ,
                       Priority = taskDto.Priority ,
                        DueDate = taskDto.DueDate,
                        EstimatedHours = taskDto.EstimatedHours,
                        ProjectId = dto.ProjectId,
                        SprintId = dto.SprintId,
                        StoryId = story.StoryId,
                        CreatedById = dto.CreatedById,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Tasks.Add(task);
                }
                
                await _context.SaveChangesAsync();
            }

            // Return the created story with navigation properties loaded
            return await GetStoryByIdAsync(story.StoryId) ?? throw new InvalidOperationException("Failed to retrieve created story");
        }

        public async Task<StoryReadDTO?> GetStoryByIdAsync(int id)
        {
            var story = await _context.Stories
                .Include(s => s.Sprint)
                .Include(s => s.Project)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(s => s.StoryId == id);

            if (story == null) return null;

            return MapToReadDTO(story);
        }

        public async Task<List<StoryReadDTO>> GetStoriesBySprintAsync(int sprintId)
        {
            var stories = await _context.Stories
                .Include(s => s.Sprint)
                .Include(s => s.Project)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .Where(s => s.SprintId == sprintId)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();

            return stories.Select(MapToReadDTO).ToList();
        }

        public async Task<List<StoryReadDTO>> GetStoriesByProjectAsync(int projectId)
        {
            var stories = await _context.Stories
                .Include(s => s.Sprint)
                .Include(s => s.Project)
                .Include(s => s.CreatedBy)
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.Assignees)
                        .ThenInclude(a => a.User)
                .Where(s => s.ProjectId == projectId)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();

            return stories.Select(MapToReadDTO).ToList();
        }

        public async Task<StoryReadDTO?> UpdateStoryAsync(int id, StoryUpdateDTO dto)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story == null) return null;

            // Update only provided fields
            if (!string.IsNullOrEmpty(dto.Title))
                story.Title = dto.Title;
            
            if (dto.Description != null)
                story.Description = dto.Description;
            
            if (dto.AcceptanceCriteria != null)
                story.AcceptanceCriteria = dto.AcceptanceCriteria;
            
            if (dto.StoryPoints.HasValue)
                story.StoryPoints = dto.StoryPoints.Value;
            
            if (!string.IsNullOrEmpty(dto.Priority))
                story.Priority = Enum.Parse<StoryPriority>(dto.Priority);
            
            if (!string.IsNullOrEmpty(dto.Status))
                story.Status = Enum.Parse<StoryStatus>(dto.Status);
            
            if (dto.SprintId.HasValue)
                story.SprintId = dto.SprintId;

            story.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            return await GetStoryByIdAsync(id);
        }

        public async Task<bool> DeleteStoryAsync(int id)
        {
            var story = await _context.Stories
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.StoryId == id);

            if (story == null) return false;

            // Update tasks to remove story reference
            foreach (var task in story.Tasks)
            {
                task.StoryId = null;
            }

            _context.Stories.Remove(story);
            await _context.SaveChangesAsync();
            
            return true;
        }

        private static StoryReadDTO MapToReadDTO(Story s)
        {
            var completedTasks = s.Tasks?.Count(t => t.Status == TaskStatus.Completed) ?? 0;
            var totalTasks = s.Tasks?.Count ?? 0;

            return new StoryReadDTO
            {
                StoryId = s.StoryId,
                Title = s.Title,
                Description = s.Description,
                AcceptanceCriteria = s.AcceptanceCriteria,
                StoryPoints = s.StoryPoints,
                Priority = s.Priority.ToString(),
                Status = s.Status.ToString(),
                SprintId = s.SprintId,
                ProjectId = s.ProjectId,
                CreatedById = s.CreatedById,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                SprintName = s.Sprint?.Name,
                ProjectName = s.Project?.Name ?? "",
                CreatedByName = s.CreatedBy?.Email ?? "",
                TaskCount = totalTasks,
                CompletedTaskCount = completedTasks,
                ProgressPercentage = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0,
                Tasks = s.Tasks?.Select(t => new TaskReadDTO
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    DueDate = t.DueDate,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    AssignedTo = t.Assignees?.FirstOrDefault()?.User?.FirstName + " " + 
                               t.Assignees?.FirstOrDefault()?.User?.LastName
                }).ToList() ?? new List<TaskReadDTO>()
            };
        }
    }
}