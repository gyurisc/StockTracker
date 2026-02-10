# StockTracker

A stock portfolio tracking app built with .NET 10, React, SQLite, and YARP.

## Projects
- **StockTracker.Api** — REST API
- **StockTracker.Core** — Domain models, DTOs, interfaces
- **StockTracker.Client** — React frontend (Vite + TypeScript)
- **StockTracker.Gateway** — YARP reverse proxy
- **StockTracker.Api.Tests** — Unit tests (xUnit)

## Running locally
1. `cd StockTracker.Api && dotnet run`
2. `cd StockTracker.Client && npm run dev`
3. Open http://localhost:5173

## Running tests
dotnet test