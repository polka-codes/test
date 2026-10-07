# Teh receipt service

This is a disposable staging E2E receipt fixture for run 20261007-c1.

## Contract
- `subtotal(items)` sums each unit price in cents multiplied by quantity.
- `discountedTotal(cents, discountBps)` applies the discount to the integer-cent total and rounds to the nearest cent, with exact half-cent ties upward. For 75 cents at 7800 basis points discount, the result is 17 cents.
- Preserve public function names and parameter types.

[Fixture guide](./guide.md)

Run `bun test money.test.ts` for the focused arithmetic checks; `bun run check` provides the general check. `bun run verify:external` requires RECEIPT_SERVICE_URL and must remain blocked when it is unset. Do not replace or skip that verification when requested.

The receipt checks use only Bun built-ins and require no package download. Keep fixture PRs based on this branch, never main.

## Deferred fixture

The deferred fixture uses the registry-installed `kleur` dependency. Run `bun install` to restore dependencies.

Check:

```sh
bun run check:deferred
```

Preview (starts a server only when explicitly run):

```sh
PORT=3001 bun run deferred/server.ts
```
