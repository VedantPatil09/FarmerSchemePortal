using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class InsuranceController : ControllerBase
{
    private readonly IInsuranceService _service;

    public InsuranceController(IInsuranceService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [Authorize(Roles = "Farmer")]
    [HttpPost("apply")]
    public async Task<IActionResult> ApplyInsurance(CreateInsuranceApplicationDto dto)
    {
        var farmerId = GetUserId();

        var result = await _service.ApplyInsuranceAsync(farmerId, dto);

        return Ok(new ApiResponse<object>(true, "Insurance application submitted", result));
    }

    [Authorize(Roles = "Farmer")]
    [HttpGet]
    public async Task<IActionResult> MyApplications()
    {
        var farmerId = GetUserId();

        var result = await _service.GetMyApplicationsAsync(farmerId);

        return Ok(new ApiResponse<object>(true, "Applications fetched successfully", result));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("approve/{applicationId}")]
    public async Task<IActionResult> ApproveInsurance(int applicationId)
    {
        await _service.ApproveInsuranceAsync(applicationId);

        return Ok(new ApiResponse<object>(true, "Insurance approved successfully", null));
    }

    [Authorize(Roles = "Farmer")]
    [HttpPost("calculate")]
    public IActionResult CalculatePremium([FromBody] CalculatePremiumDto dto)
    {
        var premium = _service.CalculatePremium(dto.SumInsured, dto.LandArea, dto.Season);

        return Ok(new ApiResponse<object>(true, "Premium calculated successfully", new
        {
            sumInsured = dto.SumInsured,
            landArea = dto.LandArea,
            season = dto.Season.ToString(),
            premiumAmount = premium
        }));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllApplications()
    {
        var result = await _service.GetAllApplicationsAsync();

        return Ok(new ApiResponse<object>(true, "All applications fetched", result));
    }
}