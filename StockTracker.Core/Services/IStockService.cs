using StockTracker.Core.DTOs;

namespace StockTracker.Core.Services;

public interface IStockService
{
    Task<IEnumerable<StockDto>> GetAllAsync();
    Task<StockDto?> GetByIdAsync(int id);
    Task<StockDto> CreateAsync(CreateStockDto dto);
    Task<bool> DeleteAsync(int id);
}