namespace FarmerScheme.API.Application.Interfaces.Auth
{


    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterUserDto dto);

        Task<string> LoginAsync(LoginDto dto);

        Task<string> ForgotPasswordAsync(ForgotPasswordDto dto);

        Task<string> ResetPasswordAsync(ResetPasswordDto dto);
    }
}