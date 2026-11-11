using FarmerScheme.API.Domain.Enums;

namespace FarmerScheme.API.Application.DTOs.Response
{
    public class SellRequestResponseDto
    {
        public int Id { get; set; }
        public int CropId { get; set; }
        public string CropName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal BasePrice { get; set; }
        public SellRequestStatus Status { get; set; }
        public decimal? CurrentHighestBid { get; set; }
        public int? WinnerBidderId { get; set; }
        public string? WinnerBidderName { get; set; }
        public decimal? WinningAmount { get; set; }
        public DateTime? ClosedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
