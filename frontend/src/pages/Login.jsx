import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthScreen from '../components/AuthScreen'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const redirectTo = location.state?.from?.pathname || '/'

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true)
    setError(null)
    try {
      await signIn({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthScreen
      mode="login"
      onSubmit={handleSubmit}
      onSwitchMode={() => navigate('/register')}
      onBack={() => navigate('/')}
      submitting={submitting}
      error={error}
      info={location.state?.message}
    />
  )
}
