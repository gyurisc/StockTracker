using Microsoft.EntityFrameworkCore;
using StockTracker.Api.Models;

namespace StockTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Stock> Stocks => Set<Stock>();
}