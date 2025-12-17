'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import type { UserProfile } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    no_ktp: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  // Sync formData when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        nama: profile.nama,
        alamat: profile.alamat,
        no_ktp: profile.no_ktp,
      })
    }
  }, [profile])

  const checkAuth = async () => {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    loadProfile(user.id)
  }

  const loadProfile = async (userId: string) => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      setError('Gagal memuat profile')
      setLoading(false)
      return
    }

    if (data) {
      setProfile(data)
      setFormData({
        nama: data.nama,
        alamat: data.alamat,
        no_ktp: data.no_ktp,
      })
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setUpdating(true)

    if (!profile) {
      setError('Profile tidak ditemukan')
      setUpdating(false)
      return
    }

    console.log('Updating profile with data:', formData)

    const supabase = createClient()

    const { error, data } = await supabase
      .from('profiles')
      .update({
        nama: formData.nama,
        alamat: formData.alamat,
        no_ktp: formData.no_ktp,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profile.user_id)
      .select()

    if (error) {
      console.error('Update error:', error)
      setError(`Gagal mengupdate profile: ${error.message}`)
      setUpdating(false)
      return
    }

    console.log('Update success:', data)
    setSuccess('Profile berhasil diupdate!')
    setEditing(false)
    setUpdating(false)
    
    // Auto dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccess('')
    }, 3000)
    
    // Reload profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) loadProfile(user.id)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    // Validasi
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    setUploading(true)
    setError('')

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile dengan URL foto
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ foto_url: publicUrl })
        .eq('user_id', profile.user_id)

      if (updateError) throw updateError

      setSuccess('Foto berhasil diupload!')
      
      // Reload profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) loadProfile(user.id)
    } catch (err: any) {
      setError(err.message || 'Upload foto gagal')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-600">Profile tidak ditemukan</p>
        </div>
      </div>
    )
  }

  // Debug log
  console.log('=== DASHBOARD RENDER ===')
  console.log('editing:', editing)
  console.log('formData:', formData)
  console.log('profile:', profile)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Saya</h1>
            <p className="text-gray-600 mt-1">Kelola informasi profile Anda</p>
          </div>
          <button 
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Editing Mode Indicator */}
        {editing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            <strong>Mode Edit:</strong> Silakan ubah data Anda dan klik "Simpan Perubahan"
          </div>
        )}

        {/* Profile Card */}
        <div className="card">
          {/* Photo Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b">
            <div className="relative w-32 h-32 mb-4">
              {profile.foto_url ? (
                <Image
                  src={profile.foto_url}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-4 border-primary-100"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-primary-100">
                  <span className="text-4xl font-bold text-white">
                    {profile.nama.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <label className="btn-secondary cursor-pointer">
              {uploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Mengupload...
                </span>
              ) : (
                'Upload Foto'
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Maksimal 2MB (JPG, PNG)</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nama Lengkap</label>
                <input
                  type="text"
                  className="input"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  disabled={!editing}
                  required
                />
              </div>

              <div>
                <label className="label">No. KTP</label>
                <input
                  type="text"
                  className="input"
                  value={formData.no_ktp}
                  onChange={(e) => setFormData({ ...formData, no_ktp: e.target.value })}
                  disabled={!editing}
                  pattern="[0-9]{16}"
                  maxLength={16}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Alamat</label>
              <textarea
                className="input"
                rows={4}
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                disabled={!editing}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {editing ? (
                <>
                  <button 
                    type="submit" 
                    className="btn-primary flex-1"
                    disabled={updating}
                  >
                    {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Cancel edit clicked')
                      setEditing(false)
                      setFormData({
                        nama: profile.nama,
                        alamat: profile.alamat,
                        no_ktp: profile.no_ktp,
                      })
                      setError('')
                      setSuccess('')
                    }}
                    className="btn-secondary flex-1"
                    disabled={updating}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('=== EDIT BUTTON CLICKED ===')
                    console.log('Before - editing:', editing)
                    console.log('Before - formData:', formData)
                    
                    setEditing(true)
                    
                    // Force update in next tick
                    setTimeout(() => {
                      console.log('After - editing should be true')
                      const inputs = document.querySelectorAll('input, textarea')
                      inputs.forEach((input: any, i) => {
                        console.log(`Input ${i}: disabled=${input.disabled}`)
                      })
                    }, 50)
                  }}
                  className="btn-primary w-full"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t text-sm text-gray-500 space-y-1">
            <p>
              <span className="font-medium">Dibuat:</span>{' '}
              {new Date(profile.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              <span className="font-medium">Terakhir diupdate:</span>{' '}
              {new Date(profile.updated_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
