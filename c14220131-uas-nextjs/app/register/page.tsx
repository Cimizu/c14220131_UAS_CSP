'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from './actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    try {
      const result = await registerUser(formData)
      
      // Jika ada result (error), tampilkan
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // Jika tidak ada result, berarti redirect berhasil
    } catch (error) {
      // Biarkan redirect error bubble up (ini normal behavior Next.js)
      throw error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buat Akun Baru
          </h1>
          <p className="text-gray-600">Daftar untuk membuat profile Anda</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="label">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input"
                placeholder="Ulangi password"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link 
                href="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
