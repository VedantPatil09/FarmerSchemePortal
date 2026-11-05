using System.Data;
using AutoMapper;
using FarmerScheme.API.Application.DTOs.Response;
using FarmerScheme.API.Application.Interfaces;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using FarmerScheme.API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class BidService : IBidService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public BidService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BidResponseDto> PlaceBidAsync(int bidderId, PlaceBidDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        var sellRequest = await _context.SellRequests
            .Include(s => s.Crop)
            .Include(s => s.Bids)
            .FirstOrDefaultAsync(s => s.Id == dto.SellRequestId);

        if (sellRequest == null)
            throw new KeyNotFoundException("Auction not found");

        if (sellRequest.Status != SellRequestStatus.Active)
            throw new InvalidOperationException("Auction is closed");

        if (sellRequest.Crop.FarmerId == bidderId)
            throw new InvalidOperationException("Farmer cannot bid on own crop");

        if (dto.BidAmount < sellRequest.Crop.BasePrice)
            throw new InvalidOperationException("Bid must be greater than or equal to crop base price");

        var highestBid = sellRequest.Bids
            .OrderByDescending(b => b.BidAmount)
            .FirstOrDefault();

        if (highestBid != null && dto.BidAmount <= highestBid.BidAmount)
            throw new InvalidOperationException("Bid must be higher than current highest bid");

        var bid = _mapper.Map<Bid>(dto);
        bid.BidderId = bidderId;
        bid.BidTime = DateTime.UtcNow;

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        // Load bidder for mapping
        await _context.Entry(bid).Reference(b => b.Bidder).LoadAsync();

        return _mapper.Map<BidResponseDto>(bid);
    }

    public async Task<List<BidResponseDto>> GetBidsForAuctionAsync(int sellRequestId)
    {
        var bids = await _context.Bids
            .AsNoTracking()
            .Where(b => b.SellRequestId == sellRequestId)
            .Include(b => b.Bidder)
            .OrderByDescending(b => b.BidAmount)
            .ToListAsync();

        return _mapper.Map<List<BidResponseDto>>(bids);
    }

    public async Task<List<BidResponseDto>> GetBidHistoryAsync(int sellRequestId)
    {
        var bids = await _context.Bids
            .AsNoTracking()
            .Where(b => b.SellRequestId == sellRequestId)
            .Include(b => b.Bidder)
            .OrderByDescending(b => b.BidAmount)
            .ToListAsync();

        return _mapper.Map<List<BidResponseDto>>(bids);
    }
}
