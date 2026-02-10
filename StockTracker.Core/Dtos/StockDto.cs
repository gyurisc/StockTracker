namespace StockTracker.Core.DTOs;

public record CreateStockDto(
    string Ticker,
    string Name,
    decimal PurchasePrice,
    decimal Quantity,
    DateTime PurchasedAt,
    string? Notes
);

public record StockDto(
    int Id,
    string Ticker,
    string Name,
    decimal PurchasePrice,
    decimal Quantity,
    DateTime PurchasedAt,
    string? Notes
);