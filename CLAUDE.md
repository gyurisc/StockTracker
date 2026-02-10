# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockTracker is a full-stack stock portfolio tracking app with three components:

- **StockTracker.Api** — ASP.NET Core Web API (.NET 10), EF Core + SQLite (`stocktracker.db`)
- **StockTracker.Client** — React 19 + TypeScript frontend, built with Vite
- **Stocktracker.Gateway** — YARP reverse proxy that unifies client and API behind one host

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

## Architecture

```
Browser → Gateway (YARP :5141/:7042)
            ├── /api/* → API (:5001 per gateway config)
            └── /*     → Client (:5173)
```

**Port mismatch note:** The gateway routes `/api/*` to `https://localhost:5001`, but the API's `launchSettings.json` runs on ports 5195/7162. These need to be aligned before the gateway will work.

The solution file (`StockTracker.slnx`) currently only includes `StockTracker.Api` — the gateway is not referenced.

### Client structure
- `src/api/stocks.ts` — Axios client with baseURL `/api`, defines the `Stock` interface and CRUD functions
- `src/components/` — React components (`AddStock.tsx`, `StockList.tsx`)
- API calls use relative `/api` paths, expecting either the gateway or Vite proxy to forward them

### API structure
- `Program.cs` — Minimal hosting: configures EF Core (SQLite), controllers, Swagger, HTTPS redirection
- `Data/AppDbContext` — Referenced in Program.cs but the Data directory with models/context needs to be created
- No CORS configured — requests must go through the gateway or a dev proxy

## Conventions

- .NET projects use nullable reference types and implicit usings
- TypeScript strict mode is enabled
- React components are functional with hooks, no state management library
- ESLint configured with TypeScript, React Hooks, and React Refresh rules
