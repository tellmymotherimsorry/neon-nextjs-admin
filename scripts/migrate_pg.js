const fs = require('fs')
const { Client } = require('pg')

const sql = fs.readFileSync('./sql/create_tables.sql', 'utf8')
const conn = process.env.NEON_DATABASE_URL || ''
if (!conn) {
  console.error('NEON_DATABASE_URL is not set')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    await client.query(sql)
    console.log('Migration applied successfully (pg)')
  } catch (err) {
    console.error('Migration failed (pg):', err && err.message ? err.message : err)
    process.exitCode = 1
  } finally {
    try { await client.end() } catch (e) {}
  }
}

run()
