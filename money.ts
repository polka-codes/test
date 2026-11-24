export type LineItem = { unitPriceCents: number; quantity: number }

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
}

export function discountedTotal(cents: number, discountBps: number): number {
  if (!Number.isInteger(cents) || !Number.isFinite(discountBps)) {
    return Math.round(cents * (1 - discountBps / 10_000))
  }

  // Interpret the shortest decimal representation exactly, including exponent notation.
  const [significand, exponent = '0'] = discountBps.toString().split('e')
  const [whole, fraction = ''] = significand.split('.')
  const shift = Number(exponent) - fraction.length
  const coefficient = BigInt(whole + fraction)
  const basisPoints = shift >= 0 ? coefficient * 10n ** BigInt(shift) : coefficient
  const scale = shift < 0 ? 10n ** BigInt(-shift) : 1n

  const denominator = 10_000n * scale
  const multiplier = denominator - basisPoints
  const numerator = BigInt(cents) * multiplier
  let rounded = numerator / denominator
  const twiceRemainder = 2n * (numerator % denominator)

  // BigInt division truncates toward zero, which already rounds negative ties up.
  if (twiceRemainder >= denominator) rounded += 1n
  else if (twiceRemainder < -denominator) rounded -= 1n

  const negativeCents = cents < 0 || Object.is(cents, -0)
  return rounded === 0n && negativeCents !== (multiplier < 0n) ? -0 : Number(rounded)
}
