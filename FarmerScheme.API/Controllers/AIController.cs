using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Farmer")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskAI([FromBody] AskAiDto dto)
    {
        var farmerId = GetUserId();

        var result = await _aiService.AskAiAsync(farmerId, dto);

        return Ok(new ApiResponse<object>(true, "AI advisory response generated successfully", result));
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetMyQueries()
    {
        var farmerId = GetUserId();

        var result = await _aiService.GetFarmerQueriesAsync(farmerId);

        return Ok(new ApiResponse<object>(true, "Query history fetched successfully", result));
    }
}
