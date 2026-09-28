using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ---------------- USERS ----------------

    public async Task<List<User>> GetPendingUsersAsync(int page = 1, int pageSize = 20)
    {
        return await _context.Users
            .Where(u => !u.IsApproved)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<bool> ApproveUserAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        user.IsApproved = true;

        await _context.SaveChangesAsync();

        return true;
    }

    // ---------------- CROPS ----------------

    public async Task<List<Crop>> GetPendingCropsAsync(int page = 1, int pageSize = 20)
    {
        return await _context.Crops
            .Where(c => c.Status == BaseStatus.Pending)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<bool> ApproveCropAsync(int cropId)
    {
        var crop = await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == cropId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        crop.Status = BaseStatus.Approved;

        await _context.SaveChangesAsync();

        return true;
    }

    // ---------------- SELL REQUESTS ----------------

    public async Task<List<SellRequest>> GetPendingSellRequestsAsync(int page = 1, int pageSize = 20)
    {
        return await _context.SellRequests
            .Where(s => s.Status == SellRequestStatus.Pending)
            .Include(s => s.Crop)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

}