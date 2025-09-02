using System;

namespace webapp.DTOs.Sprints
{
    public class SprintCreateDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = null!;
        public int ProjectId { get; set; }
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
    }
}