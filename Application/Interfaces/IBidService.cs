using FarmerScheme.API.Domain.Entities;

public interface IBidService
{
    Task<Bid> PlaceBidAsync(int bidderId, PlaceBidDto dto);

    Task<List<Bid>> GetBidsForAuctionAsync(int sellRequestId);

    Task<object> GetBidHistoryAsync(int sellRequestId);
}