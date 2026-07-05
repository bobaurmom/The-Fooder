import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Avoid a flash-redirect to /login while Supabase is still checking for a session.
    return (
      <div className="flex items-center justify-center h-full text-sm text-neutral-400">
        Loading...
      </div>
    )
  }

  if (!user) {
    // Send the user to log in, and remember where they were headed.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
