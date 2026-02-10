---
name: code-review
description: This skill should be used when reviewing .NET and React/TypeScript code quality before committing. Triggers on "review my code", "check before commit", "code review", or automatically before any commit action. Runs automated tooling (dotnet build, dotnet test, npm run lint) first, then performs a manual code-reading review against .NET and React checklists for issues tooling cannot catch.
---

# Code Review Skill

Pre-commit code review for .NET and React/TypeScript projects. Combines automated tooling with manual code-reading to catch issues before they enter the repository.

## When to Use

- When the user says "review my code", "check before commit", or "code review"
- Automatically before any commit action (before running `git commit`)
- When the user asks to verify code quality

## Review Process

Follow these phases in order. Do not skip phases.

### Phase 1: Identify Changed Files

1. Run `git diff --name-only` and `git diff --cached --name-only` to identify all modified and staged files
2. Separate files into categories: `.cs` files (backend), `.tsx`/`.ts` files (frontend), and other files
3. If no files have changed, report "No changes to review" and stop

### Phase 2: Automated Checks

Run all three checks in parallel where possible. Collect results before proceeding.

#### 2a: .NET Build + Test (if any `.cs` files changed)

Run from the repository root:

```
dotnet build
dotnet test
```

Record any build warnings, build errors, and test failures.

#### 2b: Frontend Lint (if any `.ts`/`.tsx` files changed)

Run from the `StockTracker.Client/` directory:

```
npm run lint
```

Record any lint errors and warnings.

#### 2c: TypeScript Type Check (if any `.ts`/`.tsx` files changed)

Run from the `StockTracker.Client/` directory:

```
npx tsc --noEmit
```

Record any type errors.

### Phase 3: Automated Results Gate

Present automated check results in a summary table:

```
| Check          | Status | Issues |
|----------------|--------|--------|
| dotnet build   | PASS/FAIL | count |
| dotnet test    | PASS/FAIL | count |
| npm run lint   | PASS/FAIL | count |
| tsc --noEmit   | PASS/FAIL | count |
```

If any check has **errors** (not warnings), list them and stop. The user must fix automated failures before the manual review proceeds. Warnings are noted but do not block.

### Phase 4: Manual Code Review

Read every changed file. Review .NET files against `references/dotnet-checklist.md` and React/TypeScript files against `references/react-checklist.md`.

To load the checklists, read the reference files from this skill's directory:
- `references/dotnet-checklist.md` for .NET review rules
- `references/react-checklist.md` for React/TypeScript review rules

#### For each changed `.cs` file, check:

**Controller Discipline**
- No business logic in controllers — controllers only validate, delegate to services, and return responses
- DTOs at the API boundary — no entity classes exposed in request/response
- Consistent `ActionResult<T>` usage

**Documentation**
- XML doc comments (`<summary>`) on all public API methods (controllers, service interfaces)
- No redundant docs on private/internal members

**Naming Conventions**
- PascalCase for classes, methods, properties
- camelCase for locals and parameters
- _camelCase for private fields
- I-prefix for interfaces, Async suffix for async methods, Dto suffix for DTOs

**Nullable Reference Types**
- No unguarded `!` operators
- Proper `?` annotations on nullable types
- Guard clauses (`ArgumentNullException.ThrowIfNull`) for non-nullable parameters

**EF Core**
- No N+1 queries — use `.Include()` or `.Select()` projection
- Async all the way — `ToListAsync`, `SaveChangesAsync`, etc.
- `.AsNoTracking()` for read-only queries

**DI**
- All services registered in DI container
- Correct lifetimes (Scoped for DB services)
- No `new` instantiation of injectable services

**General**
- No `async void`
- No swallowed exceptions (empty `catch {}`)
- Case-insensitive string comparisons use `StringComparison.OrdinalIgnoreCase`

#### For each changed `.ts`/`.tsx` file, check:

**TypeScript Strictness**
- No `any` type usage
- `import type` for interfaces and type-only imports
- No `@ts-ignore` without justification comment

**Component Quality**
- Loading states for all async operations
- Error states for all async operations
- Empty states for lists and tables (no blank screens when data is empty)
- Stable `key` props on `.map()` renders (no array index keys)

**Hooks**
- Complete dependency arrays in `useEffect` and `useCallback`
- Cleanup functions in effects with subscriptions/timers
- No direct state mutation

**Styling**
- No inline `style` props — use CSS modules or plain CSS
- No Tailwind or CSS-in-JS libraries
- Dark theme consistency per project conventions

**API Integration**
- `try/catch` on every async API call
- Use Axios client from `src/api/stocks.ts`, not raw `fetch()`
- Loading state set `true` before call, `false` in `finally`

**General**
- Functional components only
- No unused imports or variables
- Props interfaces defined and imported with `import type`

### Phase 5: Report Findings

Present findings organized by severity:

**BLOCK** — Must fix before commit:
- Build/test/lint failures (from Phase 2)
- Business logic in controllers
- Missing error/loading/empty states
- `any` types, inline styles, entity exposure at API boundary
- N+1 queries, async void, swallowed exceptions

**WARN** — Should fix, but does not block commit:
- Missing XML doc comments
- Missing `AsNoTracking` on read queries
- Missing `import type` on type-only imports
- Incomplete dependency arrays in hooks

**INFO** — Suggestions for improvement:
- Naming convention inconsistencies
- Opportunities to extract custom hooks
- Minor style improvements

Format each finding as:
```
[SEVERITY] file:line — description
```

### Phase 6: Verdict

End with a clear verdict:

- **APPROVED** — No BLOCK findings. Safe to commit.
- **CHANGES REQUESTED** — BLOCK findings exist. List specific items to fix. Do not proceed with commit until resolved.

If the verdict is APPROVED, the commit may proceed. If CHANGES REQUESTED, do not commit — present the list of required fixes and offer to help implement them.
