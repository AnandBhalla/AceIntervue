import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import { Menu, User, X } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">AceIntervue</span>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/interview" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              AI Interview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/preparation" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Preparation
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/resume" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Resume
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cv" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              CV
            </Link>
          </li>
          {isLoggedIn && (
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
        
        <div className="nav-auth">
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="dropdown-toggle">
                <User size={20} />
              </button>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <button onClick={onLogout} className="dropdown-item">Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;