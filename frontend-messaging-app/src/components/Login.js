import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    source: 'DASHBOARD'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', formData);
      
      const result = await login(formData);
      
      console.log('Login result:', result);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/messaging');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test login function for debugging
  const testLogin = async () => {
    setIsLoading(true);
    try {
      const testCredentials = {
        username: 'superadmin',
        password: 'Admin@1234',
        source: 'DASHBOARD'
      };
      
      console.log('Testing login with:', testCredentials);
      const result = await login(testCredentials);
      console.log('Test login result:', result);
      
      if (result.success) {
        toast.success('Test login successful!');
        navigate('/messaging');
      } else {
        toast.error(`Test login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Test login error:', error);
      toast.error(`Test login error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Login to Messaging App
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          {/* Test login button for debugging */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={testLogin}
            disabled={isLoading}
          >
            Test Login (superadmin)
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p>
            Don't have an account?{' '}
            <button
              className="btn"
              style={{ background: 'none', border: 'none', color: '#007bff', padding: 0 }}
              onClick={() => navigate('/register')}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;