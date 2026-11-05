using AutoMapper;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ProfileEntity = FarmerScheme.API.Domain.Entities.Profile;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProfileService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProfileEntity> CreateProfileAsync(int userId, CreateProfileDto dto)
    {
        var existing = await _context.Profiles.AnyAsync(p => p.UserId == userId);
        if (existing)
            throw new InvalidOperationException("Profile already exists for this user");

        var profile = new ProfileEntity
        {
            UserId = userId,
            ProfileType = dto.ProfileType,
            LandArea = dto.LandArea,
            LandAddress = dto.LandAddress,
            CompanyName = dto.CompanyName,
            BankAccountNumber = dto.BankAccountNumber,
            IFSCCode = dto.IFSCCode
        };

        _context.Profiles.Add(profile);

        if (dto.Documents != null)
        {
            foreach (var doc in dto.Documents)
            {
                var document = new Document
                {
                    UserId = userId,
                    DocumentType = doc.DocumentType,
                    FilePath = doc.FilePath,
                };

                _context.Documents.Add(document);
            }
        }

        await _context.SaveChangesAsync();

        return profile;
    }

    public async Task<ProfileResponseDto> GetMyProfileAsync(int userId, int page = 1, int pageSize = 20)
    {
        var profile = await _context.Profiles
            .AsNoTracking()
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            throw new KeyNotFoundException("Profile not found");

        var documents = await _context.Documents
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = _mapper.Map<ProfileResponseDto>(profile);
        result.Documents = _mapper.Map<List<DocumentResponseDto>>(documents);

        return result;
    }

    public async Task<ProfileEntity> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            throw new KeyNotFoundException("Profile not found");

        // update profile fields
        if (dto.LandArea.HasValue)
            profile.LandArea = dto.LandArea;

        if (!string.IsNullOrEmpty(dto.LandAddress))
            profile.LandAddress = dto.LandAddress;

        if (!string.IsNullOrEmpty(dto.CompanyName))
            profile.CompanyName = dto.CompanyName;

        if (!string.IsNullOrEmpty(dto.BankAccountNumber))
            profile.BankAccountNumber = dto.BankAccountNumber;

        if (!string.IsNullOrEmpty(dto.IFSCCode))
            profile.IFSCCode = dto.IFSCCode;

        // update documents
        if (dto.Documents != null)
        {
            foreach (var doc in dto.Documents)
            {
                if (doc.DocumentId.HasValue)
                {
                    var existingDoc = await _context.Documents
                        .FirstOrDefaultAsync(d => d.Id == doc.DocumentId && d.UserId == userId);

                    if (existingDoc != null)
                    {
                        existingDoc.DocumentType = doc.DocumentType;
                        existingDoc.FilePath = doc.FilePath;
                    }
                }
                else
                {
                    var newDoc = new Document
                    {
                        UserId = userId,
                        DocumentType = doc.DocumentType,
                        FilePath = doc.FilePath
                    };

                    _context.Documents.Add(newDoc);
                }
            }
        }

        await _context.SaveChangesAsync();

        return profile;
    }

    public async Task<bool> DeleteProfileAsync(int userId)
    {
        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            throw new KeyNotFoundException("Profile not found");

        _context.Profiles.Remove(profile);

        await _context.SaveChangesAsync();

        return true;
    }
}
