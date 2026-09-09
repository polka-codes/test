# Receipt example

This example calculates reciepts in integer cents.

Line totals multiply unit price by quantity. Discounts use basis points:
1000 basis points means 10 percent. Round the discounted total once to
the nearest cent, then format it with exactly two decimal places.

Run `bun test` for local checks. `bun run verify:external` additionally
requires RECEIPT_SERVICE_URL, an operator-provided receipt service.
The service must accept POST JSON with items and discountBps and return
JSON with a formatted total matching the local receipt calculation.
