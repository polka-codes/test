import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes every unit', () => {
  expect(subtotal([{ unitCents: 125, quantity: 3 }])).toBe(375)
  expect(subtotal([])).toBe(0)
  expect(subtotal([{ unitCents: 200, quantity: 0 }])).toBe(0)
  expect(subtotal([
    { unitCents: 125, quantity: 3 },
    { unitCents: 200, quantity: 2 },
  ])).toBe(775)
})

test('discounted total uses basis points and rounds to the nearest cent', () => {
  expect(discountedTotal(375, 1000)).toBe(338)
  expect(discountedTotal(125, 0)).toBe(125)
  expect(discountedTotal(125, 10_000)).toBe(0)
  expect(discountedTotal(0, 1000)).toBe(0)
  expect(discountedTotal(100, 1)).toBe(100)
  expect(discountedTotal(101, 1000)).toBe(91)
  expect(discountedTotal(100, 5450)).toBe(46)
})
