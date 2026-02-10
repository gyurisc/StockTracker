using Microsoft.EntityFrameworkCore;
using StockTracker.Api.Data;
using StockTracker.Api.Services;
using StockTracker.Core.DTOs;

namespace StockTracker.Api.Tests;

public class StockServiceTests
{
    private static AppDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAndGet_ReturnsStock()
    {
        var db = CreateDb();
        var service = new StockService(db);

        var created = await service.CreateAsync(new CreateStockDto(
            "AAPL", "Apple Inc.", 178.50m, 10, DateTime.Now, null
        ));

        Assert.Equal("AAPL", created.Ticker);

        var all = await service.GetAllAsync();
        Assert.Single(all);
    }

    [Fact]
    public async Task Delete_NonExistent_ReturnsFalse()
    {
        var db = CreateDb();
        var service = new StockService(db);

        var result = await service.DeleteAsync(999);
        Assert.False(result);
    }
}