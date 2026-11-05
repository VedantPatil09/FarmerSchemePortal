using FarmerScheme.API.Common;
using FarmerScheme.API.Domain.Entities;
using FarmerScheme.API.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FarmerScheme.API.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Crop> Crops { get; set; }
        public DbSet<SellRequest> SellRequests { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<InsuranceApplication> InsuranceApplications { get; set; }
        public DbSet<InsuranceClaim> InsuranceClaims { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<AIQueryLog> AIQueryLogs { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity &&
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;

                if (entry.State == EntityState.Added)
                    entity.CreatedAt = DateTime.UtcNow;
                else
                    entity.UpdatedAt = DateTime.UtcNow;
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // User <-> Profile (1-1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId);

            // Crop -> Farmer
            modelBuilder.Entity<Crop>()
                .HasOne(c => c.Farmer)
                .WithMany()
                .HasForeignKey(c => c.FarmerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Crop -> SellRequests (1-M)
            modelBuilder.Entity<SellRequest>()
                .HasOne(s => s.Crop)
                .WithMany(c => c.SellRequests)
                .HasForeignKey(s => s.CropId);

            // Bid -> SellRequest
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.SellRequest)
                .WithMany(s => s.Bids)
                .HasForeignKey(b => b.SellRequestId);

            // Bid -> Bidder
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Bidder)
                .WithMany()
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.Restrict);

            // InsuranceClaim -> InsuranceApplication (1-1)
            modelBuilder.Entity<InsuranceClaim>()
                .HasOne(c => c.InsuranceApplication)
                .WithOne(a => a.Claim)
                .HasForeignKey<InsuranceClaim>(c => c.InsuranceApplicationId);

            modelBuilder.Entity<InsuranceApplication>()
                .HasOne(i => i.Crop)
                .WithMany()
                .HasForeignKey(i => i.CropId)
                .OnDelete(DeleteBehavior.Restrict);

            // AIQueryLog -> Crop
            modelBuilder.Entity<AIQueryLog>()
                .HasOne(a => a.Crop)
                .WithMany()
                .HasForeignKey(a => a.CropId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Document>()
                .HasOne(d => d.InsuranceClaim)
                .WithMany(c => c.Documents)
                .HasForeignKey(d => d.ClaimId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Document>()
                .HasOne(d => d.User)
                .WithMany(u => u.Documents)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------- INDEXES FOR QUERY OPTIMIZATION ----------------
            modelBuilder.Entity<Crop>()
                .HasIndex(c => new { c.FarmerId, c.Status });

            modelBuilder.Entity<SellRequest>()
                .HasIndex(s => s.Status);

            modelBuilder.Entity<SellRequest>()
                .HasIndex(s => s.CropId);

            modelBuilder.Entity<Bid>()
                .HasIndex(b => new { b.SellRequestId, b.BidAmount });

            modelBuilder.Entity<InsuranceApplication>()
                .HasIndex(i => new { i.FarmerId, i.Status });

            modelBuilder.Entity<InsuranceApplication>()
                .HasIndex(i => i.CropId);

            modelBuilder.Entity<Document>()
                .HasIndex(d => d.UserId);

            modelBuilder.Entity<Document>()
                .HasIndex(d => d.ClaimId);

            // ---------------- DECIMAL PRECISION ----------------

            modelBuilder.Entity<Crop>()
                .Property(c => c.BasePrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Crop>()
                .Property(c => c.Quantity)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Bid>()
                .Property(b => b.BidAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InsuranceApplication>()
                .Property(i => i.LandArea)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InsuranceApplication>()
                .Property(i => i.PremiumAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InsuranceApplication>()
                .Property(i => i.SumInsured)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Profile>()
                .Property(p => p.LandArea)
                .HasPrecision(10, 2);

            modelBuilder.Entity<SellRequest>()
                .Property(s => s.WinningAmount)
                .HasPrecision(10, 2);

            // ---------------- SEED ADMIN ----------------

            var adminPasswordHash = _configuration["Seed:AdminPasswordHash"];
            if (string.IsNullOrWhiteSpace(adminPasswordHash))
            {
                // Fallback default dev hash (password: Admin@123)
                adminPasswordHash = "$2a$11$Vsbxd7eVxZ9v6wan8slLW.ULvj8hmyILvHx5lWA43aS1Np/YsfLQW";
            }

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "System Admin",
                    Email = "adminfarmerscheme@gmail.com",
                    PhoneNumber = "9999999999",
                    PasswordHash = adminPasswordHash,
                    Role = RoleType.Admin,
                    IsApproved = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
