import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes quantity', () => {
  expect(subtotal([{ unitPriceCents: 125, quantity: 3 }, { unitPriceCents: 80, quantity: 2 }])).toBe(535)
})

test('empty receipt has zero subtotal', () => {
  expect(subtotal([])).toBe(0)
})

test('zero quantity contributes nothing', () => {
  expect(subtotal([{ unitPriceCents: 125, quantity: 0 }, { unitPriceCents: 80, quantity: 2 }])).toBe(160)
})

test('ordinary whole-cent discount', () => {
  expect(discountedTotal(1000, 5000)).toBe(500)
})

test('exact half-cent discount rounds upward', () => {
  expect(discountedTotal(75, 7800)).toBe(17)
})

test('discounts on either side of a half-cent round to the nearest cent', () => {
  expect(discountedTotal(75, 7801)).toBe(16)
  expect(discountedTotal(75, 7799)).toBe(17)
})

test('zero and full discounts preserve the endpoints', () => {
  expect(discountedTotal(75, 0)).toBe(75)
  expect(discountedTotal(75, 10_000)).toBe(0)
  expect(discountedTotal(0, 7800)).toBe(0)
})
