using Microsoft.EntityFrameworkCore;
using StockTracker.Api.Data;
using StockTracker.Api.Models;
using StockTracker.Api.Services;
using StockTracker.Core.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IStockService, StockService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=stocktracker.db"));

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Stocks.Any())
    {
        db.Stocks.AddRange(
            new Stock { Ticker = "AAPL", Name = "Apple Inc.", PurchasePrice = 178.50m, Quantity = 10, PurchasedAt = new DateTime(2024, 3, 15) },
            new Stock { Ticker = "MSFT", Name = "Microsoft Corp.", PurchasePrice = 415.20m, Quantity = 5, PurchasedAt = new DateTime(2024, 6, 1) },
            new Stock { Ticker = "GOOGL", Name = "Alphabet Inc.", PurchasePrice = 141.80m, Quantity = 8, PurchasedAt = new DateTime(2024, 9, 10) }
        );
        db.SaveChanges();
    }
}

app.Run();