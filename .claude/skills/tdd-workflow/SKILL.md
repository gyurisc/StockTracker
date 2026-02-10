---
name: tdd-workflow
description: Use this skill whenever implementing a feature using TDD.
author: Krisztian Gyuris
---

The goal of this skill is to implement a true test-driven development workflow (Red-Green-Refactor).

## The Cycle

1. Write the simplest test for ONE discrete piece of functionality.
2. Run the test — confirm it FAILS (Red).
3. Write the minimum code needed to make the test pass.
4. Run the test — confirm it PASSES (Green).
5. Refactor if necessary, keeping all tests green.
6. Commit.

Repeat this cycle for each new piece of functionality until the feature is complete.

## Rules

- Never write more than one failing test at a time.
- Never implement more than one discrete piece of functionality at a time.
- Never write production code without a failing test driving it.
- Never skip the red step — if the test passes immediately, the test is wrong or unnecessary.
- Keep tests focused: one assertion per test where possible.
- Name tests clearly: `MethodName_Scenario_ExpectedResult`.

## For this project

- API tests: xUnit + EF Core InMemory (`StockTracker.Api.Tests/`)
- Run tests: `dotnet test` from solution root
- Test services directly, not controllers — controllers should be thin.