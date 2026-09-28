using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FarmerScheme.API.Domain.Entities
{
    public class Crop : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string CropName { get; set; } = null!;

        [Required]
        public string CropType { get; set; } = null!;

        [Required]
        public string SoilType { get; set; } = null!;

        [Required]
        public string Season { get; set; } = null!;

        [Required]
        public string Location { get; set; } = null!;

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        public decimal BasePrice { get; set; }

        public BaseStatus Status { get; set; } = BaseStatus.Pending;

        public int FarmerId { get; set; }

        [JsonIgnore]
        public User Farmer { get; set; } = null!;

        public ICollection<SellRequest> SellRequests { get; set; } = new List<SellRequest>();
    }
}