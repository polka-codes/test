import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const readmePath = fileURLToPath(new URL('./README.md', import.meta.url));
const markdown = readFileSync(readmePath, 'utf8');
// The fixture uses inline Markdown links, optionally with titles or angle brackets.
const links = /\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;
const missing: string[] = [];
let checked = 0;

for (const match of markdown.matchAll(links)) {
  const target = match[1] ?? match[2];
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(target)) continue;

  // Queries and fragments are not part of the on-disk filename.
  const pathname = decodeURIComponent(target.split(/[?#]/, 1)[0]);
  if (!pathname) continue;

  checked += 1;
  if (!existsSync(resolve(dirname(readmePath), pathname))) {
    missing.push(target);
  }
}

if (missing.length > 0) {
  console.error(`Missing relative Markdown link targets:\n${missing.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} relative Markdown link target(s): all exist.`);
}
