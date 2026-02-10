# StockTracker

## Tech Stack
- .NET 10 Web API with SQLite (StockTracker.Api)
- React + TypeScript + Vite (StockTracker.Client)
- YARP reverse proxy (StockTracker.Gateway)

## Frontend Guidelines
- Dark fintech dashboard aesthetic
- Use DM Sans + JetBrains Mono fonts
- No generic AI aesthetics (no Inter, no purple gradients)
- CSS modules or plain CSS, no Tailwind
- All API calls go through /api via Vite proxy or YARP

## Structure
- React app is in StockTracker.Client/
- Components in src/components/
- API helpers in src/api/