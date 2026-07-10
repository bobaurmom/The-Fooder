import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const data = await loginUser(form.identifier, form.password);

      console.log('LOGIN SUCCESS:', data);

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Fetch user role from backend to get the custom role field
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/user`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        const userData = await response.json();
        
        // Merge Supabase user data with custom user data including role
        const mergedUser = {
          ...data.user,
          ...userData.user
        };
        
        localStorage.setItem('user', JSON.stringify(mergedUser));
        
        // Navigate based on role
        if (mergedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/fyp');
        }
      } catch (fetchError) {
        console.error('Error fetching user data:', fetchError);
        // Fallback to storing just Supabase user data
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/fyp');
      }
    } catch (err) {
      console.log('LOGIN ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <h1 className="brand-title">Fooder</h1>
        <p className="brand-subtitle">Order your favourite food!</p>

        <div className="auth-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <label>Email or Username</label>
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="auth-links">
              <span>Forget Password?</span>
              <Link to="/register">Sign up?</Link>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;