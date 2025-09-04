#!/usr/bin/env node

const { TorrentTracker } = require('./dist/lib/tracker')

const port = process.env.TRACKER_PORT || 8080

const tracker = new TorrentTracker(port)

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...')
  await tracker.stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...')
  await tracker.stop()
  process.exit(0)
})

// Start the tracker
tracker.start().catch(error => {
  console.error('Failed to start tracker:', error)
  process.exit(1)
})
