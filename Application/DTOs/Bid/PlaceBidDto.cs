using System.ComponentModel.DataAnnotations;

public class PlaceBidDto
{
    [Required]
    public int SellRequestId { get; set; }

    [Required]
    public decimal BidAmount { get; set; }
}