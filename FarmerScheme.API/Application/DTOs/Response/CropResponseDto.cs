using FarmerScheme.API.Domain.Enums;

namespace FarmerScheme.API.Application.DTOs.Response
{
    public class CropResponseDto
    {
        public int Id { get; set; }
        public string CropName { get; set; } = null!;
        public string CropType { get; set; } = null!;
        public string SoilType { get; set; } = null!;
        public string Season { get; set; } = null!;
        public string Location { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal BasePrice { get; set; }
        public BaseStatus Status { get; set; }
        public int FarmerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
