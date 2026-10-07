if (!process.env.RECEIPT_SERVICE_URL) {
  console.error('RECEIPT_SERVICE_URL is required; external verification was not run.')
  process.exit(1)
}
throw new Error('This disposable fixture never contacts an external receipt service.')
