using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FarmerScheme.API.Domain.Entities
{
    public class InsuranceApplication : BaseEntity
    {
        public int FarmerId { get; set; }

        [JsonIgnore]
        public User Farmer { get; set; } = null!;

        public string CropName { get; set; } = null!;

        public SeasonType Season { get; set; }

        public ZoneType Zone { get; set; }

        public decimal LandArea { get; set; }

        public decimal SumInsured { get; set; }

        public decimal PremiumAmount { get; set; }

        public BaseStatus Status { get; set; } = BaseStatus.Pending;

        public InsuranceClaim? Claim { get; set; }

        public int CropId { get; set; }

        [JsonIgnore]
        public Crop Crop { get; set; } = null!;
    }
}