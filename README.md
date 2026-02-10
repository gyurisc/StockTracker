# StockTracker

An enterprise-flavoured stock portfolio tracker built as a playground for exploring [Claude Code](https://claude.ai/code), custom skills, and test-driven development workflows.

## Tech Stack

- **API** — .NET 10, EF Core, SQLite
- **Frontend** — React 19, TypeScript, Vite
- **Gateway** — YARP reverse proxy
- **Testing** — xUnit, EF Core InMemory
- **AI Tooling** — Claude Code with custom skills

## Getting Started
```bash
# API
cd StockTracker.Api
dotnet run

# Client
cd StockTracker.Client
npm install && npm run dev
```

Open http://localhost:5173

## Project Structure
```
StockTracker/
├── StockTracker.Api/        — REST API
├── StockTracker.Client/     — React frontend
├── StockTracker.Gateway/    — YARP reverse proxy
├── StockTracker.Api.Tests/  — Unit tests
└── CLAUDE.md                — Claude Code project context
```

## Claude Code Skills

This repo includes custom skills in `.claude/skills/`:

- **tdd-workflow** — Enforces red-green-refactor cycle

## Purpose

This is not a production app. It's a learning repo to explore:
- Building with Claude Code and custom skills
- Enterprise patterns (DTOs, service layer, TDD)
- .NET + React full-stack development with YARP