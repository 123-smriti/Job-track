import { useEffect, useState } from 'react'
import AuthContext from './auth-context'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
async function readResponse(response) {
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(credentials) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    const data = await readResponse(response)
    setUser(data.user)
    return data.user
  }

  async function register(details) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(details),
    })
    const data = await readResponse(response)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export { AuthProvider }
