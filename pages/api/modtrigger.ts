import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

const WRITE_SECRET = process.env.WRITE_SECRET || process.env.NEXT_PUBLIC_WRITE_SECRET || 'mysecretkey123'

function badAuth(res: NextApiResponse) {
  res.status(401).json({ error: 'unauthorized' })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await query('SELECT triggered FROM mod_trigger_state WHERE id = 1')
      const triggered = result?.rows?.[0]?.triggered ?? false
      return res.status(200).json({ triggered: !!triggered })
    }

    const writeHead = req.headers['x-secret'] as string | undefined
    if (writeHead !== WRITE_SECRET) return badAuth(res)

    if (req.method === 'POST') {
      await query('UPDATE mod_trigger_state SET triggered = true WHERE id = 1')
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      await query('UPDATE mod_trigger_state SET triggered = false WHERE id = 1')
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
}
