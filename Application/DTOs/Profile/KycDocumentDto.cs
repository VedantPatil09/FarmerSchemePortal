namespace FarmerScheme.API.Application.DTOs.Profile
{
    public class KycDocumentDto
    {
        public DocumentType DocumentType { get; set; }

        public string FilePath { get; set; } = null!;
    }
}
