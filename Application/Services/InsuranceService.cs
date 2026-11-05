using AutoMapper;
using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.DTOs.Response;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class InsuranceService : IInsuranceService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public InsuranceService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<InsuranceApplicationResponseDto> ApplyInsuranceAsync(int farmerId, CreateInsuranceApplicationDto dto)
    {
        var crop = await _context.Crops
            .Include(c => c.Farmer)
            .FirstOrDefaultAsync(c => c.Id == dto.CropId && c.FarmerId == farmerId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found or does not belong to you");

        if (crop.Status != BaseStatus.Approved)
            throw new InvalidOperationException("Crop must be approved by admin before applying for insurance");

        var existingInsurance = await _context.InsuranceApplications
            .AnyAsync(i => i.CropId == dto.CropId);

        if (existingInsurance)
            throw new InvalidOperationException("Insurance application already exists for this crop");

        var activeOrClosedSellRequest = await _context.SellRequests
            .AnyAsync(s => s.CropId == dto.CropId && s.Status != SellRequestStatus.Pending);

        if (activeOrClosedSellRequest)
            throw new InvalidOperationException("Cannot apply for insurance once the crop is listed for auction or sold");

        var premium = CalculatePremium(dto.SumInsured, dto.LandArea, dto.Season);

        var application = new InsuranceApplication
        {
            FarmerId = farmerId,
            CropId = dto.CropId,
            CropName = dto.CropName,
            LandArea = dto.LandArea,
            SumInsured = dto.SumInsured,
            Season = dto.Season,
            Zone = dto.Zone,
            PremiumAmount = premium,
            Status = BaseStatus.Pending
        };

        _context.InsuranceApplications.Add(application);
        await _context.SaveChangesAsync();

        application.Farmer = crop.Farmer;

        return _mapper.Map<InsuranceApplicationResponseDto>(application);
    }

    public async Task<List<InsuranceApplicationResponseDto>> GetMyApplicationsAsync(int farmerId, int page = 1, int pageSize = 20)
    {
        var apps = await _context.InsuranceApplications
            .AsNoTracking()
            .Include(a => a.Farmer)
            .Where(a => a.FarmerId == farmerId)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return _mapper.Map<List<InsuranceApplicationResponseDto>>(apps);
    }

    public async Task<bool> ApproveInsuranceAsync(int applicationId)
    {
        var app = await _context.InsuranceApplications
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (app == null)
            throw new KeyNotFoundException("Insurance application not found");

        app.Status = BaseStatus.Approved;
        await _context.SaveChangesAsync();

        return true;
    }

    public decimal CalculatePremium(decimal sumInsured, decimal area, SeasonType season)
    {
        decimal rate = season switch
        {
            SeasonType.Kharif => 0.02m,
            SeasonType.Rabi => 0.015m,
            SeasonType.Summer => 0.01m,
            _ => 0.02m
        };

        return sumInsured * rate * area;
    }

    public async Task<List<InsuranceApplicationResponseDto>> GetAllApplicationsAsync(int page = 1, int pageSize = 20)
    {
        var apps = await _context.InsuranceApplications
            .AsNoTracking()
            .Include(i => i.Farmer)
            .OrderByDescending(i => i.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return _mapper.Map<List<InsuranceApplicationResponseDto>>(apps);
    }
}
