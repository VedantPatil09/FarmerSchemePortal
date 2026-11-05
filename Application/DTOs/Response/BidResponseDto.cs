namespace FarmerScheme.API.Application.DTOs.Response
{
    public class BidResponseDto
    {
        public int Id { get; set; }
        public int SellRequestId { get; set; }
        public int BidderId { get; set; }
        public string BidderName { get; set; } = string.Empty;
        public decimal BidAmount { get; set; }
        public bool IsWinningBid { get; set; }
        public DateTime BidTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
