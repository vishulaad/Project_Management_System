using System;
using System.Collections.Generic;
using webapp.DTOs.Tasks;

namespace webapp.DTOs.Stories
{
    public class StoryCreateDTO
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? AcceptanceCriteria { get; set; }
        public int StoryPoints { get; set; } = 0;
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "Backlog";
        public int? SprintId { get; set; }
        public int ProjectId { get; set; }
        public int CreatedById { get; set; }
        
        // Tasks to be created with this story
        public List<TaskCreateDTO>? Tasks { get; set; }
    }
}