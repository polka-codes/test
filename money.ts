export type Item = { unitCents: number; quantity: number }

export function subtotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.unitCents, 0)
}

export function discountedTotal(cents: number, discountBps: number) {
  return Math.round(cents * (1 - discountBps / 100))
}
