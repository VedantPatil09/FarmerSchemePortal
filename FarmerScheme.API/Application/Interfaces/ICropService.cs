using FarmerScheme.API.Application.DTOs.Response;

namespace FarmerScheme.API.Application.Interfaces
{
    public interface ICropService
    {
        Task<CropResponseDto> CreateCropAsync(int farmerId, CreateCropDto dto);

        Task<List<CropResponseDto>> GetMyCropsAsync(int farmerId, int page = 1, int pageSize = 20);

        Task<CropResponseDto?> GetCropByIdAsync(int cropId);

        Task<bool> UpdateCropAsync(int cropId, int farmerId, UpdateCropDto dto);

        Task<bool> DeleteCropAsync(int cropId, int farmerId);
    }
}
