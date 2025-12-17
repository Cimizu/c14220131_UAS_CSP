'use client'

import { useState } from 'react'
import { logoutUser } from './actions'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      // logoutUser() will redirect, so we don't need to do anything after
    } catch (error: any) {
      // redirect() throws an error, but that's expected
      if (error?.message?.includes('NEXT_REDIRECT')) {
        // This is expected, ignore it
        return
      }
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
