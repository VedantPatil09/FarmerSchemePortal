using System.Text.Json.Serialization;
using FarmerScheme.API.Common;

namespace FarmerScheme.API.Domain.Entities
{
    public class Document : BaseEntity
    {
        public int UserId { get; set; }

        public DocumentType DocumentType { get; set; }

        public string FilePath { get; set; } = null!;

        public int? ClaimId { get; set; }

        [JsonIgnore]
        public InsuranceClaim? InsuranceClaim { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;
    }
}