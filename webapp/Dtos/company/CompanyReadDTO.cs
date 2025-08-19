using System;

namespace webapp.DTOs.Companies
{
    public class CompanyReadDTO
    {
        public int CompanyId { get; set; }
        public string CompanyCode { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string OwnerEmail { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }

        // Aggregates
        public int TotalUsers { get; set; }
        public int TotalDepartments { get; set; }
        public int TotalProjects { get; set; }
        public int TotalTasks { get; set; }
    }
}
