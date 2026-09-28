using FarmerScheme.API.Domain.Enums;

public class ProfileResponseDto
{
    public UserResponseDto User { get; set; } = null!;

    public ProfileType ProfileType { get; set; }

    public decimal? LandArea { get; set; }

    public string? LandAddress { get; set; }

    public string? CompanyName { get; set; }

    public string BankAccountNumber { get; set; } = null!;

    public string IFSCCode { get; set; } = null!;

    public bool IsVerified { get; set; }

    public List<DocumentResponseDto> Documents { get; set; } = new();
}