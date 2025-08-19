namespace webapp.DTOs
{
    public class DepartmentCreateDTO
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
