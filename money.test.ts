import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes every unit', () => {
  expect(subtotal([{ unitCents: 125, quantity: 3 }])).toBe(375)
  expect(subtotal([])).toBe(0)
  expect(subtotal([{ unitCents: 200, quantity: 0 }])).toBe(0)
})

test('subtotal sums quantities across multiple items', () => {
  expect(subtotal([
    { unitCents: 125, quantity: 3 },
    { unitCents: 200, quantity: 2 },
  ])).toBe(775)
})

test('discounted total uses basis points including zero and full discounts', () => {
  expect(discountedTotal(375, 0)).toBe(375)
  expect(discountedTotal(375, 10000)).toBe(0)
  expect(discountedTotal(10000, 1)).toBe(9999)
})

test('discounted total rounds to the nearest cent', () => {
  expect(discountedTotal(375, 1000)).toBe(338)
  expect(discountedTotal(376, 1000)).toBe(338)
})
