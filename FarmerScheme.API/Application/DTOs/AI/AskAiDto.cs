using System.ComponentModel.DataAnnotations;

public class AskAiDto
{
    [Required]
    public int CropId { get; set; }

    [Required]
    public string Prompt { get; set; } = null!;
}