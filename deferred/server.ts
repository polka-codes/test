import kleur from 'kleur'
import { marker } from './marker'

const port = Number(process.env.PORT)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535')
}

const server = Bun.serve({
  port,
  fetch() {
    return new Response(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Deferred fixture</title></head>
<body><h1>${Bun.escapeHTML(marker)}</h1></body>
</html>`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  },
})

console.log(kleur.green(`${marker} — listening on port ${server.port}`))
