using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.Text.Json.Serialization;

namespace FarmerScheme.API.Domain.Entities
{
    public class SellRequest : BaseEntity
    {
        public int CropId { get; set; }

        [JsonIgnore]
        public Crop Crop { get; set; } = null!;

        public SellRequestStatus Status { get; set; } = SellRequestStatus.Pending;

        public ICollection<Bid> Bids { get; set; } = new List<Bid>();

        public int? WinnerBidderId { get; set; }

        public decimal? WinningAmount { get; set; }

        public DateTime? ClosedAt { get; set; }
    }
}