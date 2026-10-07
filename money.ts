export type LineItem = { unitPriceCents: number; quantity: number }

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
}

export function discountedTotal(cents: number, discountBps: number): number {
  return Math.round((cents * (10_000 - discountBps)) / 10_000)
}
