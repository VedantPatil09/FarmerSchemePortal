using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
[IgnoreAntiforgeryToken]
public class AdminController(IAdminService service) : ControllerBase
{
    private readonly IAdminService _service = service;

    // ---------------- USERS ----------------

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var users = await _service.GetPendingUsersAsync();

        return Ok(new ApiResponse<object>(true, "Pending users fetched", users));
    }

    [HttpPut("approve-user/{userId}")]
    public async Task<IActionResult> ApproveUser([FromRoute] int userId)
    {
        await _service.ApproveUserAsync(userId);

        return Ok(new ApiResponse<object>(true, "User approved successfully", null));
    }

    // ---------------- CROPS ----------------

    [HttpGet("pending-crops")]
    public async Task<IActionResult> GetPendingCrops()
    {
        var crops = await _service.GetPendingCropsAsync();

        return Ok(new ApiResponse<object>(true, "Pending crops fetched", crops));
    }

    [HttpPut("approve-crop/{cropId}")]
    public async Task<IActionResult> ApproveCrop([FromRoute] int cropId)
    {
        await _service.ApproveCropAsync(cropId);

        return Ok(new ApiResponse<object>(true, "Crop approved successfully", null));
    }

    // ---------------- SELL REQUESTS ----------------

    [HttpGet("pending-sellrequests")]
    public async Task<IActionResult> GetPendingSellRequests()
    {
        var requests = await _service.GetPendingSellRequestsAsync();

        return Ok(new ApiResponse<object>(true, "Pending sell requests fetched", requests));
    }
}