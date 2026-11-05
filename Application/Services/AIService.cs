using AutoMapper;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

public class AIService : IAIService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AIService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<AIQueryLog> AskAiAsync(int farmerId, AskAiDto dto)
    {
        var crop = await _context.Crops
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == dto.CropId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        var responseBuilder = new StringBuilder();
        responseBuilder.AppendLine($"Expert Agricultural Advisory for {crop.CropName} ({crop.CropType}):");
        responseBuilder.AppendLine($"- Soil & Nutrient Care: Optimal for {crop.SoilType} soil. Maintain balanced NPK application with organic compost prior to flowering.");
        responseBuilder.AppendLine($"- Irrigation Strategy: Tailored for {crop.Season} cultivation in {crop.Location}. Implement drip or scheduled furrow irrigation to avoid waterlogging.");
        responseBuilder.AppendLine($"- Pest & Disease Prevention: Monitor regularly for common {crop.CropType.ToLower()} pests, applying biological neem spray or recommended fungicides during early humidity spikes.");
        
        if (!string.IsNullOrWhiteSpace(dto.Prompt))
        {
            responseBuilder.AppendLine($"- Concerning your query ('{dto.Prompt.Trim()}'):");
            responseBuilder.AppendLine($"  Ensure timely soil testing and verify local weather advisories for {crop.Location} to adjust treatment accordingly.");
        }

        var aiResponse = responseBuilder.ToString();

        var log = _mapper.Map<AIQueryLog>(dto);
        log.FarmerId = farmerId;
        log.AIResponse = aiResponse;

        _context.AIQueryLogs.Add(log);
        await _context.SaveChangesAsync();

        return log;
    }

    public async Task<List<AIQueryLog>> GetFarmerQueriesAsync(int farmerId)
    {
        return await _context.AIQueryLogs
            .AsNoTracking()
            .Where(q => q.FarmerId == farmerId)
            .Include(q => q.Crop)
            .OrderByDescending(q => q.CreatedAt)
            .ToListAsync();
    }
}
