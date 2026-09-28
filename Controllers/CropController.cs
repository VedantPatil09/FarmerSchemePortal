using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Farmer")]
public class CropController : ControllerBase
{
    private readonly ICropService _cropService;

    public CropController(ICropService cropService)
    {
        _cropService = cropService;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCrop(CreateCropDto dto)
    {
        var farmerId = GetUserId();

        var crop = await _cropService.CreateCropAsync(farmerId, dto);

        return Ok(new ApiResponse<object>(true, "Crop created successfully", crop));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCrops()
    {
        var farmerId = GetUserId();

        var crops = await _cropService.GetMyCropsAsync(farmerId);

        return Ok(new ApiResponse<object>(true, "Crops fetched successfully", crops));
    }

    [HttpPut("{cropId}")]
    public async Task<IActionResult> UpdateCrop(int cropId, UpdateCropDto dto)
    {
        var farmerId = GetUserId();

        await _cropService.UpdateCropAsync(cropId, farmerId, dto);

        return Ok(new ApiResponse<object>(true, "Crop updated successfully", null));
    }

}