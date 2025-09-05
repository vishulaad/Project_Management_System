namespace webapp.DTOs.Stories
{
    public class StoryUpdateDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? AcceptanceCriteria { get; set; }
        public int? StoryPoints { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public int? SprintId { get; set; }
    }
}