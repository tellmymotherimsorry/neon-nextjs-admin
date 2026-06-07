import React, { useEffect, useState } from 'react'

const READ_SECRET = process.env.NEXT_PUBLIC_READ_SECRET || 'myreadsecret456'
const WRITE_SECRET = process.env.NEXT_PUBLIC_WRITE_SECRET || 'mysecretkey123'

export default function Home() {
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [banned, setBanned] = useState<string[]>([])
  const [newUser, setNewUser] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) fetchBanned()
  }, [isAdmin])

  async function fetchBanned() {
    setLoading(true)
    try {
      const res = await fetch('/api/banned', { headers: { 'x-read-secret': READ_SECRET } })
      const data = await res.json()
      setBanned(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function addUser() {
    if (!newUser) return
    await fetch('/api/banned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-secret': WRITE_SECRET },
      body: JSON.stringify({ username: newUser })
    })
    setNewUser('')
    fetchBanned()
  }

  async function removeUser(u: string) {
    await fetch('/api/banned', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-secret': WRITE_SECRET },
      body: JSON.stringify({ username: u })
    })
    fetchBanned()
  }

  async function banAllServers() {
    await fetch('/api/trigger', { method: 'POST', headers: { 'x-secret': WRITE_SECRET } })
  }

  return (
    <div style={{ background: '#0b0f12', color: '#e6eef6', minHeight: '100vh', padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>Admin Console</h1>

        {!isAdmin ? (
          <div style={{ display: 'grid', gap: 8, maxWidth: 320, margin: '40px auto' }}>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 6, border: '1px solid #223', background: '#071019', color: '#e6eef6' }}
            />
            <button
              onClick={() => { if (password === 'ADMIN') setIsAdmin(true) }}
              style={{ padding: 10, borderRadius: 6, background: '#272dff', color: '#fff', border: 'none' }}>
              Login
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <input
                placeholder="Username to ban"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #223', background: '#071019', color: '#e6eef6' }}
              />
              <button onClick={addUser} style={{ padding: 8, borderRadius: 6, background: '#1db954', color: '#fff', border: 'none' }}>Add</button>
              <button onClick={() => { setIsAdmin(false); setPassword('') }} style={{ marginLeft: 'auto', padding: 8, borderRadius: 6, background: '#555', color: '#fff', border: 'none' }}>Logout</button>
            </div>

            <div style={{ marginTop: 8 }}>
              <h2>Ban List</h2>
              {loading ? <div>Loading...</div> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {banned.map((u) => (
                    <li key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                      <span style={{ flex: 1 }}>{u}</span>
                      <button onClick={() => removeUser(u)} style={{ padding: 6, borderRadius: 6, background: '#ff4d4f', color: '#fff', border: 'none' }}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <button onClick={banAllServers} style={{ padding: 10, borderRadius: 6, background: '#ff6b00', color: '#fff', border: 'none' }}>Ban All Servers</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
