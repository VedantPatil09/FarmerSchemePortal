using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace FarmerScheme.API.Application.DTOs.Insurance
{
    public class CalculatePremiumDto
    {
        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Sum insured must be greater than 0")]
        public decimal SumInsured { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Land area must be greater than 0")]
        public decimal LandArea { get; set; }

        [Required]
        public SeasonType Season { get; set; }
    }
}
