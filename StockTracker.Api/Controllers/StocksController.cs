using Microsoft.AspNetCore.Mvc;
using StockTracker.Core.DTOs;
using StockTracker.Core.Services;

namespace StockTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StocksController : ControllerBase
{
    private readonly IStockService _service;
    public StocksController(IStockService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var stock = await _service.GetByIdAsync(id);
        return stock is null ? NotFound() : Ok(stock);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateStockDto dto)
    {
        var stock = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = stock.Id }, stock);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) =>
        await _service.DeleteAsync(id) ? NoContent() : NotFound();
}