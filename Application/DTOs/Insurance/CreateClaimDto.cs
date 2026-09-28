namespace FarmerScheme.API.Application.DTOs.Insurance
{
    public class CreateClaimDto
    {
        public int InsuranceApplicationId { get; set; }

        public string CauseOfLoss { get; set; } = null!;

        public DateTime DateOfLoss { get; set; }

        public string DamageProofFilePath { get; set; } = null!;
    }
}
