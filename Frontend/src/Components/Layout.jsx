import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate for redirect
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();  // Initialize the navigation hook
  
  useEffect(() => {
    // Check if user is logged in by checking if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Use token's existence for check (or validate token here)
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token on logout
    setIsLoggedIn(false);
    navigate('/');  // Use navigate for redirection
  };

  return (
    <div className="app-layout">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
