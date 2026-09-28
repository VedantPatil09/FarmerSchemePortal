using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Entities;
using System.Text.Json.Serialization;

public class AIQueryLog : BaseEntity
{
    public int FarmerId { get; set; }

    public int CropId { get; set; }

    [JsonIgnore]
    public Crop Crop { get; set; } = null!;

    public string PromptUsed { get; set; } = null!;
    public string AIResponse { get; set; } = null!;

    [JsonIgnore]
    public User Farmer { get; set; } = null!;
}