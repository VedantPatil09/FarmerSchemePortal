using FarmerScheme.API.Domain.Enums;

public class UserResponseDto
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public RoleType Role { get; set; }
}