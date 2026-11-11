using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

public interface IClaimService
{
    Task<InsuranceClaim> CreateClaimAsync(CreateClaimDto dto, int userId);

    Task<bool> ApproveClaimAsync(int claimId);

    Task<List<ClaimResponseDto>> GetClaimsAsync(int userId, bool isAdmin);
}