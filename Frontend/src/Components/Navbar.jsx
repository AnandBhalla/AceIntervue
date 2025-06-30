
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { Menu, User, X, ChevronDown, Bot } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
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
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          
          <li 
            className="nav-item dropdown-container"
            onMouseEnter={() => handleDropdownEnter('interview')}
            onMouseLeave={handleDropdownLeave}
          >
            <Link to="/interview" className="nav-link dropdown-trigger" onClick={closeMenu}>
              AI Interview
              <ChevronDown size={16} className={`dropdown-arrow ${activeDropdown === 'interview' ? 'rotated' : ''}`} />
            </Link>
            <div className={`nav-dropdown ${activeDropdown === 'interview' ? 'active' : ''}`}>
              <Link to="/interview/technical" className="nav-dropdown-item" onClick={closeMenu}>
                Technical Interview
              </Link>
              <Link to="/interview/hr" className="nav-dropdown-item" onClick={closeMenu}>
                HR Interview
              </Link>
              <Link to="/interview/coding" className="nav-dropdown-item" onClick={closeMenu}>
                Coding Interview
              </Link>
              <Link to="/interview/company-specific" className="nav-dropdown-item" onClick={closeMenu}>
                Company Specific Interviews
              </Link>
              <Link to="/interview/resume-based" className="nav-dropdown-item" onClick={closeMenu}>
                Resume Based Interview
              </Link>
            </div>
          </li>


          <li 
            className="nav-item dropdown-container"
            onMouseEnter={() => handleDropdownEnter('resume')}
            onMouseLeave={handleDropdownLeave}
          >
            <Link to="/resume" className="nav-link dropdown-trigger" onClick={closeMenu}>
              Resume
              <ChevronDown size={16} className={`dropdown-arrow ${activeDropdown === 'resume' ? 'rotated' : ''}`} />
            </Link>
            <div className={`nav-dropdown ${activeDropdown === 'resume' ? 'active' : ''}`}>
              <Link to="/resume/builder" className="nav-dropdown-item" onClick={closeMenu}>
                <Bot size={16} className="dropdown-icon" />
                AI Builder
              </Link>
              <Link to="/resume/customizer" className="nav-dropdown-item" onClick={closeMenu}>
                <Bot size={16} className="dropdown-icon" />
                AI Customizer
              </Link>
              <Link to="/resume/analyzer" className="nav-dropdown-item" onClick={closeMenu}>
                <Bot size={16} className="dropdown-icon" />
                AI Analyzer
              </Link>
            </div>
          </li>


          {/* <li className="nav-item">
            <Link to="/preparation" className="nav-link" onClick={closeMenu}>
              Preparation
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/pricing" className="nav-link" onClick={closeMenu}>
              Pricing
            </Link>
          </li> */}
        </ul>
        
        <div className="nav-auth">
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="dropdown-toggle">
                <User size={20} />
              </button>
              <div className="dropdown-menu">
                <Link to="/about" className="dropdown-item">About Us</Link>
                <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                <Link to="/" onClick={onLogout} className="dropdown-item">LogOut</Link>
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
