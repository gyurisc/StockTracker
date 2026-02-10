# React / TypeScript Code Review Checklist

## TypeScript Strictness

- [ ] **No `any` type** — Every variable, parameter, and return type must have an explicit type or be correctly inferred. `unknown` is acceptable when the type is genuinely unknown, followed by narrowing.
- [ ] **`import type` for interfaces and type-only imports** — Use `import type { StockDto }` when the import is only used for type checking, not at runtime. This ensures clean tree-shaking and signals intent.
- [ ] **Strict mode compliance** — No `@ts-ignore` or `@ts-expect-error` without a comment explaining why.

## Component Quality

- [ ] **Loading states for async operations** — Every component that fetches data must show a loading indicator while the request is in flight. No blank screens during loading.
- [ ] **Error states for async operations** — Every component that fetches data must handle and display errors. Show a meaningful message, not a blank screen or console error.
- [ ] **Empty states for lists/tables** — When a list or table has zero items, display an informative empty state (e.g., "No stocks in your portfolio yet. Add one above."). Never show an empty table with just headers or a blank area.
- [ ] **Key props on list items** — Every `.map()` rendering must use a stable, unique `key` prop. Never use array index as key when items can be reordered or deleted.

## Hooks Correctness

- [ ] **No stale closures** — `useEffect` and `useCallback` dependency arrays include all referenced variables. Missing dependencies cause stale data bugs.
- [ ] **Cleanup in useEffect** — Effects that set up subscriptions, timers, or event listeners must return a cleanup function.
- [ ] **No direct state mutation** — Never mutate state objects/arrays directly. Always create new references (spread operator, `.filter()`, `.map()`).
- [ ] **Custom hooks extract shared logic** — If two components duplicate the same state + effect pattern, extract it into a custom hook.

## Styling

- [ ] **No inline styles** — Never use the `style` prop on elements. All styling must use CSS modules or plain CSS files, per project convention.
- [ ] **CSS modules or plain CSS only** — No Tailwind, no styled-components, no CSS-in-JS. Keep to the project's established approach.
- [ ] **Dark theme consistency** — Colors, backgrounds, and borders should follow the fintech dashboard palette defined in project docs.

## API Integration

- [ ] **Error handling on all API calls** — Every `async` API call must have a `try/catch` or `.catch()`. Errors update component error state.
- [ ] **No direct fetch** — Use the Axios client from `src/api/stocks.ts`. Do not call `fetch()` directly.
- [ ] **Loading state management** — Set loading `true` before the call, `false` in `finally`. Never leave loading state stuck.

## General React Quality

- [ ] **Functional components only** — No class components.
- [ ] **No unused imports or variables** — ESLint should catch these, but verify manually.
- [ ] **Props interfaces defined** — Every component with props has an explicit `interface` (or `type`) for its props, imported with `import type` if used elsewhere.
- [ ] **Meaningful component names** — Component names reflect their purpose (e.g., `StockList`, `AddStock`), not generic names (e.g., `Table`, `Form`).
