using FarmerScheme.API.Application.DTOs.Profile;
using FarmerScheme.API.Domain.Enums;

public class CreateProfileDto
{
    public ProfileType ProfileType { get; set; }

    // Farmer
    public decimal? LandArea { get; set; }
    public string? LandAddress { get; set; }

    // Bidder
    public string? CompanyName { get; set; }

    // Bank details
    public string BankAccountNumber { get; set; } = null!;
    public string IFSCCode { get; set; } = null!;

    public List<KycDocumentDto> Documents { get; set; } = new();
}