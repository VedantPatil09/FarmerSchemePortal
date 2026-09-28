using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[IgnoreAntiforgeryToken]
public class BidController(IBidService bidService) : ControllerBase
{
    private readonly IBidService _bidService = bidService;

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [Authorize(Roles = "Bidder")]
    [HttpPost]
    public async Task<IActionResult> PlaceBid([FromBody] PlaceBidDto dto)
    {
        var bidderId = GetUserId();

        var bid = await _bidService.PlaceBidAsync(bidderId, dto);

        return Ok(new ApiResponse<object>(true, "Bid placed successfully", bid));
    }

    [HttpGet("{sellRequestId}")]
    public async Task<IActionResult> GetBids(int sellRequestId)
    {
        var bids = await _bidService.GetBidsForAuctionAsync(sellRequestId);

        return Ok(new ApiResponse<object>(true, "Bids fetched successfully", bids));
    }

    [HttpGet("history/{sellRequestId}")]
    public async Task<IActionResult> GetBidHistory(int sellRequestId)
    {
        var result = await _bidService.GetBidHistoryAsync(sellRequestId);

        return Ok(new ApiResponse<object>(true, "Bid history fetched successfully", result));
    }
}