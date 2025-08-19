namespace webapp.DTOs.Companies
{
    public class CompanyCreateDTO
    {
        public string CompanyCode { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string OwnerEmail { get; set; } = null!;
    }
}
