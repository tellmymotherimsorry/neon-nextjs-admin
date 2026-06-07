import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || undefined,
  ssl: { rejectUnauthorized: false } as any,
})

export async function query(text: string, params?: any[]) {
  return pool.query(text, params)
}
