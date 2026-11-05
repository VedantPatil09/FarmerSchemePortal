using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service)
    {
        _service = service;
    }

    // ---------------- USERS ----------------

    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var users = await _service.GetPendingUsersAsync(page, pageSize);

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
    public async Task<IActionResult> GetPendingCrops([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var crops = await _service.GetPendingCropsAsync(page, pageSize);

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
    public async Task<IActionResult> GetPendingSellRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var requests = await _service.GetPendingSellRequestsAsync(page, pageSize);

        return Ok(new ApiResponse<object>(true, "Pending sell requests fetched", requests));
    }
}
