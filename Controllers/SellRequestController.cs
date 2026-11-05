using FarmerScheme.API.Application.DTOs.Response;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class SellRequestController : ControllerBase
{
    private readonly ISellRequestService _service;

    public SellRequestController(ISellRequestService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [Authorize(Roles = "Farmer")]
    [HttpPost]
    public async Task<IActionResult> CreateSellRequest([FromBody] CreateSellRequestDto dto)
    {
        var farmerId = GetUserId();

        var result = await _service.CreateSellRequestAsync(farmerId, dto.CropId);

        return Ok(new ApiResponse<SellRequestResponseDto>(true, "Sell request created", result));
    }

    [Authorize(Roles = "Farmer,Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllSellRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetAllSellRequestsAsync(page, pageSize);

        return Ok(new ApiResponse<List<SellRequestResponseDto>>(true, "Sell requests fetched", result));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("approve/{sellRequestId}")]
    public async Task<IActionResult> ApproveSellRequest(int sellRequestId)
    {
        await _service.ApproveSellRequestAsync(sellRequestId);

        return Ok(new ApiResponse<object>(true, "Sell request approved", null));
    }

    [HttpGet("open-auctions")]
    public async Task<IActionResult> GetOpenAuctions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetOpenAuctionsAsync(page, pageSize);

        return Ok(new ApiResponse<object>(true, "Open auctions fetched successfully", result));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("close/{sellRequestId}")]
    public async Task<IActionResult> CloseAuction(int sellRequestId)
    {
        await _service.CloseAuctionAsync(sellRequestId);

        return Ok(new ApiResponse<object>(true, "Auction closed successfully", null));
    }

    [HttpGet("result/{sellRequestId}")]
    public async Task<IActionResult> GetAuctionResult(int sellRequestId)
    {
        var result = await _service.GetAuctionResultAsync(sellRequestId);

        return Ok(new ApiResponse<object>(true, "Auction result fetched", result));
    }
}
