import { expect, test } from 'bun:test'
import { receipt } from './receipt'

test('receipt applies quantity and a basis-point discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 3 }], 1000)).toBe('3.38')
})

test('receipt preserves cents without a discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 1 }], 0)).toBe('1.25')
})

test('receipt rounds the discounted subtotal once, not each line', () => {
  expect(receipt([
    { unitCents: 5, quantity: 1 },
    { unitCents: 5, quantity: 1 },
  ], 1000)).toBe('0.09')
})

test('receipt formats zero totals with two decimal places', () => {
  expect(receipt([], 0)).toBe('0.00')
  expect(receipt([{ unitCents: 125, quantity: 3 }], 10000)).toBe('0.00')
})
