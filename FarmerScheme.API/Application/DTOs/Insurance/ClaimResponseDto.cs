namespace FarmerScheme.API.Application.DTOs.Insurance
{
    public class ClaimResponseDto
    {
        public int Id { get; set; }
        public int InsuranceApplicationId { get; set; }
        public string CropName { get; set; } = null!;
        public string FarmerName { get; set; } = null!;
        public string CauseOfLoss { get; set; } = null!;
        public DateTime DateOfLoss { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public List<string> DamageProofFiles { get; set; } = new();
    }
}
