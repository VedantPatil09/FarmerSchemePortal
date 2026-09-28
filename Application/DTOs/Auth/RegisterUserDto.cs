using FarmerScheme.API.Domain.Enums;
using System.ComponentModel.DataAnnotations;

public class RegisterUserDto
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [Phone]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid Indian phone number")]
    public string PhoneNumber { get; set; } = null!;

    [Required]
    [DataType(DataType.Password)]
    [MinLength(8)]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
        ErrorMessage = "Password must contain at least 1 uppercase, 1 lowercase, 1 digit and 1 special character."
    )]
    public string Password { get; set; } = null!;

    [Required]
    public RoleType Role { get; set; }
}