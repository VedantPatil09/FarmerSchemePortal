using System.ComponentModel.DataAnnotations;

namespace FarmerScheme.API.Common
{
    public class BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
