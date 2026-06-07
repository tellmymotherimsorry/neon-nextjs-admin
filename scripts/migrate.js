const fs = require('fs')
const serverless = require('@neondatabase/serverless')

const sql = fs.readFileSync('./sql/create_tables.sql', 'utf8')
const createPool = (serverless && (serverless.createPool || serverless.createClient))
if (!createPool) {
  console.error('neon createPool/createClient not found on package')
  process.exit(1)
}

const pool = createPool(process.env.NEON_DATABASE_URL || '')

async function run() {
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('Migration applied successfully')
  } catch (err) {
    console.error('Migration failed:', err && err.message ? err.message : err)
    process.exitCode = 1
  } finally {
    try { client.release() } catch (e) {}
  }
}

run()
