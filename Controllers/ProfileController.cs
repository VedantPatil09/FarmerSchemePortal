using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile(CreateProfileDto dto)
    {
        var userId = GetUserId();

        var result = await _profileService.CreateProfileAsync(userId, dto);

        return Ok(new ApiResponse<object>(true, "Profile created successfully", result));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserId();

        var profile = await _profileService.GetMyProfileAsync(userId);

        return Ok(new ApiResponse<object>(true, "Profile fetched successfully", profile));
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _profileService.UpdateProfileAsync(userId, dto);

        return Ok(new ApiResponse<object>(true, "Profile updated successfully", result));
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProfile()
    {
        var userId = GetUserId();

        await _profileService.DeleteProfileAsync(userId);

        return Ok(new ApiResponse<object>(true, "Profile deleted successfully", null));
    }
}