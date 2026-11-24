import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes quantity', () => {
  expect(subtotal([{ unitPriceCents: 125, quantity: 3 }, { unitPriceCents: 80, quantity: 2 }])).toBe(535)
})

test('subtotal handles empty receipts and zero quantities', () => {
  expect(subtotal([])).toBe(0)
  expect(subtotal([{ unitPriceCents: 125, quantity: 0 }, { unitPriceCents: 80, quantity: 2 }])).toBe(160)
})

test('ordinary whole-cent discount', () => {
  expect(discountedTotal(1000, 5000)).toBe(500)
})

test('exact half-cent discount rounds upward', () => {
  expect(discountedTotal(75, 7800)).toBe(17)
  expect(discountedTotal(-75, 7800)).toBe(-16)
})

test('discounts on either side of a half-cent round to the nearest cent', () => {
  expect(discountedTotal(75, 7801)).toBe(16)
  expect(discountedTotal(75, 7799)).toBe(17)
})

test('fractional basis points are interpreted as exact decimals', () => {
  expect(discountedTotal(3125, 1.6)).toBe(3125)
  expect(discountedTotal(1_000_000_000_000, 0.0000001)).toBe(999_999_999_990)
})

test('discount rounding preserves the sign of zero', () => {
  expect(Object.is(discountedTotal(-1, 5000), -0)).toBe(true)
  expect(Object.is(discountedTotal(-1, 10_000), -0)).toBe(true)
  expect(Object.is(discountedTotal(0, 10_001), -0)).toBe(true)
  expect(Object.is(discountedTotal(-0, 0), -0)).toBe(true)
  expect(Object.is(discountedTotal(-0, 10_001), 0)).toBe(true)
})

test('fractional amounts and non-finite inputs retain Number behavior', () => {
  expect(discountedTotal(12.5, 0)).toBe(13)
  expect(discountedTotal(Infinity, 0)).toBe(Infinity)
  expect(discountedTotal(75, NaN)).toBeNaN()
})
