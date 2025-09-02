using webapp.DTOs.Sprints;

namespace webapp.Services
{
    public interface ISprintService
    {
        Task<SprintReadDTO> CreateSprintAsync(SprintCreateDTO dto);
        Task<SprintReadDTO?> GetSprintByIdAsync(int id);
        Task<List<SprintReadDTO>> GetSprintsByProjectAsync(int projectId);
        Task<List<SprintReadDTO>> GetSprintsByCompanyAsync(int companyId);
        Task<List<SprintReadDTO>> GetSprintsByUserAsync(int userId);
        Task<SprintReadDTO?> UpdateSprintAsync(int id, SprintUpdateDTO dto);
        Task<bool> DeleteSprintAsync(int id);
        Task<string> GenerateSprintNameAsync(int projectId);
    }
}