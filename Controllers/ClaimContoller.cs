using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FarmerScheme.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimController : ControllerBase
    {
        private readonly IClaimService _claimService;

        public ClaimController(IClaimService claimService)
        {
            _claimService = claimService;
        }

        [Authorize(Roles = "Farmer")]
        [HttpPost]
        public async Task<IActionResult> CreateClaim(CreateClaimDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _claimService.CreateClaimAsync(dto, userId);

            return Ok(new ApiResponse<object>(true, "Claim submitted successfully", result));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("process/{claimId}")]
        public async Task<IActionResult> ApproveClaim(int claimId)
        {
            await _claimService.ApproveClaimAsync(claimId);

            return Ok(new ApiResponse<object>(true, "Claim approved successfully", null));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetClaims()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isAdmin = User.IsInRole("Admin");

            var result = await _claimService.GetClaimsAsync(userId, isAdmin);

            return Ok(new ApiResponse<object>(true, "Claims fetched", result));
        }
    }
}