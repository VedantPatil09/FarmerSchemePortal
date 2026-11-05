using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.DTOs.Response;
using FarmerScheme.API.Domain.Enums;

namespace FarmerScheme.API.Application.Interfaces
{
    public interface IInsuranceService
    {
        Task<InsuranceApplicationResponseDto> ApplyInsuranceAsync(int farmerId, CreateInsuranceApplicationDto dto);

        Task<List<InsuranceApplicationResponseDto>> GetMyApplicationsAsync(int farmerId, int page = 1, int pageSize = 20);

        Task<bool> ApproveInsuranceAsync(int applicationId);

        Task<List<InsuranceApplicationResponseDto>> GetAllApplicationsAsync(int page = 1, int pageSize = 20);

        decimal CalculatePremium(decimal sumInsured, decimal area, SeasonType season);
    }
}
