namespace webapp.DTOs
{
    public class DepartmentReadDTO
    {
        public int DepartmentId { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        // Related info
        public string CompanyName { get; set; } = null!;
        public int TotalEmployees { get; set; }
    }
}
