import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

const READ_SECRET = process.env.READ_SECRET || process.env.NEXT_PUBLIC_READ_SECRET || 'myreadsecret456'
const WRITE_SECRET = process.env.WRITE_SECRET || process.env.NEXT_PUBLIC_WRITE_SECRET || 'mysecretkey123'

function badAuth(res: NextApiResponse) {
  res.status(401).json({ error: 'unauthorized' })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT username FROM banned_users')
      const rows = result?.rows?.map((r: any) => r.username) || []
      return res.status(200).json(rows)
    }

    const writeHead = req.headers['x-secret'] as string | undefined
    if (writeHead !== WRITE_SECRET) return badAuth(res)

    if (req.method === 'POST') {
      const { username } = req.body || {}
      if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username required' })
      await query('INSERT INTO banned_users (username) VALUES ($1) ON CONFLICT DO NOTHING', [username])
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const { username } = req.body || {}
      if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username required' })
      await query('DELETE FROM banned_users WHERE username = $1', [username])
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
}
