namespace StockTracker.Api.Models;

public class Stock
{
    public int Id { get; set; }
    public string Ticker { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public decimal Quantity { get; set; }
    public DateTime PurchasedAt { get; set; }
    public string? Notes { get; set; }
}