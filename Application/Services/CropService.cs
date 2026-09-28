using AutoMapper;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class CropService : ICropService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CropService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }


    private async Task EnsureProfileVerified(int farmerId)
    {
        var farmer = await _context.Users
            .FirstOrDefaultAsync(f => f.Id == farmerId);

        if (farmer == null)
            throw new KeyNotFoundException("Farmer not found");

    }

    public async Task<Crop> CreateCropAsync(int farmerId, CreateCropDto dto)
    {
        await EnsureProfileVerified(farmerId);

        var crop = _mapper.Map<Crop>(dto);

        crop.FarmerId = farmerId;
        crop.Status = BaseStatus.Pending;

        _context.Crops.Add(crop);

        await _context.SaveChangesAsync();

        return crop;
    }

    public async Task<List<Crop>> GetMyCropsAsync(int farmerId, int page = 1, int pageSize = 20)
    {
        return await _context.Crops
            .Where(c => c.FarmerId == farmerId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Crop?> GetCropByIdAsync(int cropId)
    {
        return await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == cropId);
    }

    public async Task<bool> UpdateCropAsync(int cropId, int farmerId, UpdateCropDto dto)
    {
        var crop = await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == cropId && c.FarmerId == farmerId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        _mapper.Map(dto, crop);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCropAsync(int cropId, int farmerId)
    {
        var crop = await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == cropId && c.FarmerId == farmerId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        _context.Crops.Remove(crop);

        await _context.SaveChangesAsync();

        return true;
    }
}