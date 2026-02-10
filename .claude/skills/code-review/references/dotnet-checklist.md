# .NET Code Review Checklist

## Controller Discipline

- [ ] **No business logic in controllers** — Controllers delegate to services. Any logic beyond request validation, calling a service method, and returning a response is a violation. Move calculations, conditional flows, data transformations, and orchestration into service classes.
- [ ] **DTOs at the boundary** — Controllers never accept or return entity classes directly. All inputs use `Create*Dto` or `Update*Dto` records. All outputs use `*Dto` records. Entity classes stay in the data layer.
- [ ] **Consistent action return types** — Use `ActionResult<T>` for typed responses. Return `Ok()`, `NotFound()`, `CreatedAtAction()`, `NoContent()` as appropriate per REST conventions.

## XML Documentation

- [ ] **Public API methods have XML doc comments** — Every public method on controllers and service interfaces must have `<summary>` documentation. Include `<param>` tags for non-obvious parameters and `<returns>` for non-void methods.
- [ ] **No redundant docs** — Do not add XML docs to private/internal methods or obvious property accessors. Only public API surface.

## Naming Conventions

- [ ] **PascalCase** for classes, methods, properties, and public fields
- [ ] **camelCase** for local variables and parameters
- [ ] **_camelCase** for private fields (with underscore prefix)
- [ ] **I-prefix** for interfaces (e.g., `IStockService`)
- [ ] **Async suffix** for async methods (e.g., `GetStocksAsync`)
- [ ] **Dto suffix** for data transfer objects
- [ ] **Controller suffix** for controllers

## Nullable Reference Types

- [ ] **No suppression operators (`!`)** without justification — Every `!` (null-forgiving) operator should have a comment explaining why it is safe.
- [ ] **Nullable annotations on all parameters and return types** — If a value can be `null`, annotate it with `?`. Do not rely on implicit nullability.
- [ ] **Guard clauses** for non-nullable parameters — Use `ArgumentNullException.ThrowIfNull()` or null checks at method entry points.

## Entity Framework Core

- [ ] **No N+1 queries** — Use `.Include()` for related data or project with `.Select()`. Never iterate a collection and issue per-item queries.
- [ ] **Async all the way** — All EF Core calls use `Async` variants (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`). No `.Result` or `.Wait()` blocking.
- [ ] **No tracking for read-only queries** — Use `.AsNoTracking()` for queries that do not update entities.
- [ ] **Migrations are safe** — New migrations should not drop columns/tables without explicit intent. Check for data loss.

## Dependency Injection

- [ ] **All services registered** — Every service interface has a corresponding registration in `Program.cs` or a DI extension method.
- [ ] **Correct lifetimes** — Scoped for DB-dependent services, Singleton for stateless utilities, Transient only when justified.
- [ ] **No `new` for services** — Services are injected via constructor, never instantiated with `new`.

## General .NET Quality

- [ ] **No `async void`** — Only `async Task` or `async Task<T>`. Exception: event handlers.
- [ ] **`ConfigureAwait(false)`** in library code — Not needed in ASP.NET Core controllers, but required in shared/library projects.
- [ ] **No swallowed exceptions** — Every `catch` block either logs, rethrows, or handles meaningfully. Empty `catch {}` is never acceptable.
- [ ] **String comparisons** use `StringComparison.OrdinalIgnoreCase` when case-insensitive comparison is needed.
