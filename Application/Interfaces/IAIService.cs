using FarmerScheme.API.Domain.Entities;

public interface IAIService
{
    Task<AIQueryLog> AskAiAsync(int farmerId, AskAiDto dto);

    Task<List<AIQueryLog>> GetFarmerQueriesAsync(int farmerId);
}