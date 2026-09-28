using AutoMapper;
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

    public async Task<Bid> PlaceBidAsync(int bidderId, PlaceBidDto dto)
    {
        var sellRequest = await _context.SellRequests
            .Include(s => s.Crop)
            .Include(s => s.Bids)
            .FirstOrDefaultAsync(s => s.Id == dto.SellRequestId);

        if (sellRequest == null)
            throw new Exception("Auction not found");

        if (sellRequest.Status != SellRequestStatus.Active)
            throw new Exception("Auction is closed");

        if (sellRequest.Crop.FarmerId == bidderId)
            throw new Exception("Farmer cannot bid on own crop");

        if (dto.BidAmount < sellRequest.Crop.BasePrice)
            throw new Exception("Bid must be greater than crop base price");

        var highestBid = sellRequest.Bids
            .OrderByDescending(b => b.BidAmount)
            .FirstOrDefault();

        if (highestBid != null && dto.BidAmount <= highestBid.BidAmount)
            throw new Exception("Bid must be higher than current highest bid");

        var bid = _mapper.Map<Bid>(dto);

        bid.BidderId = bidderId;

        _context.Bids.Add(bid);

        await _context.SaveChangesAsync();

        return bid;
    }

    public async Task<List<Bid>> GetBidsForAuctionAsync(int sellRequestId)
    {
        return await _context.Bids
            .Where(b => b.SellRequestId == sellRequestId)
            .Include(b => b.Bidder)
            .OrderByDescending(b => b.BidAmount)
            .ToListAsync();
    }

    public async Task<object> GetBidHistoryAsync(int sellRequestId)
    {
        var bids = await _context.Bids
            .Where(b => b.SellRequestId == sellRequestId)
            .Include(b => b.Bidder)
            .OrderByDescending(b => b.BidAmount)
            .Select(b => new
            {
                BidId = b.Id,
                BidderId = b.BidderId,
                BidderName = b.Bidder.FullName,
                BidAmount = b.BidAmount,
                IsWinningBid = b.IsWinningBid,
                PlacedAt = b.CreatedAt
            })
            .ToListAsync();

        if (!bids.Any())
            throw new Exception("No bids placed yet");

        return bids;
    }
}