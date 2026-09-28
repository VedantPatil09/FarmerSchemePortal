using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Enums;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FarmerScheme.API.Domain.Entities
{
    public class InsuranceClaim : BaseEntity
    {
        public int InsuranceApplicationId { get; set; }

        [JsonIgnore]
        public InsuranceApplication InsuranceApplication { get; set; } = null!;

        public string CauseOfLoss { get; set; } = null!;

        public DateTime DateOfLoss { get; set; }

        public BaseStatus Status { get; set; } = BaseStatus.Pending;

        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}