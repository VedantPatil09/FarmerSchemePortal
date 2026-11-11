using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class PasswordResetToken : BaseEntity
{
    [Required]
    public int UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; } = null!;

    [Required]
    public string Token { get; set; } = null!;

    public DateTime ExpiryTime { get; set; }

    public bool IsUsed { get; set; } = false;
}