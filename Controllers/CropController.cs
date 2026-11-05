using FarmerScheme.API.Application.DTOs.Response;
using FarmerScheme.API.Application.Interfaces;
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
    public async Task<IActionResult> CreateCrop([FromBody] CreateCropDto dto)
    {
        var farmerId = GetUserId();

        var crop = await _cropService.CreateCropAsync(farmerId, dto);

        return Ok(new ApiResponse<CropResponseDto>(true, "Crop created successfully", crop));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCrops([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var farmerId = GetUserId();

        var crops = await _cropService.GetMyCropsAsync(farmerId, page, pageSize);

        return Ok(new ApiResponse<List<CropResponseDto>>(true, "Crops fetched successfully", crops));
    }

    [HttpGet("{cropId}")]
    public async Task<IActionResult> GetCropById(int cropId)
    {
        var crop = await _cropService.GetCropByIdAsync(cropId);

        if (crop == null)
            return NotFound(new ApiResponse<object>(false, "Crop not found", null));

        return Ok(new ApiResponse<CropResponseDto>(true, "Crop fetched successfully", crop));
    }

    [HttpPut("{cropId}")]
    public async Task<IActionResult> UpdateCrop(int cropId, [FromBody] UpdateCropDto dto)
    {
        var farmerId = GetUserId();

        await _cropService.UpdateCropAsync(cropId, farmerId, dto);

        return Ok(new ApiResponse<object>(true, "Crop updated successfully", null));
    }

    [HttpDelete("{cropId}")]
    public async Task<IActionResult> DeleteCrop(int cropId)
    {
        var farmerId = GetUserId();

        await _cropService.DeleteCropAsync(cropId, farmerId);

        return Ok(new ApiResponse<object>(true, "Crop deleted successfully", null));
    }
}
