import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from './LogoutButton'

type Announcement = {
  id: number
  title: string
  content: string
  created_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch announcements
  const { data: announcements, error: announcementsError } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Portal
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {user.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-32">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-32">User ID:</span>
              <span className="text-gray-900 font-mono text-sm">{user.id}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-32">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Announcements
          </h2>
          
          {announcementsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Failed to load announcements
            </div>
          ) : announcements && announcements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement: Announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-8 rounded-lg text-center">
              No announcements available
            </div>
          )}
        </div>
      </main>
    </div>
  )
}