namespace webapp.DTOs.Sprints
{
    public class SprintCreateDTO
    {
        public string? Name { get; set; } // optional, will auto-generate if missing
        public string? Status { get; set; } // optional, default = "Planned"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

          public string? Description { get; set; }
        public int ProjectId { get; set; }
        public int CompanyId { get; set; }
        public int CreatedById { get; set; }
    }
}
