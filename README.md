# Repository settings spacing fixture

The initial page intentionally gives `main` excessive right padding. Fix only that layout defect while keeping the repository name, Autonomy, and Save settings controls usable.

- Preview: `PORT=3000 node server.js`, listening on all interfaces
- Structural check: `node check-layout.js`
- No dependencies or installation are required.

Create a run-owned branch from this template before testing. Start the managed preview, open it in Codex in-app Browser, and capture a full-size screenshot of the initial page. Attach that screenshot to the coding request in the same chat. Inspect the corrected preview after the edit and reload the pending diff. The structural check alone does not verify spacing. Keep the edit pending; do not commit or publish it. Stop the managed server when finished. Preserve the template's intentionally broken layout for future runs.
