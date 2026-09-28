using AutoMapper;
using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Domain.Entities;
using ProfileEntity = FarmerScheme.API.Domain.Entities.Profile;

namespace FarmerScheme.API.Mappings
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Crop
            CreateMap<CreateCropDto, Crop>();

            CreateMap<UpdateCropDto, Crop>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Sell Request
            CreateMap<CreateSellRequestDto, SellRequest>();

            // Bid
            CreateMap<PlaceBidDto, Bid>();

            // Insurance
            CreateMap<CreateInsuranceApplicationDto, InsuranceApplication>();

            // Claim
            CreateMap<CreateClaimDto, InsuranceClaim>();


            // AI Query
            CreateMap<AskAiDto, AIQueryLog>()
                .ForMember(dest => dest.PromptUsed, opt => opt.MapFrom(src => src.Prompt));

            // Profile
            CreateMap<CreateProfileDto, Domain.Entities.Profile>();

            CreateMap<UpdateProfileDto, Domain.Entities.Profile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<User, UserResponseDto>();

            CreateMap<Document, DocumentResponseDto>();

            CreateMap<ProfileEntity, ProfileResponseDto>();
        }
    }
}