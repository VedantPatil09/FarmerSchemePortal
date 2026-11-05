using FarmerScheme.API.Application.DTOs.Response;

namespace FarmerScheme.API.Application.Interfaces
{
    public interface IBidService
    {
        Task<BidResponseDto> PlaceBidAsync(int bidderId, PlaceBidDto dto);

        Task<List<BidResponseDto>> GetBidsForAuctionAsync(int sellRequestId);

        Task<List<BidResponseDto>> GetBidHistoryAsync(int sellRequestId);
    }
}
