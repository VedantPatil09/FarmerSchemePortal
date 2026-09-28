using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Entities;
using System.Text.Json.Serialization;

public class Bid : BaseEntity
{
    public int SellRequestId { get; set; }

    [JsonIgnore]
    public SellRequest SellRequest { get; set; } = null!;

    public int BidderId { get; set; }

    [JsonIgnore]
    public User Bidder { get; set; } = null!;

    public decimal BidAmount { get; set; }

    public bool IsWinningBid { get; set; } = false;

    public DateTime BidTime { get; set; } = DateTime.UtcNow;
}