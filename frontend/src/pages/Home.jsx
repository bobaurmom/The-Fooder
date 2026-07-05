import { useNavigate } from 'react-router-dom'
import HomeScreen from '../components/HomeScreen'

export default function Home() {
  const navigate = useNavigate()

  // /profile is wrapped in <ProtectedRoute>, so:
  // - logged in    -> lands on the profile page
  // - not logged in -> ProtectedRoute bounces them to /login automatically
  const handleProfileClick = () => navigate('/profile')
  const handleFilterClick = () => navigate('/filter')

  return <HomeScreen onProfileClick={handleProfileClick} onFilterClick={handleFilterClick} />
}
