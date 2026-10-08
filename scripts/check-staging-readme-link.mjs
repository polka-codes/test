import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readme = readFileSync('README.md', 'utf8');
const links = [...readme.matchAll(/href="#(staging-qa-[^"]+)"/g)];
assert.equal(links.length, 1, 'Expected one staging QA navigation link');
const headings = [...readme.matchAll(/^## (Staging QA .+)$/gm)].map(([, heading]) => heading.toLowerCase().replaceAll(' ', '-'));
assert.ok(headings.includes(links[0][1]), 'Staging QA link must resolve to its README heading');
console.log('Staging QA README local link passed');
