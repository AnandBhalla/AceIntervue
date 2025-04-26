import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/AuthPages.css';
import { signup } from '../services/api'; // Import the signup function from api.js

const SignupPage = () => {
  const navigate = useNavigate();

  // State variables for user input
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State variables for control flow
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);         // Step 1: Register user, 2: Verify Email
  const [emailSent, setEmailSent] = useState(false);

  // Step 1: Register User
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send the signup request using the API function
      const result = await signup({ name, email, password });

      if (result.status === 201) {
        // If user is successfully created, show email verification step
        setEmailSent(true);
        setError('');
        setStep(2);  // Move to email verification step
      }
    } catch (err) {
      // Handle error
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'An error occurred during signup');
      } else {
        setError('An unexpected error occurred');
      }
      setEmailSent(false);
      setStep(1);
    }
  };

  // Step 2: Verify Email (Confirmation)
  const handleVerifyEmail = () => {
    // Redirect to email verification page
    navigate("/verify-email"); // Adjust this if you have a specific route for email verification
  };

  // UI for each step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
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
                placeholder="Create a password"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="btn auth-btn">Sign Up</button>
          </form>
        );

      case 2:
        return (
          <div className="auth-form">
            <h3>We've sent you an email to verify your account.</h3>
            <p>Please check your inbox and follow the verification instructions.</p>
            {/* <button
              type="button"
              className="btn auth-btn"
              onClick={handleVerifyEmail}
            >
              Go to Verify Email Page
            </button> */}
            <div className="resend-email">
              <button
                type="button"
                className="text-btn"
                onClick={handleSubmit} // Optionally resend the verification email
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Main Return JSX
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          {step === 1 && "Join AceIntervue to start practicing"}
          {step === 2 && "Verify your email address"}
        </p>

        {error && <div className="error-message">{error}</div>}

        {renderStep()}

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
