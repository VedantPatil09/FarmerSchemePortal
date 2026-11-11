using FarmerScheme.API.Domain.Entities;

public interface IProfileService
{
    Task<Profile> CreateProfileAsync(int userId, CreateProfileDto dto);

    Task<ProfileResponseDto> GetMyProfileAsync(int userId, int page = 1, int pageSize = 20);

    Task<Profile> UpdateProfileAsync(int userId, UpdateProfileDto dto);

    Task<bool> DeleteProfileAsync(int userId);
}