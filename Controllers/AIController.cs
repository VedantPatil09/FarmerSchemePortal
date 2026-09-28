using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Farmer")]
[IgnoreAntiforgeryToken]
public class AIController(IAIService aiService) : ControllerBase
{
    private readonly IAIService _aiService = aiService;

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskAI([FromBody] AskAiDto dto)
    {
        var farmerId = GetUserId();

        var result = await _aiService.AskAiAsync(farmerId, dto);

        return Ok(new ApiResponse<object>(true, "AI response generated successfully", result));
    }

}