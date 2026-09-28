using FarmerScheme.API.Application.Interfaces.Auth;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FarmerScheme.API.Domain.Enums;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // REGISTER
    public async Task<string> RegisterAsync(RegisterUserDto dto)
    {
        var exists = await _context.Users
            .AnyAsync(x => x.Email == dto.Email);

        if (exists)
            throw new Exception("User already exists");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsApproved = dto.Role == RoleType.Admin,
            IsActive = true
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return "User registered successfully";
    }

    // LOGIN
    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
            throw new Exception("Invalid email or password");

        bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!validPassword)
            throw new Exception("Invalid email or password");

        if (!user.IsApproved)
            throw new Exception("Account not approved by admin");

        return GenerateJwtToken(user);
    }

    // FORGOT PASSWORD
    public async Task<string> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
            throw new Exception("User not found");

        var token = Guid.NewGuid().ToString();

        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            Token = token,
            ExpiryTime = DateTime.UtcNow.AddMinutes(15),
            IsUsed = false
        };

        _context.PasswordResetTokens.Add(resetToken);

        await _context.SaveChangesAsync();

        return token; // normally email
    }

    // RESET PASSWORD
    public async Task<string> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var tokenEntry = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(x => x.Token == dto.Token);

        if (tokenEntry == null)
            throw new Exception("Invalid token");

        if (tokenEntry.IsUsed)
            throw new Exception("Token already used");

        if (tokenEntry.ExpiryTime < DateTime.UtcNow)
            throw new Exception("Token expired");

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == tokenEntry.UserId);

        if (user == null)
            throw new Exception("User not found");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

        tokenEntry.IsUsed = true;

        await _context.SaveChangesAsync();

        return "Password reset successful";
    }

    // JWT TOKEN
    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(2),
        signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}