using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
namespace FarmerScheme.API.Application.Interfaces
{
    public interface IInsuranceService
    {
        Task<InsuranceApplication> ApplyInsuranceAsync(int farmerId, CreateInsuranceApplicationDto dto);

        Task<List<InsuranceApplication>> GetMyApplicationsAsync(int farmerId, int page = 1, int pageSize = 20);

        Task<bool> ApproveInsuranceAsync(int applicationId);

        Task<List<InsuranceApplication>> GetAllApplicationsAsync(int page = 1, int pageSize = 20);

        decimal CalculatePremium(decimal sumInsured, decimal area, SeasonType season);
    }
}
