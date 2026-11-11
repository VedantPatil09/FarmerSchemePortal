using System.ComponentModel.DataAnnotations;

public class CreateCropDto
{
    [Required]
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
}