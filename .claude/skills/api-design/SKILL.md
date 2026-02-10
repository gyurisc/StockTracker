---
name: api-design
description: Use when creating or modifying API endpoints, controllers, services, or DTOs. Enforces REST conventions for route naming, DTO usage, error responses, and pagination.
author: Krisztian Gyuris
---

This skill enforces the REST API conventions for StockTracker. Claude MUST follow these rules when adding or modifying any API endpoint, service method, or DTO.

## DTOs

- **Never expose entity classes in API responses or accept them as input.** All data crossing the API boundary uses DTOs.
- DTOs live in `StockTracker.Core/Dtos/` as C# `record` types.
- Naming: `{Entity}Dto` for responses, `Create{Entity}Dto` for creation, `Update{Entity}Dto` for updates.
- DTOs must not contain navigation properties, database concerns, or internal IDs that clients don't need.
- Mapping between entities and DTOs happens in the service layer (`StockTracker.Api/Services/`), never in controllers.

```csharp
// Good — records in Core/Dtos/
public record StockDto(int Id, string Ticker, string Name, decimal PurchasePrice, decimal Quantity, DateTime PurchasedAt, string? Notes);
public record CreateStockDto(string Ticker, string Name, decimal PurchasePrice, decimal Quantity, DateTime PurchasedAt, string? Notes);

// Bad — returning entity from controller
public async Task<Stock> Get(int id) => await _db.Stocks.FindAsync(id);
```

## Route Naming

- Controllers use `[Route("api/[controller]")]` — no custom route strings.
- Controller names are **plural nouns**: `StocksController`, `PortfoliosController`.
- Use HTTP method attributes for actions, not verb-based routes:

| Operation | Attribute | Route | Returns |
|-----------|-----------|-------|---------|
| List | `[HttpGet]` | `api/stocks` | `PagedResult<StockDto>` |
| Get one | `[HttpGet("{id}")]` | `api/stocks/5` | `StockDto` |
| Create | `[HttpPost]` | `api/stocks` | `StockDto` (201) |
| Full update | `[HttpPut("{id}")]` | `api/stocks/5` | `StockDto` |
| Partial update | `[HttpPatch("{id}")]` | `api/stocks/5` | `StockDto` |
| Delete | `[HttpDelete("{id}")]` | `api/stocks/5` | 204 No Content |

- **No verbs in routes.** No `/api/stocks/getAll`, no `/api/stocks/delete/5`.
- Sub-resources use nesting: `/api/portfolios/{portfolioId}/stocks`.
- Filtering and sorting use query parameters, never path segments: `/api/stocks?ticker=AAPL&sortBy=purchasedAt`.

## Standard Error Responses

All error responses use ASP.NET Core's `ProblemDetails` format. Controllers return consistent status codes:

| Situation | Status | Response |
|-----------|--------|----------|
| Success (list) | 200 | `PagedResult<T>` |
| Success (single) | 200 | DTO |
| Created | 201 | DTO + `Location` header |
| Deleted | 204 | No body |
| Validation failure | 400 | `ProblemDetails` (automatic via `[ApiController]`) |
| Not found | 404 | `ProblemDetails` |
| Conflict (duplicate) | 409 | `ProblemDetails` |
| Unhandled exception | 500 | `ProblemDetails` (generic, no stack trace in production) |

- Use `NotFound()`, `BadRequest()`, `Conflict()` helpers — they produce `ProblemDetails` when `[ApiController]` is applied.
- For custom errors, return `Problem(detail: "...", statusCode: 409)`.
- Never return raw strings or anonymous objects as error responses.
- Configure `ProblemDetails` middleware in `Program.cs`:

```csharp
builder.Services.AddProblemDetails();
app.UseExceptionHandler();
app.UseStatusCodePages();
```

## Pagination on List Endpoints

**Every list endpoint MUST support pagination.** No unbounded queries.

### Shared types in `StockTracker.Core/Dtos/`

```csharp
public record PagedRequest(int Page = 1, int PageSize = 25);

public record PagedResult<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);
```

### Controller usage

```csharp
[HttpGet]
public async Task<IActionResult> GetAll([FromQuery] PagedRequest request)
    => Ok(await _service.GetAllAsync(request));
```

### Service implementation

```csharp
public async Task<PagedResult<StockDto>> GetAllAsync(PagedRequest request)
{
    var query = _db.Stocks.OrderByDescending(s => s.PurchasedAt);
    var totalCount = await query.CountAsync();

    var items = await query
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(s => ToDto(s))
        .ToListAsync();

    return new PagedResult<StockDto>(
        items, request.Page, request.PageSize,
        totalCount, (int)Math.Ceiling(totalCount / (double)request.PageSize)
    );
}
```

### Rules
- Default page size: 25. Maximum page size: 100.
- Validate `PageSize` in the service — clamp to max, never throw.
- Page numbering starts at 1.
- Interface methods that return lists use `Task<PagedResult<TDto>>`, not `Task<IEnumerable<TDto>>`.

## Checklist

When creating or modifying an API endpoint, verify:

- [ ] Request and response types are DTOs (records in `Core/Dtos/`), not entities
- [ ] Controller uses `[Route("api/[controller]")]` with plural noun naming
- [ ] No verbs in route paths — action is expressed via HTTP method
- [ ] List endpoint accepts `PagedRequest` and returns `PagedResult<T>`
- [ ] Error cases return proper status codes using controller helpers
- [ ] `ProblemDetails` is configured in `Program.cs`
- [ ] New service methods are added to the interface in `Core/Services/` first
- [ ] Mapping between entities and DTOs happens in the service, not the controller
