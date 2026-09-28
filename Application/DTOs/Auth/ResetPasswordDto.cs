using System.ComponentModel.DataAnnotations;

public class ResetPasswordDto
{
    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [MinLength(8)]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
        ErrorMessage = "Password must contain at least 1 uppercase, 1 lowercase, 1 digit and 1 special character."
    )]
    public string NewPassword { get; set; } = null!;
}