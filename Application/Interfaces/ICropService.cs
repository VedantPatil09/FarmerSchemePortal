namespace FarmerScheme.API.Domain.Entities
{

    public interface ICropService
    {
        Task<Crop> CreateCropAsync(int farmerId, CreateCropDto dto);

        Task<List<Crop>> GetMyCropsAsync(int farmerId, int page = 1, int pageSize = 20);

        Task<Crop?> GetCropByIdAsync(int cropId);

        Task<bool> UpdateCropAsync(int cropId, int farmerId, UpdateCropDto dto);

        Task<bool> DeleteCropAsync(int cropId, int farmerId);
    }
}