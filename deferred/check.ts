import assert from 'node:assert/strict'
import kleur from 'kleur'
import { marker } from './marker'

const colorsEnabled = kleur.enabled
try {
  kleur.enabled = true
  assert.equal(kleur.green(marker), `\x1b[32m${marker}\x1b[39m`)
  kleur.enabled = false
  assert.equal(kleur.green(marker), marker)
} finally {
  kleur.enabled = colorsEnabled
}

console.log(marker)
