using AutoMapper;
using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class ClaimService : IClaimService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ClaimService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<InsuranceClaim> CreateClaimAsync(CreateClaimDto dto, int userId)
    {
        var application = await _context.InsuranceApplications
            .FirstOrDefaultAsync(a => a.Id == dto.InsuranceApplicationId && a.FarmerId == userId);

        if (application == null)
            throw new KeyNotFoundException("Insurance application not found or does not belong to you");

        if (application.Status != BaseStatus.Approved)
            throw new InvalidOperationException("Cannot file a claim on an insurance application that has not been approved");

        var existingClaim = await _context.InsuranceClaims
            .AnyAsync(c => c.InsuranceApplicationId == dto.InsuranceApplicationId);

        if (existingClaim)
            throw new InvalidOperationException("A claim has already been submitted for this insurance application");

        var cropSold = await _context.SellRequests
            .AnyAsync(s => s.CropId == application.CropId && s.Status == SellRequestStatus.Closed);

        if (cropSold)
            throw new InvalidOperationException("Cannot claim insurance for a crop that has already been sold at auction");

        var claim = new InsuranceClaim
        {
            InsuranceApplicationId = dto.InsuranceApplicationId,
            CauseOfLoss = dto.CauseOfLoss,
            DateOfLoss = dto.DateOfLoss
        };

        _context.InsuranceClaims.Add(claim);
        await _context.SaveChangesAsync();

        var document = new Document
        {
            UserId = userId,
            DocumentType = DocumentType.CropDamageProof,
            FilePath = dto.DamageProofFilePath,
            ClaimId = claim.Id
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return claim;
    }

    public async Task<bool> ApproveClaimAsync(int claimId)
    {
        var claim = await _context.InsuranceClaims
            .FirstOrDefaultAsync(c => c.Id == claimId);

        if (claim == null)
            throw new KeyNotFoundException("Claim not found");

        claim.Status = BaseStatus.Approved;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<ClaimResponseDto>> GetClaimsAsync(int userId, bool isAdmin)
    {
        var query = _context.InsuranceClaims
            .AsNoTracking()
            .Include(c => c.InsuranceApplication)
                .ThenInclude(a => a.Farmer)
            .Include(c => c.Documents)
            .AsQueryable();

        if (!isAdmin)
            query = query.Where(c => c.InsuranceApplication.FarmerId == userId);

        var claims = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();

        return claims.Select(c => new ClaimResponseDto
        {
            Id = c.Id,
            InsuranceApplicationId = c.InsuranceApplicationId,
            CropName = c.InsuranceApplication.CropName,
            FarmerName = c.InsuranceApplication.Farmer.FullName,
            CauseOfLoss = c.CauseOfLoss,
            DateOfLoss = c.DateOfLoss,
            Status = c.Status.ToString(),
            CreatedAt = c.CreatedAt,
            DamageProofFiles = c.Documents.Select(d => d.FilePath).ToList()
        }).ToList();
    }
}
