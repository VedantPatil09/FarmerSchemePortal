public class UpdateProfileDto
{
    public decimal? LandArea { get; set; }

    public string? LandAddress { get; set; }

    public string? CompanyName { get; set; }

    public string? BankAccountNumber { get; set; }

    public string? IFSCCode { get; set; }

    public List<UpdateDocumentDto>? Documents { get; set; }
}