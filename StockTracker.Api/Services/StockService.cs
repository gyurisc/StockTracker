using Microsoft.EntityFrameworkCore;
using StockTracker.Api.Data;
using StockTracker.Api.Models;
using StockTracker.Core.DTOs;
using StockTracker.Core.Services;

namespace StockTracker.Api.Services;

public class StockService : IStockService
{
    private readonly AppDbContext _db;
    public StockService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<StockDto>> GetAllAsync() =>
        await _db.Stocks
            .OrderByDescending(s => s.PurchasedAt)
            .Select(s => ToDto(s))
            .ToListAsync();

    public async Task<StockDto?> GetByIdAsync(int id)
    {
        var stock = await _db.Stocks.FindAsync(id);
        return stock is null ? null : ToDto(stock);
    }

    public async Task<StockDto> CreateAsync(CreateStockDto dto)
    {
        var stock = new Stock
        {
            Ticker = dto.Ticker,
            Name = dto.Name,
            PurchasePrice = dto.PurchasePrice,
            Quantity = dto.Quantity,
            PurchasedAt = dto.PurchasedAt,
            Notes = dto.Notes
        };
        _db.Stocks.Add(stock);
        await _db.SaveChangesAsync();
        return ToDto(stock);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var stock = await _db.Stocks.FindAsync(id);
        if (stock is null) return false;
        _db.Stocks.Remove(stock);
        await _db.SaveChangesAsync();
        return true;
    }

    private static StockDto ToDto(Stock s) => new(
        s.Id, s.Ticker, s.Name, s.PurchasePrice,
        s.Quantity, s.PurchasedAt, s.Notes
    );
}
