# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockTracker is a full-stack stock portfolio tracker with five projects:

- **StockTracker.Api** — ASP.NET Core Web API (.NET 10), EF Core + SQLite
- **StockTracker.Core** — Class library: DTOs (`CreateStockDto`, `StockDto` records) and `IStockService` interface
- **StockTracker.Client** — React 19 + TypeScript frontend, built with Vite
- **Stocktracker.Gateway** — YARP reverse proxy (not in `.slnx`)
- **StockTracker.Api.Tests** — xUnit tests with EF Core InMemory provider

## Commands

### API (from `StockTracker.Api/`)
```
dotnet run                    # Start API (http://localhost:5195, https://localhost:7162)
dotnet build                  # Build only
```
Swagger UI available at `/swagger` in Development mode.

### Client (from `StockTracker.Client/`)
```
npm run dev                   # Vite dev server on http://localhost:5173
npm run build                 # TypeScript check + production build
npm run lint                  # ESLint
```

### Gateway (from `Stocktracker.Gateway/`)
```
dotnet run                    # Start gateway (http://localhost:5141, https://localhost:7042)
```

### Tests (from repo root)
```
dotnet test                   # Run all xUnit tests
```

### EF Core Migrations (from `StockTracker.Api/`)
```
dotnet ef migrations add <Name>
dotnet ef database update
```

## Architecture

```
Browser → Gateway (YARP :5141/:7042)
            ├── /api/* → API (:5001 per gateway config)
            └── /*     → Client (:5174 per gateway config)
```

**Port mismatch note:** The gateway routes `/api/*` to `http://localhost:5001`, but the API actually runs on ports 5195/7162. The client cluster points to port 5174, but Vite runs on 5173. These need to be aligned before the gateway will work.

For local dev without the gateway, run the API and Client separately — the client's Axios uses relative `/api` paths.

### Backend layering
- **Core** holds `IStockService`, `StockDto`, `CreateStockDto` — no dependencies
- **Api** references Core, implements `StockService`, registers it as scoped DI
- **Api/Controllers/StocksController.cs** — REST CRUD at `/api/stocks` (GET all, GET by id, POST, DELETE)
- **Api/Data/AppDbContext.cs** — single `DbSet<Stock>` (SQLite, `stocktracker.db`)
- **Api/Models/Stocks.cs** — `Stock` entity with Id, Ticker, Name, PurchasePrice, Quantity, PurchasedAt, Notes
- **Api/Services/StockService.cs** — maps between entity and DTOs, orders by PurchasedAt descending
- DB auto-migrates and seeds AAPL/MSFT/GOOGL on startup if empty

### Client structure
- `src/api/stocks.ts` — Axios client with baseURL `/api`, exports `getStocks`, `createStock`, `deleteStock`
- `src/components/AddStock.tsx` — Form component, calls `onAdded` callback after create
- `src/components/StockList.tsx` — Table component, loads stocks on mount
- `App.tsx` — Composes AddStock + StockList, uses key-based refresh pattern

### Tests
- `StockServiceTests.cs` — Uses EF Core InMemory with unique DB names per test
- Tests create/get and delete flows against `StockService` directly

## Frontend Design Guidelines

From `docs/frontend-design.md`:
- Dark fintech dashboard aesthetic
- Fonts: DM Sans + JetBrains Mono
- No generic AI aesthetics (no Inter, no purple gradients)
- CSS modules or plain CSS — no Tailwind

## Conventions

- .NET projects use nullable reference types and implicit usings
- DTOs are C# records in StockTracker.Core
- TypeScript strict mode enabled
- React components are functional with hooks, no state management library
- ESLint configured with TypeScript, React Hooks, and React Refresh rules
- No CORS on the API — requests go through the gateway or a proxy
