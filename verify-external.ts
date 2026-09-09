import { receipt } from './receipt'

const serviceUrl = process.env.RECEIPT_SERVICE_URL
if (!serviceUrl) throw new Error('RECEIPT_SERVICE_URL is required for external verification')

const input = { items: [{ unitCents: 125, quantity: 3 }], discountBps: 1000 }
const response = await fetch(serviceUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
})
if (!response.ok) throw new Error(`Receipt service returned HTTP ${response.status}`)
const result: unknown = await response.json()
if (
  typeof result !== 'object' || result === null || !('total' in result) ||
  result.total !== receipt(input.items, input.discountBps)
) throw new Error('Receipt service total did not match the local calculation')
