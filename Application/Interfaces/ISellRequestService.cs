using FarmerScheme.API.Application.DTOs.Response;

namespace FarmerScheme.API.Application.Interfaces
{
    public interface ISellRequestService
    {
        Task<SellRequestResponseDto> CreateSellRequestAsync(int farmerId, int cropId);

        Task<List<SellRequestResponseDto>> GetAllSellRequestsAsync(int page = 1, int pageSize = 20);

        Task<object> GetOpenAuctionsAsync(int page = 1, int pageSize = 20);

        Task<bool> ApproveSellRequestAsync(int sellRequestId);

        Task<bool> CloseAuctionAsync(int sellRequestId);

        Task<object> GetAuctionResultAsync(int sellRequestId);
    }
}
