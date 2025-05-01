import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../Styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const res = await login({ username: email, password });
  
      if (res && res.status === 200) {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', res.data.user_id);
        // console.log(res.data.user_id);
        navigate('/dashboard');
      } else {
        setError('Login failed! Please check your credentials.');
      }
    } catch (err) {
      setError('Something went wrong while logging in.');
    }
  };
  

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to continue with AceIntervue</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
