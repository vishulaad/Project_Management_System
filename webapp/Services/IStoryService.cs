using webapp.DTOs.Stories;

namespace webapp.Services
{
    public interface IStoryService
    {
        Task<StoryReadDTO> CreateStoryAsync(StoryCreateDTO dto);
        Task<StoryReadDTO?> GetStoryByIdAsync(int id);
        Task<List<StoryReadDTO>> GetStoriesBySprintAsync(int sprintId);
        Task<List<StoryReadDTO>> GetStoriesByProjectAsync(int projectId);
        Task<StoryReadDTO?> UpdateStoryAsync(int id, StoryUpdateDTO dto);
        Task<bool> DeleteStoryAsync(int id);
    }
}