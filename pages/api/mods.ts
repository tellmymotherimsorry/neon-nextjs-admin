import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

const READ_SECRET = process.env.READ_SECRET || process.env.NEXT_PUBLIC_READ_SECRET || 'myreadsecret456'

function badAuth(res: NextApiResponse) {
  res.status(401).json({ error: 'unauthorized' })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const head = req.headers['x-read-secret'] as string | undefined
    if (head !== READ_SECRET) return badAuth(res)

    const result = await query('SELECT username FROM mod_users')
    const rows = result?.rows?.map((r: any) => r.username) || []
    return res.status(200).json(rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
}
