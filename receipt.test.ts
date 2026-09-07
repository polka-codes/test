import { expect, test } from 'bun:test'
import { receipt } from './receipt'

test('receipt applies quantity and a basis-point discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 3 }], 1000)).toBe('3.38')
})

test('receipt preserves cents without a discount', () => {
  expect(receipt([{ unitCents: 125, quantity: 1 }], 0)).toBe('1.25')
})
