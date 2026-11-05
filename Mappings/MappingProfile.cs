using AutoMapper;
using FarmerScheme.API.Application.DTOs.Insurance;
using FarmerScheme.API.Application.DTOs.Response;
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

            CreateMap<Crop, CropResponseDto>();

            // Sell Request
            CreateMap<CreateSellRequestDto, SellRequest>();

            CreateMap<SellRequest, SellRequestResponseDto>()
                .ForMember(dest => dest.CropName, opt => opt.MapFrom(src => src.Crop != null ? src.Crop.CropName : string.Empty))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Crop != null ? src.Crop.Quantity : 0))
                .ForMember(dest => dest.BasePrice, opt => opt.MapFrom(src => src.Crop != null ? src.Crop.BasePrice : 0))
                .ForMember(dest => dest.CurrentHighestBid, opt => opt.MapFrom(src => src.Bids != null && src.Bids.Any() ? src.Bids.Max(b => b.BidAmount) : (decimal?)null));

            // Bid
            CreateMap<PlaceBidDto, Bid>();

            CreateMap<Bid, BidResponseDto>()
                .ForMember(dest => dest.BidderName, opt => opt.MapFrom(src => src.Bidder != null ? src.Bidder.FullName : string.Empty));

            // Insurance
            CreateMap<CreateInsuranceApplicationDto, InsuranceApplication>();

            CreateMap<InsuranceApplication, InsuranceApplicationResponseDto>()
                .ForMember(dest => dest.FarmerName, opt => opt.MapFrom(src => src.Farmer != null ? src.Farmer.FullName : string.Empty));

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
