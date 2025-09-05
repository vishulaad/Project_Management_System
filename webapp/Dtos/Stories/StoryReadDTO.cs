using System;
using System.Collections.Generic;
using webapp.DTOs.Tasks;

namespace webapp.DTOs.Stories
{
    public class StoryReadDTO
    {
        public int StoryId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? AcceptanceCriteria { get; set; }
        public int StoryPoints { get; set; }
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int? SprintId { get; set; }
        public int ProjectId { get; set; }
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Related Properties
        public string? SprintName { get; set; }
        public string ProjectName { get; set; } = null!;
        public string CreatedByName { get; set; } = null!;
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public double ProgressPercentage { get; set; }

        // Navigation Properties
        public List<TaskReadDTO>? Tasks { get; set; }
    }
}