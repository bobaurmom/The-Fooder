import { useNavigate } from 'react-router-dom'
import ProfileScreen from '../components/ProfileScreen'
import { useAuth } from '../auth/AuthContext'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const handleChangePassword = async () => {
    const { supabase } = await import('../lib/supabaseClient')
    await supabase.auth.resetPasswordForEmail(user.email)
    alert('Check your email for a password reset link.')
  }

  return (
    <ProfileScreen
      user={user}
      onBack={() => navigate('/')}
      onLogout={handleLogout}
      onChangePassword={handleChangePassword}
      onEditProfile={() => navigate('/profile/edit')}
    />
  )
}