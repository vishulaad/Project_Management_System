using System;
using System.Collections.Generic;
using webapp.DTOs.Tasks;

namespace webapp.DTOs.Sprints
{
    public class SprintReadDTO
    {
        public int SprintId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = null!;
        public int ProjectId { get; set; }
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; }

        // Related/Computed Properties
        public string ProjectName { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string CreatedByName { get; set; } = null!;
        public int TaskCount { get; set; }
        public int CompletedTasks { get; set; }
        public int DaysRemaining { get; set; }
        public double ProgressPercentage { get; set; }
        
        // Navigation Properties
        public List<TaskReadDTO>? Tasks { get; set; }
    }
}