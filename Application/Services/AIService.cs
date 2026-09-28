using AutoMapper;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
            .FirstOrDefaultAsync(c => c.Id == dto.CropId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        // Temporary AI Response (later Ollama integration)
        var aiResponse = $"Based on crop {crop.CropName}, recommendation: Ensure proper irrigation and soil nutrients.";

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
            .Where(q => q.FarmerId == farmerId)
            .Include(q => q.Crop)
            .ToListAsync();
    }
}