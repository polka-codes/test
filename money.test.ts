import { expect, test } from 'bun:test'
import { discountedTotal, subtotal } from './money'

test('subtotal includes quantity', () => {
  expect(subtotal([{ unitPriceCents: 125, quantity: 3 }, { unitPriceCents: 80, quantity: 2 }])).toBe(535)
})

test('ordinary whole-cent discount', () => {
  expect(discountedTotal(1000, 5000)).toBe(500)
})

test('exact half-cent discount rounds upward', () => {
  expect(discountedTotal(75, 7800)).toBe(17)
})
