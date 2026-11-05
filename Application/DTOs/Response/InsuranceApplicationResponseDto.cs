using FarmerScheme.API.Domain.Enums;

namespace FarmerScheme.API.Application.DTOs.Response
{
    public class InsuranceApplicationResponseDto
    {
        public int Id { get; set; }
        public int FarmerId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public int CropId { get; set; }
        public string CropName { get; set; } = null!;
        public SeasonType Season { get; set; }
        public ZoneType Zone { get; set; }
        public decimal LandArea { get; set; }
        public decimal SumInsured { get; set; }
        public decimal PremiumAmount { get; set; }
        public BaseStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
