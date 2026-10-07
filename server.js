import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
createServer(async (_request,response) => { response.setHeader('Content-Type','text/html; charset=utf-8'); response.end(await readFile(new URL('./index.html',import.meta.url))); }).listen(Number(process.env.PORT || 3000),'0.0.0.0');
