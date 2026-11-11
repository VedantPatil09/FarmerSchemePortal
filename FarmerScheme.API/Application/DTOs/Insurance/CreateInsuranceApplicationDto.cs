using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;

public class CreateInsuranceApplicationDto
{
    [Required]
    public int CropId { get; set; }

    [Required]
    public string CropName { get; set; } = null!;

    [Required]
    public SeasonType Season { get; set; }

    [Required]
    public ZoneType Zone { get; set; }

    [Required]
    public decimal LandArea { get; set; }

    [Required]
    public decimal SumInsured { get; set; }
}