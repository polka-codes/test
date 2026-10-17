# Contributor getting-started guide

This repository is a Next.js starter with TypeScript, Jest unit tests, and Playwright end-to-end tests. Run the commands below from the repository root with Node.js and npm installed.

## Install dependencies

Clone `polka-codes/test` (or your fork), enter its directory, then run:

```bash
npm install
```

The install runs the Paraglide compile `postinstall` script, generating translations in `src/paraglide`, and the Husky `prepare` script for Git hooks.

For app and end-to-end work, copy `.env.example` to `.env` and configure the values required by `src/env.mjs`. Database-backed features need a reachable database; authentication and payments need appropriate service configuration. Installation does not supply local credentials or provision these services. Keep `.env` and secrets out of commits.

## Run tests and checks

Unit tests use Jest, which excludes the end-to-end test directory:

```bash
npm run test
```

For watch mode, use `npm run test:watch`.

End-to-end tests use Playwright. Install its browser binaries and system dependencies before the first run (and again when needed after Playwright updates):

```bash
npx playwright install --with-deps
npm run e2e
```

System dependency installation may require elevated permissions. `playwright.config.ts` runs tests in `src/__tests__/e2e` against Chromium, Firefox, and WebKit. It starts the app with `npm run dev` at `http://127.0.0.1:3000`, or reuses an existing server locally; no separate server command is normally needed. App environment setup still applies. For interactive testing, use `npm run e2e:ui`.

Run the additional checks used by CI:

```bash
npm run lint
npm run typecheck
npm run format:check
```

`.github/workflows/lint.yml` runs these three checks plus `npm run test` for pull requests targeting `main`. `.github/workflows/playwright.yml` installs Playwright browsers and runs `npm run e2e`. The formatting script checks TypeScript, TSX, and MDX files, not plain Markdown; review `.md` changes manually.

## Submit a draft pull request

1. Start from an up-to-date `main` and create a focused branch for your change.
2. Make the change, run the relevant checks above, and review the diff for unrelated files or secrets.
3. Commit your changes and push the branch to your fork or another remote you are authorized to use.
4. On GitHub, open a pull request against `polka-codes/test` with base branch `main` and your pushed branch as the head.
5. Give it a clear title and summarize the change, checks run, and any failures or setup limitations. Update the PR template's issue placeholder with a relevant issue, or remove it if none applies.
6. Select **Create draft pull request** from the create-button dropdown. Keep it in draft while work remains, then request review when ready.
