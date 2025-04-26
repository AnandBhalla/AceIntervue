import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';

const VerifyEmailPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('useEffect running');
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setError('');
      setSuccess('');

      const verify = async () => {
        try {
          const result = await verifyEmail(token);
          if (result.status === 200) {
            setSuccess('Your email has been successfully verified!');
            setError('');
            navigate('/login');
          }
        } catch (err) {
          setError(err.response?.data?.detail || 'Something went wrong');
          setSuccess('');
        }
      };

      verify();
    } else {
      setError('Verification token is missing');
      setSuccess('');
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-page">
      <h1>Email Verification</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default VerifyEmailPage;
