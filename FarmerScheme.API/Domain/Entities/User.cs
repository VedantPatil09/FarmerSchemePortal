using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FarmerScheme.API.Domain.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = null!;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [Required]
        public RoleType Role { get; set; }

        public bool IsApproved { get; set; } = false;
        public bool IsActive { get; set; } = true;

        // Navigation

        [JsonIgnore]
        public Profile Profile { get; set; } = null!;
        public ICollection<Document> Documents { get; set; } = new List<Document>();


    }
}