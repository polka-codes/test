import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
for (const required of ['<!doctype html>','Repository settings','label for="name"','id="name"','label for="autonomy"','id="autonomy"','Save settings']) { if(!html.includes(required)) throw new Error('Missing fixture requirement: '+required); }
console.log('Repository settings fixture structure passes');
