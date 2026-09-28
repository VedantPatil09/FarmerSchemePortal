using FarmerScheme.API.Domain.Entities;

namespace FarmerScheme.API.Application.Interfaces
{
    public interface IAdminService
    {
        // Users
        Task<List<User>> GetPendingUsersAsync(int page = 1, int pageSize = 20);
        Task<bool> ApproveUserAsync(int userId);

        // Crops
        Task<List<Crop>> GetPendingCropsAsync(int page = 1, int pageSize = 20);
        Task<bool> ApproveCropAsync(int cropId);

        // Sell Requests
        Task<List<SellRequest>> GetPendingSellRequestsAsync(int page = 1, int pageSize = 20);
    }
}