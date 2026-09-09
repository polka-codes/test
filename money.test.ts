import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes every unit', () => {
  expect(subtotal([{ unitCents: 125, quantity: 3 }])).toBe(375)
  expect(subtotal([])).toBe(0)
  expect(subtotal([{ unitCents: 200, quantity: 0 }])).toBe(0)
})

test('subtotal sums line totals', () => {
  expect(subtotal([
    { unitCents: 125, quantity: 3 },
    { unitCents: 200, quantity: 2 },
  ])).toBe(775)
})

test('discounted total converts basis points and rounds to cents', () => {
  expect(discountedTotal(375, 1000)).toBe(338)
  expect(discountedTotal(374, 1000)).toBe(337)
  expect(discountedTotal(125, 0)).toBe(125)
  expect(discountedTotal(125, 10_000)).toBe(0)
})
