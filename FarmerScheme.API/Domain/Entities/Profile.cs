using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.Text.Json.Serialization;

namespace FarmerScheme.API.Domain.Entities
{
    public class Profile : BaseEntity
    {
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        public ProfileType ProfileType { get; set; }

        // Farmer specific
        public decimal? LandArea { get; set; }
        public string? LandAddress { get; set; }

        // Bidder specific
        public string? CompanyName { get; set; }

        // Common bank info
        public string BankAccountNumber { get; set; } = null!;
        public string IFSCCode { get; set; } = null!;

        public ICollection<Document> Documents { get; set; } = new List<Document>();


    }
}