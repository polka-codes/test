export function subtotal(items: readonly { unitPrice: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function discountedTotal(cents: number, discountBps: number): number {
  return Math.round(cents * (10000 - discountBps) / 10000)
}
