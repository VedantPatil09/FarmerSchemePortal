using FarmerScheme.API.Domain.Entities;

public interface ISellRequestService
{
    Task<SellRequest> CreateSellRequestAsync(int farmerId, int cropId);

    Task<List<SellRequest>> GetAllSellRequestsAsync(int page = 1, int pageSize = 20);

    Task<object> GetOpenAuctionsAsync(int page = 1, int pageSize = 20);

    Task<bool> ApproveSellRequestAsync(int sellRequestId);

    Task<bool> CloseAuctionAsync(int sellRequestId);

    Task<object> GetAuctionResultAsync(int sellRequestId);
}