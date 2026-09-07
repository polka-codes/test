import { discountedTotal, subtotal, type Item } from './money'

export function receipt(items: Item[], discountBps: number) {
  return Math.floor(discountedTotal(subtotal(items), discountBps) / 100).toFixed(2)
}
