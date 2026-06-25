import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>Welcome to Fooder</h1>
      <p>Hello, {user?.email || 'User'}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;