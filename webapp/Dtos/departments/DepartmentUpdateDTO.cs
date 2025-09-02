namespace webapp.DTOs
{
    public class DepartmentUpdateDTO
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
