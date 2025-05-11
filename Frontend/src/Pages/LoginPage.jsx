import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../Styles/AuthPages.css';
import { showToast } from '../utils/toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      setIsLoading(false);
      return;
    }

    const res = await login({ username: email, password });

    if (res?.data?.access_token) {
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', res.data.user_id);
      showToast('Login successful!', 'success');
      navigate('/dashboard');
    } else {
      showToast(res?.data?.message || 'Invalid credentials', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <h1>Welcome Back</h1>
        <p className='auth-subtitle'>Login to continue with AceIntervue</p>

        <form className='auth-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              className='form-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
            />
          </div>

          <div className='form-group'>
            <label className='form-label' htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              className='form-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
            />
          </div>

          {/* <div className='form-group forgot-password'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div> */}

          <button 
            type='submit' 
            className='btn auth-btn'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='auth-footer'>
          <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;