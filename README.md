# Deferred setup fixture

The check and preview both import the declared `kleur` dependency. A fresh checkout must install it before execution. `node_modules` is never committed.

- Setup: `bun install --frozen-lockfile`
- Check: `bun run check`
- Preview: `PORT=3000 bun run dev`, listening on all interfaces
- Expected check output and page heading: `STAGING_DEFERRED_READY`

There is deliberately no `.polkacodes.yml` init command or GitHub Actions workflow. Use Isolated. In staging, search for the marker first without running commands; let the first check or managed preview resolve setup from this manifest and lockfile. Do not install dependencies manually in a test chat. Use separate fresh chats for check-first and preview-first coverage, and stop the managed preview afterward.
