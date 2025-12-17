'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nama: '',
    alamat: '',
    no_ktp: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    // Validasi KTP
    if (formData.no_ktp.length !== 16) {
      setError('Nomor KTP harus 16 digit')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // 1. Registrasi user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Gagal membuat user')

      // 2. Simpan profile ke database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          nama: formData.nama,
          alamat: formData.alamat,
          no_ktp: formData.no_ktp,
          foto_url: null,
        })

      if (profileError) throw profileError

      // Redirect ke login
      alert('Registrasi berhasil! Silakan login.')
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="label">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                className="input"
                placeholder="Nama lengkap Anda"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">Alamat</label>
              <textarea
                name="alamat"
                className="input"
                placeholder="Alamat lengkap"
                rows={3}
                value={formData.alamat}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">Nomor KTP</label>
              <input
                type="text"
                name="no_ktp"
                className="input"
                placeholder="16 digit nomor KTP"
                value={formData.no_ktp}
                onChange={handleChange}
                required
                pattern="[0-9]{16}"
                maxLength={16}
              />
              <p className="mt-1 text-xs text-gray-500">Masukkan 16 digit angka</p>
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
