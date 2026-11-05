using FarmerScheme.API.Application.Interfaces.Auth;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FarmerScheme.API.Domain.Enums;
using Microsoft.Extensions.Logging;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;

    public AuthService(ApplicationDbContext context, IConfiguration config, ILogger<AuthService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    // REGISTER
    public async Task<string> RegisterAsync(RegisterUserDto dto)
    {
        if (dto.Role == RoleType.Admin)
            throw new InvalidOperationException("Registering as an administrator is not permitted.");

        var exists = await _context.Users
            .AnyAsync(x => x.Email == dto.Email);

        if (exists)
            throw new InvalidOperationException("User already exists");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsApproved = false,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User registered successfully. Awaiting administrator approval.";
    }

    // LOGIN
    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
            throw new InvalidOperationException("Invalid email or password");

        bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!validPassword)
            throw new InvalidOperationException("Invalid email or password");

        if (!user.IsApproved)
            throw new InvalidOperationException("Account not approved by admin");

        return GenerateJwtToken(user);
    }

    // FORGOT PASSWORD
    public async Task<string> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        // Security best practice: don't reveal if user exists or not, but generate token if found
        if (user != null)
        {
            var token = Guid.NewGuid().ToString("N");

            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpiryTime = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            // Log token securely on server for development/monitoring
            _logger.LogInformation("Password reset token generated for user {Email}: {Token}", user.Email, token);
        }

        return "If an account with that email exists, password reset instructions have been generated.";
    }

    // RESET PASSWORD
    public async Task<string> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var tokenEntry = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(x => x.Token == dto.Token);

        if (tokenEntry == null)
            throw new InvalidOperationException("Invalid token");

        if (tokenEntry.IsUsed)
            throw new InvalidOperationException("Token already used");

        if (tokenEntry.ExpiryTime < DateTime.UtcNow)
            throw new InvalidOperationException("Token expired");

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == tokenEntry.UserId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

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

        var jwtKey = _config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException("JWT Secret Key is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var durationMinutes = _config.GetValue<int>("Jwt:DurationInMinutes", 60);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(durationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
