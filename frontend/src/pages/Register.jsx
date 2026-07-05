
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthScreen from '../components/AuthScreen'
import { useAuth } from '../auth/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  // AuthScreen will call this with { name, email, password }
  const handleSubmit = async ({ name, email, password }) => {
    setSubmitting(true)
    setError(null)
    setInfo(null)

    try {
      const { emailConfirmationRequired } = await signUp({ name, email, password })

      if (emailConfirmationRequired) {
        setInfo('Check your email to confirm your account, then log in.')
        setTimeout(() => {
          navigate('/login', {
            replace: true,
            state: { message: 'Check your email to confirm your account, then log in.' },
          })
        }, 2000)
      } else {
        // If confirmation is not required, log them in or redirect home
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthScreen
      mode="register"
      onSubmit={handleSubmit}
      onSwitchMode={() => navigate('/login')}
      onBack={() => navigate('/')}
      submitting={submitting}
      error={error}
      info={info}
    />
  )
}

