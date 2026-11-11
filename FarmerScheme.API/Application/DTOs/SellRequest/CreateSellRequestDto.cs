using System.ComponentModel.DataAnnotations;

public class CreateSellRequestDto
{
    [Required]
    public int CropId { get; set; }
}