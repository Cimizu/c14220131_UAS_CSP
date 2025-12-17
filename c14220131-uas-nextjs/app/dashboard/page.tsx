import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogoutButton } from './LogoutButton'
import type { Announcement } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createClient()

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  // Get announcements
  const { data: announcements, error: announcementError } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header dengan Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Selamat datang kembali! 👋</p>
          </div>
          <LogoutButton />
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Anda</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pengumuman</h2>
          
          {announcements && announcements.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {announcements.map((announcement: Announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
                    {announcement.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    📅{' '}
                    {new Date(announcement.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border-l-4 border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">Belum ada pengumuman</p>
              <p className="text-gray-400 text-sm mt-2">
                Cek kembali nanti untuk update terbaru
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
