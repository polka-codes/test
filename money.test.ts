import { expect, test } from 'bun:test'
import { subtotal, discountedTotal } from './money'
test('subtotal multiplies quantities', () => { expect(subtotal([{ unitPrice: 125, quantity: 3 }, { unitPrice: 80, quantity: 2 }])).toBe(535) })
test('discount rounds exact half-cent up', () => { expect(discountedTotal(75, 7800)).toBe(17) })
