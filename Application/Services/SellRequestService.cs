using AutoMapper;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class SellRequestService : ISellRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SellRequestService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SellRequest> CreateSellRequestAsync(int farmerId, int cropId)
    {
        var crop = await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == cropId && c.FarmerId == farmerId);

        if (crop == null)
            throw new KeyNotFoundException("Crop not found");

        if (crop.Status != BaseStatus.Approved)
            throw new Exception("Crop must be approved before creating sell request");

        var existingRequest = await _context.SellRequests
            .FirstOrDefaultAsync(s => s.CropId == cropId);

        if (existingRequest != null)
            throw new InvalidOperationException("Sell request already exists for this crop");

        var claimApproved = await _context.InsuranceClaims
            .Include(c => c.InsuranceApplication)
            .AnyAsync(c => c.InsuranceApplication.CropId == cropId && c.Status == BaseStatus.Approved);

        if (claimApproved)
            throw new InvalidOperationException("Cannot create a sell request for a crop that has an approved insurance claim");

        var sellRequest = new SellRequest
        {
            CropId = cropId,
            Status = SellRequestStatus.Pending
        };

        _context.SellRequests.Add(sellRequest);
        await _context.SaveChangesAsync();

        return sellRequest;
    }

    public async Task<List<SellRequest>> GetAllSellRequestsAsync(int page = 1, int pageSize = 20)
    {
        return await _context.SellRequests
            .Include(s => s.Crop)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<object> GetOpenAuctionsAsync(int page = 1, int pageSize = 20)
    {
        return await _context.SellRequests
            .Where(s => s.Status == SellRequestStatus.Active)
            .Include(s => s.Crop)
            .Include(s => s.Bids)
            .OrderByDescending(s => s.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                SellRequestId = s.Id,
                CropName = s.Crop.CropName,
                Quantity = s.Crop.Quantity,
                BasePrice = s.Crop.BasePrice,
                CurrentHighestBid = s.Bids
                    .OrderByDescending(b => b.BidAmount)
                    .Select(b => b.BidAmount)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<bool> ApproveSellRequestAsync(int sellRequestId)
    {
        var request = await _context.SellRequests
            .FirstOrDefaultAsync(s => s.Id == sellRequestId);

        if (request == null)
            throw new KeyNotFoundException("Sell request not found");

        request.Status = SellRequestStatus.Active; // start auction

        await _context.SaveChangesAsync();

        return true;
    }



    public async Task<bool> CloseAuctionAsync(int sellRequestId)
    {
        var request = await _context.SellRequests
            .Include(s => s.Bids)
            .Include(s => s.Crop)
            .FirstOrDefaultAsync(s => s.Id == sellRequestId);

        if (request == null)
            throw new Exception("Sell request not found");

        if (request.Status == SellRequestStatus.Closed)
            throw new Exception("Auction already closed");

        if (request.Bids == null || !request.Bids.Any())
            throw new Exception("No bids placed for this auction");

        var highestBid = request.Bids
            .OrderByDescending(b => b.BidAmount)
            .First();

        highestBid.IsWinningBid = true;

        request.WinnerBidderId = highestBid.BidderId;
        request.WinningAmount = highestBid.BidAmount;
        request.Status = SellRequestStatus.Closed;
        request.ClosedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<object> GetAuctionResultAsync(int sellRequestId)
    {
        var request = await _context.SellRequests
            .Include(s => s.Crop)
            .Include(s => s.Bids)
            .ThenInclude(b => b.Bidder)
            .FirstOrDefaultAsync(s => s.Id == sellRequestId);

        if (request == null)
            throw new KeyNotFoundException("Sell request not found");

        if (request.Status != SellRequestStatus.Closed)
            throw new Exception("Auction is still open");

        var highestBid = request.Bids
            .OrderByDescending(b => b.BidAmount)
            .FirstOrDefault();

        if (highestBid == null)
        {
            return new
            {
                Crop = request.Crop.CropName,
                Message = "No bids placed"
            };
        }

        return new
        {
            Crop = request.Crop.CropName,
            WinningBid = highestBid.BidAmount,
            WinnerId = highestBid.BidderId,
            WinnerName = highestBid.Bidder.FullName
        };
    }
}