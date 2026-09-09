import { expect, test } from 'bun:test'
import { receipt } from './receipt'

test('receipt applies quantity and a basis-point discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 3 }], 1000)).toBe('3.38')
})

test('receipt preserves cents without a discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 1 }], 0)).toBe('1.25')
})

test('receipt rounds once after totaling all items', () => {
  expect(receipt([
    { unitCents: 1, quantity: 1 },
    { unitCents: 1, quantity: 1 },
  ], 5000)).toBe('0.01')
  expect(receipt([{ unitCents: 1, quantity: 2 }], 5000)).toBe('0.01')
})

test('receipt formats zero and whole-dollar totals with two decimal places', () => {
  expect(receipt([], 0)).toBe('0.00')
  expect(receipt([{ unitCents: 125, quantity: 0 }], 1000)).toBe('0.00')
  expect(receipt([{ unitCents: 125, quantity: 3 }], 10_000)).toBe('0.00')
  expect(receipt([{ unitCents: 100, quantity: 2 }], 0)).toBe('2.00')
})
