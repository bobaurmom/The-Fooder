import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'

export default function Auth() {
  const { signUp, signIn, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fn = isSignUp ? signUp : signIn
    const { error } = await fn(email, password)

    if (!error) {
      setEmail('')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
    </div>
  )
}
