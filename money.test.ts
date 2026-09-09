import { expect, test } from 'bun:test'
import { subtotal } from './money'

test('subtotal includes every unit', () => {
  expect(subtotal([{ unitCents: 125, quantity: 3 }])).toBe(375)
  expect(subtotal([])).toBe(0)
  expect(subtotal([{ unitCents: 200, quantity: 0 }])).toBe(0)
})
